import { useMemo, useState } from 'react'
import { useDataStore } from '../store/data'
import { useAuthStore } from '../store/auth'

function formatTime(ts) {
    const d = new Date(ts)
    return d.toLocaleString()
}

export default function Aptitude() {
    const { aptitudeTests, aptitudeResults, createAptitudeTest, addQuestionToTest, publishAptitudeTest, assignTestToUsers, submitAptitudeResult } = useDataStore()
    const { user } = useAuthStore()
    const [newTest, setNewTest] = useState({ title: '', description: '', startAt: '', durationMinutes: 60, randomize: false, navigationMode: 'free' })
    const [selectedTestId, setSelectedTestId] = useState('')
    const [newQuestion, setNewQuestion] = useState({ text: '', options: ['', '', '', ''], correctIndex: 0 })
    const [activeTestId, setActiveTestId] = useState('')
    const [answersDraft, setAnswersDraft] = useState({})
    const [timeLeftMs, setTimeLeftMs] = useState(0)

    const myResults = useMemo(() => aptitudeResults.filter(r => r.userId === user?.uid), [aptitudeResults, user])

    const upcoming = aptitudeTests.filter(t => Date.now() <= Number(t.startAt) + (Number(t.durationMinutes)||60) * 60_000)
    const past = aptitudeTests.filter(t => Date.now() > Number(t.startAt) + (Number(t.durationMinutes)||60) * 60_000)

    async function handleCreateTest(e) {
        e.preventDefault()
        if (!newTest.title || !newTest.startAt) return
        await createAptitudeTest({
            title: newTest.title,
            description: newTest.description,
            startAt: new Date(newTest.startAt).getTime(),
            durationMinutes: Number(newTest.durationMinutes)||60,
            randomize: !!newTest.randomize,
            navigationMode: newTest.navigationMode,
            questions: []
        })
        setNewTest({ title: '', description: '', startAt: '', durationMinutes: 60 })
    }

    async function handleAddQuestion(e) {
        e.preventDefault()
        if (!selectedTestId || !newQuestion.text || newQuestion.options.some(o=>!o)) return
        await addQuestionToTest({ testId: selectedTestId, question: newQuestion })
        setNewQuestion({ text: '', options: ['', '', '', ''], correctIndex: 0 })
    }

    async function handlePublish(testId) { await publishAptitudeTest({ testId }) }

    async function handleSubmitResult(e) {
        e.preventDefault()
        if (!activeTestId) return
        const test = aptitudeTests.find(t=>t.id===activeTestId)
        let score = 0
        if (test) {
            test.questions.forEach((q, idx)=>{
                if (Number(answersDraft[idx]) === Number(q.correctIndex)) score += 1
            })
        }
        await submitAptitudeResult({ testId: activeTestId, userId: user.uid, score, answers: answersDraft })
        setActiveTestId('')
        setAnswersDraft({})
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Aptitude Tests</h1>
                <p className="text-gray-600">Online tests scheduled by the placement cell with fixed date, time and duration.</p>
            </div>

            {user?.role === 'placement' && (
                <form onSubmit={handleCreateTest} className="border rounded p-4 space-y-3">
                    <div className="font-semibold">Create Test</div>
                    <div className="grid md:grid-cols-6 gap-3">
                        <input className="input" placeholder="Title" value={newTest.title} onChange={e=>setNewTest(v=>({...v, title: e.target.value}))} />
                        <input className="input" placeholder="Description" value={newTest.description} onChange={e=>setNewTest(v=>({...v, description: e.target.value}))} />
                        <input className="input" type="datetime-local" value={newTest.startAt} onChange={e=>setNewTest(v=>({...v, startAt: e.target.value}))} />
                        <input className="input" type="number" min="10" max="240" value={newTest.durationMinutes} onChange={e=>setNewTest(v=>({...v, durationMinutes: e.target.value}))} />
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={newTest.randomize} onChange={e=>setNewTest(v=>({...v, randomize: e.target.checked}))} /> Randomize</label>
                        <select className="input" value={newTest.navigationMode} onChange={e=>setNewTest(v=>({...v, navigationMode: e.target.value}))}>
                            <option value="free">Free Navigation</option>
                            <option value="sequential">Sequential</option>
                        </select>
                    </div>
                    <button className="btn">Publish Test</button>
                </form>
            )}

            {user?.role === 'placement' && (
                <div className="border rounded p-4 space-y-3">
                    <div className="font-semibold">Add Questions</div>
                    <div className="grid md:grid-cols-4 gap-3 items-end">
                        <select className="input" value={selectedTestId} onChange={e=>setSelectedTestId(e.target.value)}>
                            <option value="">Select Test</option>
                            {aptitudeTests.map(t=> <option key={t.id} value={t.id}>{t.title}</option>)}
                        </select>
                        <input className="input md:col-span-3" placeholder="Question text" value={newQuestion.text} onChange={e=>setNewQuestion(v=>({...v, text: e.target.value}))} />
                    </div>
                    <div className="grid md:grid-cols-4 gap-3">
                        {newQuestion.options.map((opt, i)=> (
                            <input key={i} className="input" placeholder={`Option ${i+1}`} value={opt} onChange={e=>setNewQuestion(v=>{ const options=[...v.options]; options[i]=e.target.value; return { ...v, options } })} />
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-700">Correct Option</label>
                        <select className="input w-32" value={newQuestion.correctIndex} onChange={e=>setNewQuestion(v=>({...v, correctIndex: Number(e.target.value)}))}>
                            {[0,1,2,3].map(i=> <option key={i} value={i}>{i+1}</option>)}
                        </select>
                        <button className="btn" onClick={handleAddQuestion}>Add Question</button>
                        {selectedTestId && <button className="btn" onClick={()=>handlePublish(selectedTestId)}>Publish</button>}
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded p-4">
                    <div className="font-semibold mb-2">Upcoming & Active</div>
                    <ul className="space-y-3">
                        {upcoming.filter(t=>t.published!==false).map(t => (
                            <li key={t.id} className="border rounded p-3">
                                <div className="font-medium">{t.title}</div>
                                <div className="text-sm text-gray-600">Starts: {formatTime(t.startAt)} • Duration: {t.durationMinutes}m</div>
                                {user?.role === 'student' && (!t.assignedTo || t.assignedTo.includes(user.uid)) && (
                                    <button className="btn mt-2" onClick={()=> setActiveTestId(t.id)}>Start / Continue</button>
                                )}
                                {user?.role === 'placement' && (<div className="text-xs text-gray-500 mt-2">{(t.questions||[]).length} questions • {t.randomize? 'Randomized':''} {t.navigationMode==='sequential'?'• Sequential':''}</div>)}
                            </li>
                        ))}
                        {upcoming.length === 0 && <div className="text-sm text-gray-500">No scheduled tests.</div>}
                    </ul>
                </div>
                <div className="border rounded p-4">
                    <div className="font-semibold mb-2">My Results</div>
                    <ul className="space-y-2">
                        {myResults.map(r => (
                            <li key={r.id} className="flex items-center justify-between border rounded p-2">
                                <div className="text-sm">Test: {r.testId}</div>
                                <div className="font-semibold">Score: {r.score}</div>
                            </li>
                        ))}
                        {myResults.length === 0 && <div className="text-sm text-gray-500">You have not submitted any test yet.</div>}
                    </ul>
                </div>
            </div>

            {activeTestId && user?.role === 'student' && (()=>{
                const test = aptitudeTests.find(t=>t.id===activeTestId)
                if (!test) return null
                const timeRemaining = (Number(test.startAt) + Number(test.durationMinutes)*60_000) - Date.now()
                if (timeLeftMs !== timeRemaining) setTimeout(()=> setTimeLeftMs(timeRemaining), 500)
                const questions = Array.isArray(test.questions)? [...test.questions] : []
                if (test.randomize) questions.sort(()=> Math.random()-0.5)
                return (
                    <form onSubmit={handleSubmitResult} className="border rounded p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="font-semibold">{test.title}</div>
                            <div className={`text-sm ${timeRemaining<60000? 'text-red-600':'text-gray-700'}`}>Time left: {Math.max(0, Math.floor(timeRemaining/60000))}m {Math.max(0, Math.floor((timeRemaining%60000)/1000))}s</div>
                        </div>
                        <div className="space-y-4">
                            {questions.map((q, idx)=> (
                                <div key={idx} className="border rounded p-3">
                                    <div className="font-medium mb-2">Q{idx+1}. {q.text}</div>
                                    <div className="grid md:grid-cols-2 gap-2">
                                        {q.options.map((opt, i)=> (
                                            <label key={i} className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                                                <input type="radio" name={`q_${idx}`} checked={Number(answersDraft[idx])===i} onChange={()=> setAnswersDraft(v=>({ ...v, [idx]: i }))} />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <button type="submit" className="btn">Submit Test</button>
                        </div>
                    </form>
                )
            })()}

            <div className="border rounded p-4">
                <div className="font-semibold mb-2">Past Tests</div>
                <ul className="space-y-2">
                    {past.map(t => (
                        <li key={t.id} className="flex items-center justify-between border rounded p-2">
                            <div className="text-sm">{t.title} • {formatTime(t.startAt)}</div>
                            <div className="text-xs text-gray-600">{t.durationMinutes} minutes</div>
                        </li>
                    ))}
                    {past.length === 0 && <div className="text-sm text-gray-500">No past tests.</div>}
                </ul>
            </div>
        </div>
    )
}


