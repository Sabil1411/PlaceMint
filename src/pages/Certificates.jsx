import dayjs from 'dayjs'
import { useAuthStore } from '../store/auth'
import { useDataStore } from '../store/data'

export default function Certificates() {
	const { user } = useAuthStore()
    const { applications, jobs, certificates, issueCertificate, interviews } = useDataStore()
	const myApps = user?.role==='student' ? applications.filter(a=>a.userId===user.uid) : applications
	
	if (user?.role === 'company') {
		const readyForCertificate = applications.map(a=>{
			const job = jobs.find(j=>j.id===a.jobId)
			const interview = interviews.find(i=>i.applicationId===a.id)
			const cert = certificates.find(c=>c.applicationId===a.id)
			return { application:a, job, interview, certificate: cert }
		})
		return (
			<div className="space-y-3">
				<h1 className="text-xl font-semibold">Issue Certificates</h1>
				<div className="grid md:grid-cols-2 gap-3">
					{readyForCertificate.map(({ application, job, interview, certificate })=>(
						<div key={application.id} className="card p-4 space-y-2">
							<div className="font-medium">{job?.title} - {job?.company}</div>
							<div className="text-sm text-gray-600">Applicant Status: {application.status}</div>
							{interview && (
								<div className="text-xs text-gray-500">Interview: {interview.status}</div>
							)}
							{certificate ? (
								<div className="text-sm text-green-700 mt-2">Issued on {dayjs(certificate.issuedAt).format('DD MMM YYYY')}</div>
							) : (
								<button
									className="btn w-full"
									onClick={()=>issueCertificate({ applicationId: application.id })}
									disabled={interview?.status !== 'cleared'}
								>
									{interview?.status === 'cleared' ? 'Issue Certificate' : 'Awaiting Interview Clearance'}
								</button>
							)}
						</div>
					))}
				</div>
			</div>
		)
	}
	
	if (user?.role !== 'student') {
		return <div className="text-sm text-gray-600">Access restricted.</div>
	}
	
	return (
		<div className="space-y-3">
			<h1 className="text-xl font-semibold">My Certificates</h1>
			<div className="grid md:grid-cols-2 gap-3">
				{myApps.map(a=>{
					const job = jobs.find(j=>j.id===a.jobId)
					const cert = certificates.find(c=>c.applicationId===a.id)
                    const iv = interviews.find(i=>i.applicationId===a.id)
                    return (
						<div key={a.id} className="card p-4">
							<div className="font-medium">{job?.title} - {job?.company}</div>
							<div className="text-sm text-gray-600 mt-1">Status: {a.status}</div>
							{cert ? (
								<div className="mt-3">
									<div className="text-sm text-green-700 mb-2">✓ Certificate Issued: {dayjs(cert.issuedAt).format('DD MMM YYYY')}</div>
									<div className="flex gap-2">
										<button className="btn" onClick={() => window.open(`data:text/plain,Certificate%20for%20${encodeURIComponent(job?.title||'')}%20at%20${encodeURIComponent(job?.company||'')}`, '_blank')}>View Certificate</button>
										<a className="btn" href={`data:text/plain,Certificate%20for%20${encodeURIComponent(job?.title||'')}%20at%20${encodeURIComponent(job?.company||'')}`} download={`certificate-${a.id}.txt`}>Download</a>
									</div>
								</div>
							) : (
								<div className="text-sm text-gray-600 mt-2">
									{iv?.status === 'cleared' ? 'Certificate will be issued soon' : 'Complete the interview process to receive certificate'}
								</div>
							)}
						</div>
					)
				})}
				{myApps.length === 0 && (
					<div className="col-span-2 text-center text-gray-600 py-8">
						No applications found. Apply for jobs to receive certificates upon completion.
					</div>
				)}
			</div>
		</div>
	)
}


