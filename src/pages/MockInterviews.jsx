export default function MockInterviews() {
	return (
		<div className="space-y-4">
			<div className="card p-5">
				<h1 className="text-2xl font-semibold text-forest">Mock Interviews</h1>
				<p className="text-gray-600 mt-2">
					Practice sessions designed to mirror real interview experiences. Schedule and track your progress to boost
					confidence before the actual drive.
				</p>
			</div>
			<div className="grid md:grid-cols-2 gap-4">
				{[
					{
						title: 'Technical Round',
						desc: 'Code reviews, problem solving, and debugging scenarios conducted by mentors.'
					},
					{
						title: 'HR & Behavioral',
						desc: 'Improve your storytelling, strengths articulation, and cultural fit answers.'
					}
				].map(section => (
					<div key={section.title} className="card p-4 space-y-2 border border-forest/10">
						<div className="text-lg font-semibold text-forest">{section.title}</div>
						<p className="text-gray-600 text-sm">{section.desc}</p>
						<button className="btn w-fit">Schedule Session</button>
					</div>
				))}
			</div>
		</div>
	)
}


