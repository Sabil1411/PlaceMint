import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useDataStore } from '../store/data'

// Presets removed to require signup first

export default function Login() {
	const navigate = useNavigate()
	const signup = useAuthStore(s => s.signup)
	const loginWithPassword = useAuthStore(s => s.loginWithPassword)
	const profiles = useDataStore(s => s.profiles)
	const [mode, setMode] = useState('login') // 'login' | 'signup'
	const [role, setRole] = useState('student')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [department, setDepartment] = useState('')
	const [error, setError] = useState('')
	const normalizedEmail = email.trim().toLowerCase()
	const emailType = normalizedEmail === 'placement@placemint.com' ? 'placement' : normalizedEmail === 'company@placemint.com' ? 'company' : 'student'
	const isLoginMode = mode === 'login'

	async function authenticate(currentMode = mode, currentRole = role) {
		setError('')
		if (!email.trim() || !password) {
			setError('Please fill all fields')
			return
		}
		try {
			if (currentMode === 'signup') {
				await signup({ email, password, name, role: currentRole, department })
			} else {
				await loginWithPassword({ email, password })
			}
			if ((currentMode === 'signup' && currentRole === 'student') || (currentRole === 'student' && name && !profiles.find(p=>p.name?.toLowerCase()===name.toLowerCase()))) {
				navigate('/profile')
			} else {
				navigate('/')
			}
		} catch (err) {
			setError(err.message || 'Something went wrong')
		}
	}

	async function handleSubmit(e) {
		e.preventDefault()
		await authenticate()
	}

	async function handleRoleLogin(type) {
		if (emailType !== type) {
			setError(`Enter the ${type} email to use this login.`)
			return
		}
		setMode('login')
		setRole(type)
		await authenticate('login', type)
	}

	return (
		<div className="min-h-screen bg-cleanWhite px-4 py-10 flex items-center justify-center">
			<div className="w-full max-w-md bg-cleanWhite text-forest rounded shadow-lg">
				<h1 className="text-2xl font-semibold mb-4 px-4 pt-4 text-center ">{mode==='signup' ? 'Sign up' : 'Login'}</h1>
				<form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 card p-4 text-forest">
					<div className="flex flex-wrap gap-2">
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
					<button
						className="btn flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
						type="submit"
						disabled={isLoginMode && emailType !== 'student'}
					>
						{mode==='signup' ? 'Create account' : 'Login'}
					</button>
					<div className="flex flex-col gap-2 sm:flex-row sm:flex-1">
						<button
							type="button"
							className="btn flex-1 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={emailType !== 'placement'}
							onClick={()=>handleRoleLogin('placement')}
						>
							Placement
						</button>
						<button
							type="button"
							className="btn flex-1 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={emailType !== 'company'}
							onClick={()=>handleRoleLogin('company')}
						>
							Company
						</button>
					</div>
				</div>
				</form>
			</div>
		</div>
	)
}
