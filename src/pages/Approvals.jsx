import { useAuthStore } from '../store/auth'
import { useDataStore } from '../store/data'

export default function Approvals() {
    const { user } = useAuthStore()
    const { approvals, applications, jobs, setApproval, users, enrollments, postJobFromEnrollment, profiles } = useDataStore()
    const list = approvals
	return (
		<div className="space-y-3">
            <h1 className="text-xl font-semibold">Approvals</h1>
            {user?.role==='placement' && (
                <div className="card p-4 space-y-3">
                    <div className="font-semibold">Company Enrollments</div>
                    <div className="grid md:grid-cols-2 gap-2">
                        {enrollments.map(e => (
                            <div key={e.id} className="border rounded p-3">
                                <div className="font-medium">{e.company} · {e.post}</div>
                                <div className="text-sm text-gray-600">Salary: {e.salary} · Criteria: {e.criteria}</div>
                                <div className="text-sm text-gray-600">Skills: {e.skills.join(', ')}</div>
                                <div className="mt-2">
                                    {e.status!=='posted' ? (
                                        <button className="btn" onClick={()=>postJobFromEnrollment({ enrollmentId: e.id })}>Post Job</button>
                                    ) : (
                                        <span className="text-sm text-green-700">Posted</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {enrollments.length===0 && <div className="text-sm text-gray-600">No enrollments yet</div>}
                    </div>
                </div>
            )}
            {user?.role==='placement' && (
                <div className="card p-4 space-y-3">
                    <h2 className="text-lg font-semibold">Add Recruiter</h2>
                    <form onSubmit={(e)=>{
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        const recruiter = {
                            name: formData.get('name'),
                            email: formData.get('email'),
                            role: 'recruiter'
                        }
                        users.push(recruiter)
                        alert('Recruiter added successfully')
                        e.target.reset()
                    }}>
                        <div className="grid gap-2">
                            <input name="name" className="border rounded p-2" placeholder="Recruiter Name" required />
                            <input name="email" type="email" className="border rounded p-2" placeholder="Recruiter Email" required />
                            <button type="submit" className="btn">Add Recruiter</button>
                        </div>
                    </form>
                </div>
            )}
            {user?.role==='placement' && (
                <div className="card p-4 space-y-2">
                    <div className="font-semibold">Approved Applications</div>
                    <div className="grid md:grid-cols-2 gap-2">
                        {approvals.filter(a=>a.status==='approved').map(a=>{
                            const app = applications.find(x=>x.id===a.applicationId)
                            const job = jobs.find(j=>j.id===app?.jobId)
                            const studentProfile = profiles.find(p=>p.userId===app?.userId)
                            return (
                                <div key={a.id} className="border rounded p-3">
                                    <div className="font-medium">{job?.title} at {job?.company}</div>
                                    {studentProfile && <div className="text-sm text-gray-600">Student: {studentProfile.name} ({studentProfile.department})</div>}
                                    <div className="text-sm text-green-700">Status: Approved</div>
                                </div>
                            )
                        })}
                        {approvals.filter(a=>a.status==='approved').length===0 && (
                            <div className="text-sm text-gray-600">No approved applications yet</div>
                        )}
                    </div>
                </div>
            )}
			<div className="grid md:grid-cols-2 gap-3">
				{list.map(a=>{
					const app = applications.find(x=>x.id===a.applicationId)
					const job = jobs.find(j=>j.id===app?.jobId)
                    const studentProfile = profiles.find(p=>p.userId===app?.userId)
					return (
						<div key={a.id} className="card p-4">
                            <div className="font-medium">{job?.title} at {job?.company}</div>
                            {studentProfile && <div className="text-sm text-gray-600">Student: {studentProfile.name} ({studentProfile.department})</div>}
							<div className="text-sm text-gray-600">Approval status: {a.status}</div>
							{a.status==='requested' && (
								<div className="mt-2 flex gap-2">
									<button className="btn" onClick={()=>setApproval({ approvalId: a.id, status: 'approved' })}>Approve</button>
									<button className="btn" onClick={()=>setApproval({ approvalId: a.id, status: 'rejected' })}>Reject</button>
								</div>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}


