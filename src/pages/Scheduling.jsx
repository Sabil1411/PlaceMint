import dayjs from 'dayjs'
import { useState } from 'react'
import { useAuthStore } from '../store/auth'
import { useDataStore } from '../store/data'

export default function Scheduling() {
    const { user } = useAuthStore()
    const { applications, interviews, scheduleInterview, jobs, approvals, setInterviewResult } = useDataStore()
	const [when, setWhen] = useState('')
	
	// Filter applications based on user role
	const approvedApplications = applications.filter(a => {
		const approval = approvals.find(x => x.applicationId === a.id)
		return approval?.status === 'approved'
	})
	
	// For students, show their own approved applications
	// For placement cell, show all approved applications
	const filteredApplications = user?.role === 'student' 
		? approvedApplications.filter(a => a.userId === user.uid)
		: approvedApplications
	
	return (
		<div className="space-y-3">
			<h1 className="text-xl font-semibold">
				{user?.role === 'student' ? 'My Interview Schedule' : 'Interview Scheduling'}
			</h1>
			<div className="grid md:grid-cols-2 gap-3">
                {filteredApplications.map(a=>{
					const job = jobs.find(j=>j.id===a.jobId)
					const iv = interviews.find(i=>i.applicationId===a.id)
					return (
						<div key={a.id} className="card p-4">
							<div className="font-medium">{job?.title} - {job?.company}</div>
							{iv ? (
                                <div className="mt-2">
                                    <div className="text-sm text-gray-600">Scheduled: {dayjs(iv.when).format('DD MMM YYYY HH:mm')}</div>
                                    <div className={`text-sm font-medium mt-1 ${
                                        iv.status === 'cleared' ? 'text-freshLime' : 
                                        iv.status === 'not_cleared' ? 'text-red-600' : 
                                        'text-tealAccent'
                                    }`}>
                                        Status: {iv.status.replace('_', ' ').toUpperCase()}
                                    </div>
                                </div>
							) : user?.role === 'placement' ? (
								<div className="mt-2 flex gap-2">
									<input className="border rounded p-2 flex-1" type="datetime-local" value={when} onChange={e=>setWhen(e.target.value)} />
									<button className="btn" onClick={()=>when && scheduleInterview({ applicationId: a.id, when: new Date(when).toISOString() })}>Schedule</button>
								</div>
							) : (
								<div className="text-sm text-gray-500 mt-2">Interview not scheduled yet</div>
							)}
                            {iv && user?.role === 'placement' && (
                                <div className="mt-2 flex gap-2">
                                    <button className="btn" onClick={()=>setInterviewResult({ applicationId: a.id, status: 'cleared' })}>Mark Cleared</button>
                                    <button className="btn" onClick={()=>setInterviewResult({ applicationId: a.id, status: 'not_cleared' })}>Mark Not Cleared</button>
                                </div>
                            )}
						</div>
					)
				})}
				{filteredApplications.length === 0 && (
					<div className="col-span-2 text-center text-gray-600 py-8">
						{user?.role === 'student' ? 'No approved applications found. Complete the application process to see interview schedules.' : 'No approved applications to schedule interviews for.'}
					</div>
				)}
			</div>
		</div>
	)
}


