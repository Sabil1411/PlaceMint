import { useState } from 'react'
import { useAuthStore } from '../store/auth'
import { useDataStore, matchScore } from '../store/data'

export default function Jobs() {
	const { user } = useAuthStore()
    const { jobs, applications, applyJob, profiles, addJob } = useDataStore()
	const [filter, setFilter] = useState('')
	const [jobForm, setJobForm] = useState({ title:'', company:'', dept:'CSE', stipend:'', skills:'' })

	const filtered = jobs.filter(j => j.title.toLowerCase().includes(filter.toLowerCase()) || j.company.toLowerCase().includes(filter.toLowerCase()))
	
	// Get student's skills from profile
	const studentProfile = user?.role === 'student' ? profiles.find(p => p.userId === user.uid) : null
	const studentSkills = studentProfile?.skills || []

	return (
		<div className="space-y-4">
			{user?.role === 'placement' && (
				<div className="card p-4 space-y-3">
					<div>
						<div className="font-semibold">Post New Job</div>
						<p className="text-sm text-gray-600">Publish openings directly for students based on company requirements.</p>
					</div>
					<div className="grid md:grid-cols-2 gap-3">
						<input className="border rounded p-2" placeholder="Job title" value={jobForm.title} onChange={e=>setJobForm({...jobForm, title:e.target.value})} />
						<input className="border rounded p-2" placeholder="Company" value={jobForm.company} onChange={e=>setJobForm({...jobForm, company:e.target.value})} />
						<input className="border rounded p-2" placeholder="Department" value={jobForm.dept} onChange={e=>setJobForm({...jobForm, dept:e.target.value})} />
						<input className="border rounded p-2" placeholder="Stipend / CTC" value={jobForm.stipend} onChange={e=>setJobForm({...jobForm, stipend:e.target.value})} />
						<input className="border rounded p-2 md:col-span-2" placeholder="Skills (comma separated)" value={jobForm.skills} onChange={e=>setJobForm({...jobForm, skills:e.target.value})} />
						<div className="md:col-span-2">
							<button
								className="btn"
								onClick={()=>{
									if (!jobForm.title || !jobForm.company) {
										window.alert('Please fill title and company')
										return
									}
									const skills = jobForm.skills.split(',').map(s=>s.trim()).filter(Boolean)
									addJob({ title: jobForm.title, company: jobForm.company, dept: jobForm.dept, stipend: Number(jobForm.stipend)||0, skills })
									setJobForm({ title:'', company:'', dept:'CSE', stipend:'', skills:'' })
									window.alert('Job posted successfully')
								}}
							>
								Post Job
							</button>
						</div>
					</div>
				</div>
			)}
			<div className="flex items-center gap-2">
				<input className="border rounded p-2 flex-1" placeholder="Search jobs" value={filter} onChange={e=>setFilter(e.target.value)} />
			</div>
			{user?.role === 'student' && !studentProfile && (
				<div className="bg-yellow-50 border border-yellow-200 rounded p-4">
					<div className="text-yellow-800 font-medium">Complete your profile first!</div>
					<div className="text-yellow-700 text-sm mt-1">Add your skills to get better job matches and apply for positions.</div>
				</div>
			)}
			<div className="grid md:grid-cols-2 gap-3">
				{filtered.map(j => {
                    const hasApplied = user?.role==='student' && applications.some(a => a.userId===user.uid && a.jobId===j.id)
					const matchPercentage = user?.role==='student' ? matchScore(j.skills, studentSkills) : 0
					return (
					<div key={j.id} className="card p-4">
						<div className="flex items-center justify-between">
							<div>
								<div className="font-semibold">{j.title}</div>
								<div className="text-sm text-gray-600">{j.company} · {j.dept} · ₹{j.stipend}</div>
							</div>
							{user?.role==='student' && (
								<div className={`text-sm font-medium ${matchPercentage >= 70 ? 'text-green-600' : matchPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
									Match {matchPercentage}%
								</div>
							)}
						</div>
						<div className="text-sm text-gray-700 mt-2">Skills: {j.skills.join(', ')}</div>
						<div className="mt-3 flex gap-2">
							{user?.role==='student' && (
								<button
									className={`btn ${(hasApplied || matchPercentage < 60) ? 'opacity-60 cursor-not-allowed' : ''}`}
									disabled={hasApplied || matchPercentage < 60}
									onClick={() => {
										if (hasApplied) return
										if (matchPercentage < 60) {
											window.alert(`Your profile matches only ${matchPercentage}%. Minimum 60% required to apply.`)
											return
										}
										applyJob({ userId: user.uid, jobId: j.id })
										window.alert('Applied successfully')
									}}
								>
									{hasApplied ? 'Applied' : (matchPercentage < 60 ? `Match ${matchPercentage}% (60% required)` : 'Apply')}
								</button>
							)}
						</div>
					</div>
					)
					})}
				{filtered.length === 0 && (
					<div className="col-span-2 text-center text-gray-600 py-8">
						No jobs found. Try adjusting your search criteria.
					</div>
				)}
			</div>
		</div>
	)
}


