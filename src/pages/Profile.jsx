import { useState, useMemo } from 'react'
import { useAuthStore } from '../store/auth'
import { useDataStore } from '../store/data'

export default function Profile() {
    const { user } = useAuthStore()
    const { profiles, setStudentProfile } = useDataStore()
    const existing = useMemo(()=> profiles.find(p=>p.userId===user?.uid), [profiles, user])
    const [form, setForm] = useState({
        name: existing?.name || user?.name || '',
        usn: existing?.usn || '',
        department: existing?.department || '',
        course: existing?.course || '',
        skills: (existing?.skills && existing.skills.join(', ')) || '',
        resumeUrl: existing?.resumeUrl || ''
    })

    async function handleResume(e) {
        const file = e.target.files?.[0]
        if (!file) return
        const data = await file.arrayBuffer()
        const blob = new Blob([data], { type: file.type||'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        setForm(prev=>({ ...prev, resumeUrl: url }))
    }

    function save() {
        if (!user) return
        setStudentProfile({ userId: user.uid, ...form })
        alert('Profile saved')
    }

    if (!user || user.role !== 'student') {
        return <div className="text-sm text-gray-600">Only students can edit profile.</div>
    }

    // Standard placeholder & text colors
    const inputStyle = "border rounded p-2 w-full text-gray-800 placeholder-gray-500 bg-white"

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold text-gray-900">Student Profile</h1>
            <div className="card p-4 grid md:grid-cols-2 gap-3">
                <input className={inputStyle} placeholder="Student Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                <input className={inputStyle} placeholder="USN" value={form.usn} onChange={e=>setForm({...form,usn:e.target.value})} />
                <input className={inputStyle} placeholder="Department" value={form.department} onChange={e=>setForm({...form,department:e.target.value})} />
                <input className={inputStyle} placeholder="Course" value={form.course} onChange={e=>setForm({...form,course:e.target.value})} />
                <input className={`md:col-span-2 ${inputStyle}`} placeholder="Skills (comma separated)" value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} />

                <div className="md:col-span-2 text-gray-800">
                    <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleResume} />
                    {form.resumeUrl && (
                        <div className="mt-2">
                            <a className="btn" href={form.resumeUrl} target="_blank" rel="noreferrer">View Resume</a>
                        </div>
                    )}
                </div>
                <div className="md:col-span-2">
                    <button className="btn" onClick={save}>Save Profile</button>
                </div>
            </div>

            {existing && (
                <div className="card p-4 text-gray-800">
                    <div className="font-semibold text-gray-900">Current Profile</div>
                    <div className="text-sm mt-1">Name: {existing.name}</div>
                    <div className="text-sm">USN: {existing.usn}</div>
                    <div className="text-sm">Department: {existing.department}</div>
                    <div className="text-sm">Course: {existing.course}</div>
                    <div className="text-sm">Skills: {existing.skills?.join(', ')}</div>
                    {existing.resumeUrl && <a className="btn mt-2" href={existing.resumeUrl} target="_blank" rel="noreferrer">Download Resume</a>}
                </div>
            )}
        </div>
    )
}
