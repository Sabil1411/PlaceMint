import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useDataStore } from '../store/data'

// Presets removed to require signup first

export default function Login() {
	const navigate = useNavigate()
	const signup = useAuthStore(s => s.signup)
	const loginWithPassword = useAuthStore(s => s.loginWithPassword)
	const loginPredefined = useAuthStore(s => s.loginPredefined)
    const profiles = useDataStore(s => s.profiles)
	const [mode, setMode] = useState('login') // 'login' | 'signup'
	const [role, setRole] = useState('student')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [department, setDepartment] = useState('')
	const [error, setError] = useState('')

	async function handleSubmit(e) {
		e.preventDefault()
		setError('')
		if (!email.trim() || !password) {
			setError('Please fill all fields')
			return
		}
		try {
			if (mode==='signup') {
				await signup({ email, password, name, role, department })
			} else {
				await loginWithPassword({ email, password })
			}
			if ((mode==='signup' && role==='student') || (role==='student' && name && !profiles.find(p=>p.name?.toLowerCase()===name.toLowerCase()))) {
				navigate('/profile')
			} else {
				navigate('/')
			}
		} catch (err) {
			setError(err.message || 'Something went wrong')
		}
	}

	async function handlePredefinedLogin(type) {
		setError('')
		try {
			await loginPredefined(type)
			navigate('/')
		} catch (err) {
			setError(err.message || 'Unable to login')
		}
	}

	return (
		<div className="max-w-md mx-auto bg-cleanWhite text-forest p-2 rounded">
			<h1 className="text-2xl font-semibold mb-4">{mode==='signup' ? 'Sign up' : 'Login'}</h1>
			<form onSubmit={handleSubmit} className="space-y-4 card p-4 text-forest">
				<div className="flex gap-2">
					<button type="button" className={`px-3 py-1 rounded border text-sm font-medium transition-colors ${mode==='login' ? 'bg-freshLime/15 text-forest border-freshLime/40' : 'bg-cleanWhite text-forest/80 border-forest/20'}`} onClick={()=>setMode('login')}>Login</button>
					<button type="button" className={`px-3 py-1 rounded border text-sm font-medium transition-colors ${mode==='signup' ? 'bg-freshLime/15 text-forest border-freshLime/40' : 'bg-cleanWhite text-forest/80 border-forest/20'}`} onClick={()=>setMode('signup')}>Sign up</button>
				</div>
				{mode==='signup' && (
					<label className="block">
						<span className="text-sm text-forest">Role</span>
						<select className="mt-1 w-full border border-forest/20 rounded p-2 bg-cleanWhite text-forest focus:border-freshLime focus:outline-none focus:ring-1 focus:ring-freshLime" value={role} onChange={e=>setRole(e.target.value)}>
							<option value="student">Student</option>
						</select>
					</label>
				)}
				
				<label className="block">
					<span className="text-sm text-forest">Email</span>
					<input className="mt-1 w-full border border-forest/20 rounded p-2 bg-cleanWhite text-forest placeholder-gray-500 focus:border-freshLime focus:outline-none focus:ring-1 focus:ring-freshLime" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
				</label>
				{mode==='signup' && (
					<label className="block">
						<span className="text-sm text-forest">Full name</span>
						<input className="mt-1 w-full border border-forest/20 rounded p-2 bg-cleanWhite text-forest placeholder-gray-500 focus:border-freshLime focus:outline-none focus:ring-1 focus:ring-freshLime" placeholder="Enter your name" value={name} onChange={e=>setName(e.target.value)} />
					</label>
				)}
				<label className="block">
					<span className="text-sm text-forest">Password</span>
					<input type="password" className="mt-1 w-full border border-forest/20 rounded p-2 bg-cleanWhite text-forest placeholder-gray-500 focus:border-freshLime focus:outline-none focus:ring-1 focus:ring-freshLime" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} />
				</label>
				{error && <div className="text-sm text-red-600">{error}</div>}
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<button className="btn flex-1" type="submit">{mode==='signup' ? 'Create account' : 'Login'}</button>
					<div className="flex flex-col gap-2 sm:flex-row sm:flex-1">
						<button
							type="button"
							className="btn-outline flex-1"
							onClick={()=>handlePredefinedLogin('placement')}
						>
							Placement Login
						</button>
						<button
							type="button"
							className="btn-outline flex-1"
							onClick={()=>handlePredefinedLogin('company')}
						>
							Company Login
						</button>
					</div>
				</div>
			</form>
		</div>
	)
}
