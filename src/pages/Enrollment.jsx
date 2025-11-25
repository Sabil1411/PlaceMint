import { useState } from 'react'
import { useAuthStore } from '../store/auth'
import { useDataStore } from '../store/data'

export default function Enrollment() {
    const { user } = useAuthStore()
    const { addEnrollment } = useDataStore()
    const [form, setForm] = useState({ company:'', post:'', salary:'', criteria:'', skills:'' })

    function submit() {
        if (!form.company || !form.post) return
        addEnrollment({ company: form.company, post: form.post, salary: form.salary, criteria: form.criteria, skills: form.skills })
        setForm({ company:'', post:'', salary:'', criteria:'', skills:'' })
        window.alert('Enrollment submitted to Placement Cell')
    }

    if (user?.role !== 'company') return <div className="text-sm text-gray-600">Only company representatives can access enrollment.</div>

    return (
        <div className="space-y-3">
            <h1 className="text-xl font-semibold">Company Enrollment</h1>
            <div className="card p-4 grid md:grid-cols-2 gap-3">
                <input className="input-field" placeholder="Company name" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} />
                <input className="input-field" placeholder="Post/Role" value={form.post} onChange={e=>setForm({...form,post:e.target.value})} />
                <input className="input-field" placeholder="Salary/Stipend" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} />
                <input className="input-field" placeholder="Criteria" value={form.criteria} onChange={e=>setForm({...form,criteria:e.target.value})} />
                <input className="input-field md:col-span-2" placeholder="Skills (comma separated)" value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} />
                <div className="md:col-span-2">
                    <button className="btn" onClick={submit}>Submit</button>
                </div>
            </div>
        </div>
    )
}


