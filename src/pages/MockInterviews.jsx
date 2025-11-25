import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useAuthStore } from '../store/auth'
import { useDataStore } from '../store/data'

const SESSION_TYPES = [
	{
		title: 'Technical Round',
		desc: 'Code reviews, problem solving, and debugging scenarios conducted by mentors.'
	},
	{
		title: 'HR & Behavioral',
		desc: 'Improve your storytelling, strengths articulation, and cultural fit answers.'
	}
]

export default function MockInterviews() {
	const { user } = useAuthStore()
	const { mockSessions, scheduleMockSession } = useDataStore()
	const [activeType, setActiveType] = useState('')
	const [draft, setDraft] = useState({ title: '', dateTime: '', durationMinutes: 30, panel: '' })
	const isPlacement = user?.role === 'placement'
	const sortedSessions = useMemo(() => [...mockSessions].sort((a, b) => Number(a.dateTime||0) - Number(b.dateTime||0)), [mockSessions])

	const handleOpenForm = (title) => {
		if (!isPlacement) return
		setActiveType(title)
		setDraft(prev => ({ ...prev, title, dateTime: '', durationMinutes: 30, panel: '' }))
	}

	const handleSchedule = async (e) => {
		e.preventDefault()
		if (!draft.title || !draft.dateTime) {
			window.alert('Enter a title and date/time to schedule the session.')
			return
		}
		await scheduleMockSession({
			title: draft.title,
			dateTime: new Date(draft.dateTime).getTime(),
			durationMinutes: Number(draft.durationMinutes) || 30,
			panel: draft.panel
		})
		setActiveType('')
		setDraft({ title: '', dateTime: '', durationMinutes: 30, panel: '' })
		window.alert('Mock interview session scheduled!')
	}

	return (
		<div className="space-y-6">
			<div className="card p-5">
				<h1 className="text-2xl font-semibold text-forest">Mock Interviews</h1>
				<p className="text-gray-600 mt-2">
					Practice sessions designed to mirror real interview experiences. Schedule and track your progress to boost
					confidence before the actual drive.
				</p>
			</div>
			<div className="grid md:grid-cols-2 gap-4">
				{SESSION_TYPES.map(section => (
					<div key={section.title} className="card p-4 space-y-3 border border-forest/10">
						<div>
							<div className="text-lg font-semibold text-forest">{section.title}</div>
							<p className="text-gray-600 text-sm">{section.desc}</p>
						</div>
						<button
							type="button"
							className={`btn w-fit ${!isPlacement ? 'opacity-60 cursor-not-allowed' : ''}`}
							onClick={()=>handleOpenForm(section.title)}
							disabled={!isPlacement}
						>
							Schedule Session
						</button>
						{isPlacement && activeType === section.title && (
							<form className="space-y-3" onSubmit={handleSchedule}>
								<div className="grid md:grid-cols-2 gap-3">
									<input className="input-field" placeholder="Session title" value={draft.title} onChange={e=>setDraft(v=>({ ...v, title: e.target.value }))} />
									<input className="input-field" type="datetime-local" value={draft.dateTime} onChange={e=>setDraft(v=>({ ...v, dateTime: e.target.value }))} />
								</div>
								<div className="grid md:grid-cols-2 gap-3">
									<input className="input-field" type="number" min="15" max="180" value={draft.durationMinutes} onChange={e=>setDraft(v=>({ ...v, durationMinutes: e.target.value }))} placeholder="Duration (minutes)" />
									<input className="input-field" placeholder="Panel / Mentor" value={draft.panel} onChange={e=>setDraft(v=>({ ...v, panel: e.target.value }))} />
								</div>
								<div className="flex gap-2 justify-end">
									<button type="button" className="btn-outline" onClick={()=>{setActiveType(''); setDraft({ title: '', dateTime: '', durationMinutes: 30, panel: '' })}}>Cancel</button>
									<button type="submit" className="btn">Save Session</button>
								</div>
							</form>
						)}
					</div>
				))}
			</div>
			<div className="card p-4 space-y-3">
				<div className="text-lg font-semibold text-forest">Upcoming Sessions</div>
				{sortedSessions.length === 0 && <div className="text-sm text-gray-500">No sessions scheduled yet.</div>}
				{sortedSessions.map(session => (
					<div key={session.id} className="border border-forest/10 rounded p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
						<div>
							<div className="font-medium">{session.title}</div>
							<div className="text-xs text-gray-600">{dayjs(Number(session.dateTime)).format('DD MMM YYYY · HH:mm')}</div>
						</div>
						<div className="text-sm text-gray-600">{session.durationMinutes} mins {session.panel && `• ${session.panel}`}</div>
					</div>
				))}
			</div>
		</div>
	)
}


