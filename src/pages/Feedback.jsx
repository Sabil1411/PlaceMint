import { useState } from 'react'
import { useAuthStore } from '../store/auth'
import { useDataStore } from '../store/data'

export default function Feedback() {
	const { user } = useAuthStore()
	const { applications, jobs, feedbacks, submitFeedback, approvals, profiles } = useDataStore()
	const [score, setScore] = useState(8)
	const [comment, setComment] = useState('')
	const [selectedStudent, setSelectedStudent] = useState('')
	
	// For students, only show received feedback
	if (user?.role === 'student') {
		const myApplications = applications.filter(a => a.userId === user.uid)
		const myFeedbacks = myApplications.map(a => {
			const job = jobs.find(j => j.id === a.jobId)
			const fb = feedbacks.find(f => f.applicationId === a.id)
			return { application: a, job, feedback: fb }
		}).filter(item => item.feedback) // Only show applications with feedback
		
		return (
			<div className="space-y-3">
				<h1 className="text-xl font-semibold">Feedback Received</h1>
				<div className="grid md:grid-cols-2 gap-3">
					{myFeedbacks.map(({ application, job, feedback }) => (
						<div key={application.id} className="card p-4">
							<div className="font-medium">{job?.title} - {job?.company}</div>
							<div className="text-sm text-gray-600 mt-1">Application Status: {application.status}</div>
							<div className="mt-3 p-3 bg-freshLime/5 rounded">
								<div className="text-sm text-forest">
									<span className="font-medium">Score: </span>
									<span className="text-freshLime font-semibold">{feedback.score}/10</span>
								</div>
								<div className="text-sm text-forest mt-2">
									<span className="font-medium">Comment: </span>
									<span>{feedback.comment}</span>
								</div>
								<div className="text-xs text-gray-500 mt-2">
									Received on: {new Date(feedback.createdAt).toLocaleDateString()}
								</div>
							</div>
						</div>
					))}
						{myFeedbacks.length === 0 && (
						<div className="col-span-2 text-center text-gray-600 py-8">
								No feedback received yet. Complete applications to receive feedback from the placement cell or companies.
						</div>
					)}
				</div>
			</div>
		)
	}
	
	if (user?.role === 'company') {
		const eligibleApps = applications.filter(a=>{
			const approval = approvals.find(ap=>ap.applicationId===a.id)
			return approval?.status === 'approved'
		})
		return (
			<div className="space-y-3">
				<h1 className="text-xl font-semibold">Company Feedback</h1>
				<p className="text-sm text-gray-600">Share structured feedback to help students improve.</p>
				<div className="card p-4 space-y-3">
					<select className="input-field" value={selectedStudent} onChange={e=>setSelectedStudent(e.target.value)}>
						<option value="">Select approved application</option>
						{eligibleApps.map(a=>{
							const job = jobs.find(j=>j.id===a.jobId)
							const student = profiles.find(p=>p.userId===a.userId)
							return (
								<option key={a.id} value={a.id}>{student?.name || a.userId} - {job?.title} ({job?.company})</option>
							)
						})}
					</select>
					<div className="grid md:grid-cols-2 gap-3">
						<label className="block">
							<span className="text-sm text-gray-600">Score (1-10)</span>
							<input type="number" min="1" max="10" value={score} onChange={e=>setScore(Number(e.target.value))} className="input-field" />
						</label>
						<label className="block md:col-span-2">
							<span className="text-sm text-gray-600">Feedback</span>
							<textarea className="input-field" rows="3" value={comment} onChange={e=>setComment(e.target.value)} />
						</label>
					</div>
					<button
						className="btn w-full"
						onClick={()=>{
							if (!selectedStudent) {
								window.alert('Select an application first')
								return
							}
							submitFeedback({ applicationId: selectedStudent, score, comment })
							setSelectedStudent('')
							setComment('')
							setScore(8)
							window.alert('Feedback submitted')
						}}
					>
						Submit Feedback
					</button>
				</div>
			</div>
		)
	}
	
	// Placement view - tracking feedback coverage
	return (
		<div className="space-y-3">
			<h1 className="text-xl font-semibold">Feedback Tracker</h1>
			<div className="grid md:grid-cols-2 gap-3">
				{applications.filter(a=>{
					if (user?.role==='placement') {
						const appr = approvals.find(x=>x.applicationId===a.id)
						return appr?.status==='approved'
					}
					return false
				}).map(a=>{
					const job = jobs.find(j=>j.id===a.jobId)
					const fb = feedbacks.find(f=>f.applicationId===a.id)
					return (
						<div key={a.id} className="card p-4 space-y-2">
							<div className="font-medium">{job?.title} - {job?.company}</div>
							{fb ? (
								<div className="text-sm text-gray-600">Score: {fb.score} · {fb.comment}</div>
							) : (
								<div className="text-sm text-gray-500">Awaiting feedback from company</div>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}


