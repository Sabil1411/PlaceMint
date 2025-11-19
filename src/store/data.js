import { create } from 'zustand'
import { db } from '../lib/firebase'
import { ref, push, set as dbSet, update as dbUpdate, onValue, get as dbGet } from 'firebase/database'

function mapChildrenToArray(snapshot) {
	const arr = []
	snapshot.forEach((child) => {
		arr.push({ id: child.key, ...child.val() })
	})
	return arr.reverse()
}

export const useDataStore = create((set, get) => {
	// initial empty state
	const initial = {
		users: [],
		jobs: [],
		applications: [],
		approvals: [],
		interviews: [],
		feedbacks: [],
		certificates: [],
		enrollments: [],
		profiles: [],
		// training program
		aptitudeTests: [],
		aptitudeResults: [],
		mockSessions: [],
		mockResults: [],
		resources: []
	}

	// realtime listeners
	onValue(ref(db, 'jobs'), (snap) => {
		if (snap.exists()) set({ jobs: mapChildrenToArray(snap) })
		else set({ jobs: [] })
	})
	onValue(ref(db, 'enrollments'), (snap) => {
		if (snap.exists()) set({ enrollments: mapChildrenToArray(snap) })
		else set({ enrollments: [] })
	})
	onValue(ref(db, 'applications'), (snap) => {
		if (snap.exists()) set({ applications: mapChildrenToArray(snap) })
		else set({ applications: [] })
	})
	onValue(ref(db, 'approvals'), (snap) => {
		if (snap.exists()) set({ approvals: mapChildrenToArray(snap) })
		else set({ approvals: [] })
	})
	onValue(ref(db, 'interviews'), (snap) => {
		if (snap.exists()) set({ interviews: mapChildrenToArray(snap) })
		else set({ interviews: [] })
	})
	onValue(ref(db, 'feedbacks'), (snap) => {
		if (snap.exists()) set({ feedbacks: mapChildrenToArray(snap) })
		else set({ feedbacks: [] })
	})
	onValue(ref(db, 'certificates'), (snap) => {
		if (snap.exists()) set({ certificates: mapChildrenToArray(snap) })
		else set({ certificates: [] })
	})
	onValue(ref(db, 'profiles'), (snap) => {
		if (snap.exists()) set({ profiles: mapChildrenToArray(snap) })
		else set({ profiles: [] })
	})
	// training listeners
	onValue(ref(db, 'aptitudeTests'), (snap) => {
		if (snap.exists()) set({ aptitudeTests: mapChildrenToArray(snap) })
		else set({ aptitudeTests: [] })
	})
	onValue(ref(db, 'aptitudeResults'), (snap) => {
		if (snap.exists()) set({ aptitudeResults: mapChildrenToArray(snap) })
		else set({ aptitudeResults: [] })
	})
	onValue(ref(db, 'mockSessions'), (snap) => {
		if (snap.exists()) set({ mockSessions: mapChildrenToArray(snap) })
		else set({ mockSessions: [] })
	})
	onValue(ref(db, 'mockResults'), (snap) => {
		if (snap.exists()) set({ mockResults: mapChildrenToArray(snap) })
		else set({ mockResults: [] })
	})
	onValue(ref(db, 'resources'), (snap) => {
		if (snap.exists()) set({ resources: mapChildrenToArray(snap) })
		else set({ resources: [] })
	})

	return {
		...initial,
		addEnrollment: async (enr) => {
			const skills = String(enr.skills||'').split(',').map(s=>s.trim()).filter(Boolean)
			const data = { company: enr.company, post: enr.post, salary: enr.salary, criteria: enr.criteria, skills, status: 'new' }
			const keyRef = push(ref(db, 'enrollments'))
			await dbSet(keyRef, data)
		},
		postJobFromEnrollment: async ({ enrollmentId, dept='CSE' }) => {
			const enr = get().enrollments.find(e=>e.id===enrollmentId)
			if (!enr) return
			const job = { title: enr.post, company: enr.company, stipend: Number(enr.salary)||0, dept, skills: enr.skills, conversion: 0.5 }
			const jobRef = push(ref(db, 'jobs'))
			await dbSet(jobRef, job)
			await dbUpdate(ref(db, `enrollments/${enrollmentId}`), { status: 'posted' })
		},
		setStudentProfile: async (profile) => {
			const skills = Array.isArray(profile.skills)? profile.skills : String(profile.skills||'').split(',').map(s=>s.trim()).filter(Boolean)
			await dbSet(ref(db, `profiles/${profile.userId}`), { ...profile, skills })
		},
		addJob: async (job) => {
			const keyRef = push(ref(db, 'jobs'))
			await dbSet(keyRef, job)
		},
		applyJob: async ({ userId, jobId }) => {
			const exists = get().applications.find(a => a.userId===userId && a.jobId===jobId)
			if (exists) return
			const appRef = push(ref(db, 'applications'))
			const app = { userId, jobId, status: 'pending', createdAt: Date.now() }
			await dbSet(appRef, app)
			const apprRef = push(ref(db, 'approvals'))
			await dbSet(apprRef, { applicationId: appRef.key, status: 'requested' })
		},
		setApproval: async ({ approvalId, status }) => {
			await dbUpdate(ref(db, `approvals/${approvalId}`), { status })
		},
		scheduleInterview: async ({ applicationId, when }) => {
			const intRef = push(ref(db, 'interviews'))
			await dbSet(intRef, { applicationId, when, status: 'scheduled' })
		},
		setInterviewResult: async ({ applicationId, status }) => {
			const found = get().interviews.find(i=> i.applicationId===applicationId)
			if (!found) return
			await dbUpdate(ref(db, `interviews/${found.id}`), { status })
		},
		submitFeedback: async ({ applicationId, score, comment }) => {
			const fbRef = push(ref(db, 'feedbacks'))
			await dbSet(fbRef, { applicationId, score, comment, createdAt: Date.now() })
		},
		issueCertificate: async ({ applicationId }) => {
			const certRef = push(ref(db, 'certificates'))
			await dbSet(certRef, { applicationId, issuedAt: Date.now() })
		},
		// training actions
		createAptitudeTest: async ({ title, description, startAt, durationMinutes, questions = [], randomize=false, navigationMode='free' }) => {
			const test = { title, description: description||'', startAt: Number(startAt), durationMinutes: Number(durationMinutes)||60, questions, published: false, randomize: !!randomize, navigationMode }
			const keyRef = push(ref(db, 'aptitudeTests'))
			await dbSet(keyRef, test)
		},
		publishAptitudeTest: async ({ testId }) => {
			await dbUpdate(ref(db, `aptitudeTests/${testId}`), { published: true })
		},
		addQuestionToTest: async ({ testId, question }) => {
			const testSnap = await dbGet(ref(db, `aptitudeTests/${testId}`))
			if (!testSnap.exists()) return
			const test = testSnap.val()
			const questions = Array.isArray(test.questions) ? test.questions : []
			questions.push(question)
			await dbUpdate(ref(db, `aptitudeTests/${testId}`), { questions })
		},
		assignTestToUsers: async ({ testId, userIds }) => {
			const existing = (await dbGet(ref(db, `aptitudeTests/${testId}/assignedTo`))).val() || []
			const setAssigned = Array.from(new Set([...(existing||[]), ...userIds]))
			await dbUpdate(ref(db, `aptitudeTests/${testId}`), { assignedTo: setAssigned })
		},
		submitAptitudeResult: async ({ testId, userId, score, answers }) => {
			const resRef = push(ref(db, 'aptitudeResults'))
			await dbSet(resRef, { testId, userId, score: Number(score)||0, answers, submittedAt: Date.now() })
		},
		scheduleMockSession: async ({ title, dateTime, durationMinutes, panel = '' }) => {
			const keyRef = push(ref(db, 'mockSessions'))
			await dbSet(keyRef, { title, dateTime: Number(dateTime), durationMinutes: Number(durationMinutes)||30, panel, slots: [] })
		},
		bookMockSlot: async ({ sessionId, userId }) => {
			const session = get().mockSessions.find(s=>s.id===sessionId)
			if (!session) return
			const slots = Array.isArray(session.slots)? session.slots : []
			if (slots.includes(userId)) return
			await dbUpdate(ref(db, `mockSessions/${sessionId}`), { slots: [...slots, userId] })
		},
		setMockResult: async ({ sessionId, userId, result, feedback }) => {
			const keyRef = push(ref(db, 'mockResults'))
			await dbSet(keyRef, { sessionId, userId, result, feedback, recordedAt: Date.now() })
		},
		addResource: async ({ title, url, category }) => {
			const keyRef = push(ref(db, 'resources'))
			await dbSet(keyRef, { title, url, category: category||'general', addedAt: Date.now() })
		}
	}
})

export function matchScore(skillsRequired, studentSkills) {
	const setReq = new Set(skillsRequired.map(s=>s.toLowerCase()))
	const setStu = new Set(studentSkills.map(s=>s.toLowerCase()))
	let matched = 0
	for (const s of setReq) if (setStu.has(s)) matched++
	return Math.round((matched / Math.max(1, setReq.size)) * 100)
}


