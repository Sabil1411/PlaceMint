import { useMemo } from 'react'
import { useDataStore } from '../store/data'

export default function Analytics() {
	const { applications, approvals, interviews, certificates, aptitudeTests, aptitudeResults, mockSessions } = useDataStore()
	const stats = useMemo(()=>({
		applications: applications.length,
		approved: approvals.filter(a=>a.status==='approved').length,
		interviews: interviews.length,
		certificates: certificates.length,
		tests: aptitudeTests.length,
		attempts: aptitudeResults.length,
		mockSessions: mockSessions.length
	}), [applications, approvals, interviews, certificates, aptitudeTests, aptitudeResults, mockSessions])

	return (
		<div className="space-y-3">
			<h1 className="text-xl font-semibold">Placement Analytics</h1>
			<div className="grid md:grid-cols-4 gap-3">
				{Object.entries(stats).map(([k,v])=> (
					<div key={k} className="card p-4 text-center">
						<div className="text-sm text-gray-600">{k}</div>
						<div className="text-2xl font-semibold">{v}</div>
					</div>
				))}
			</div>
		</div>
	)
}


