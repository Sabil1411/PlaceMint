import dayjs from 'dayjs'
import { useAuthStore } from '../store/auth'
import { useDataStore } from '../store/data'

export default function Applications() {
	const { user } = useAuthStore()
    const { applications, jobs, interviews, profiles } = useDataStore()
	if (!user) return null
	
	// For students, show their own applications. Other roles don't view here.
	const mine = user.role === 'student' ? applications.filter(a => a.userId === user.uid) : []
	
	return (
		<div className="space-y-3">
			<h1 className="text-xl font-semibold">My Applications</h1>
			<div className="grid md:grid-cols-2 gap-3">
                {mine.map(a=>{
					const job = jobs.find(j=>j.id===a.jobId)
                    const iv = interviews.find(i=>i.applicationId===a.id)
					const studentProfile = profiles.find(p => p.userId === a.userId)
					return (
						<div key={a.id} className="card p-4">
							<div className="font-medium">{job?.title} at {job?.company}</div>

							<div className="text-sm text-gray-600">Applied {dayjs(a.createdAt).format('DD MMM YYYY HH:mm')}</div>
							<div className="mt-1 text-sm">Status: {a.status}</div>
                            {iv && (
                                <div className="mt-1 text-sm text-indigo-700">Interview: {dayjs(iv.when).format('DD MMM YYYY HH:mm')} · {iv.status}</div>
                            )}
						</div>
					)
				})}
				{mine.length === 0 && (
					<div className="col-span-2 text-center text-gray-600 py-8">
						No applications found. Apply for jobs to see them here.
					</div>
				)}
			</div>
		</div>
	)
}


