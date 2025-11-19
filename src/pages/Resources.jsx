import { useState } from 'react'
import { useDataStore } from '../store/data'
import { useAuthStore } from '../store/auth'

export default function Resources() {
    const { resources, addResource } = useDataStore()
    const { user } = useAuthStore()
    const [draft, setDraft] = useState({ title: '', url: '', category: 'aptitude' })

    async function onAdd(e) {
        e.preventDefault()
        if (!draft.title || !draft.url) return
        await addResource(draft)
        setDraft({ title: '', url: '', category: 'aptitude' })
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Training Resources</h1>
                <p className="text-gray-600">Curated videos and links for aptitude and interviews.</p>
            </div>

            {user?.role === 'placement' && (
                <form onSubmit={onAdd} className="border rounded p-4 space-y-3">
                    <div className="font-semibold">Add Resource</div>
                    <div className="grid md:grid-cols-3 gap-3">
                        <input className="input" placeholder="Title" value={draft.title} onChange={e=>setDraft(v=>({...v, title: e.target.value}))} />
                        <input className="input" placeholder="URL" value={draft.url} onChange={e=>setDraft(v=>({...v, url: e.target.value}))} />
                        <select className="input" value={draft.category} onChange={e=>setDraft(v=>({...v, category: e.target.value}))}>
                            <option value="aptitude">Aptitude</option>
                            <option value="interview">Interview</option>
                            <option value="resume">Resume</option>
                            <option value="general">General</option>
                        </select>
                    </div>
                    <button className="btn">Add</button>
                </form>
            )}

            <div className="grid md:grid-cols-2 gap-4">
                {resources.map(r => (
                    <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="border border-forest/10 rounded p-4 transition-colors hover:border-tealAccent hover:shadow-md">
                        <div className="text-xs text-gray-600 uppercase">{r.category}</div>
                        <div className="font-medium">{r.title}</div>
                    </a>
                ))}
                {resources.length === 0 && <div className="text-sm text-gray-500">No resources yet.</div>}
            </div>
        </div>
    )
}




