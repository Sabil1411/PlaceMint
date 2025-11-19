import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import logo from '../assets/logo.png'

export default function Layout({ children }) {
	const navigate = useNavigate()
	const { user, logout } = useAuthStore()
	return (
		<div className="min-h-full flex flex-col bg-cleanWhite drop-shadow-md">
			<header className="bg-forest text-cleanWhite shadow drop-shadow-lg h-[70px]">
				<div className="max-w-7xl mx-auto px-[50px] h-full flex items-center justify-between">
					<Link to="/" className="flex items-center gap-0 font-semibold text-cleanWhite">
						<img src={logo} alt="PlaceMint logo" className="h-24 w-auto" />
						<span></span>
					</Link>
					<div className="flex items-center gap-7 text-sm font-medium ml-auto flex-wrap justify-end">
						{(user ? [] : [
							{ to:'/', label:'Dashboard' },
							{ to:'/about', label:'About' },
							{ to:'/contact', label:'Contact' }
						]).map(link=>(
							<NavLink key={link.to} to={link.to} className={({isActive})=>isActive? 'text-freshLime' : 'text-cleanWhite/80 hover:text-cleanWhite'}>
								{link.label}
							</NavLink>
						))}
						{user && ({
							student: [
								{ to:'/profile', label:'Profile' },
								{ to:'/applications', label:'Applications' },
								{ to:'/jobs', label:'Jobs' },
								{ to:'/certificates', label:'Certificates' },
								{ to:'/feedback', label:'Feedback' },
								{ to:'/training', label:'Training' }
							],
							placement: [
								{ to:'/analytics', label:'Analytics' },
								{ to:'/jobs', label:'Post Jobs' },
								{ to:'/approvals', label:'Approvals' },
								{ to:'/training', label:'Training' },
								{ to:'/training/mocks', label:'Mock Interviews' },
								{ to:'/training/aptitude', label:'Aptitude' },
								{ to:'/scheduling', label:'Scheduling' }
							],
							company: [
								{ to:'/enrollment', label:'Enrollment' },
								{ to:'/certificates', label:'Certificates' },
								{ to:'/feedback', label:'Feedback' }
							]
						}[user.role] || []).map(link=>(
							<NavLink key={link.to} to={link.to} className={({isActive})=>isActive? 'text-freshLime':'text-cleanWhite/80 hover:text-cleanWhite'}>
								{link.label}
							</NavLink>
						))}
						{user ? (
							<>
								<span className="text-sm px-2 py-1 rounded-full bg-freshLime/20 text-cleanWhite border border-freshLime/40 mr-2">{user.displayName || user.email} ({user.role})</span>
								<button className="btn" onClick={()=>{logout(); navigate('/login')}}>Logout</button>
							</>
						) : (
							<button className="btn ml-4" onClick={()=>navigate('/login')}>Login</button>
						)}
					</div>
				</div>
			</header>
			<main className="flex-1">
				<div className="max-w-7xl mx-auto px-[50px] py-4">
					{children}
				</div>
			</main>
			<footer className="bg-forest text-cleanWhite py-3 text-sm drop-shadow-lg">
				<div className="max-w-7xl mx-auto px-[50px] grid md:grid-cols-3 gap-6 items-center">
					<div>
						<div className="font-semibold">PlaceMint</div>
						<div className="text-cleanWhite/70">Made for campus placements</div>
					</div>
					<div>
						<div className="font-semibold mb-2">Follow us</div>
						<div className="flex gap-3">
							<a className="transition-colors hover:text-tealAccent" href="#" aria-label="Instagram">
								<img src="/src/assets/instagram.png" alt="Instagram" style={{height:'24px',width:'24px',display:'inline'}} />
							</a>
							<a className="transition-colors hover:text-tealAccent" href="#" aria-label="Facebook">
								<img src="/src/assets/facebook.png" alt="Facebook" style={{height:'24px',width:'24px',display:'inline'}} />
							</a>
							<a className="transition-colors hover:text-tealAccent" href="https://www.linkedin.com/in/pranav-joshi-485a64289/" aria-label="LinkedIn">
								<img src="/src/assets/linkedin.png" alt="LinkedIn" style={{height:'24px',width:'24px',display:'inline'}} />
							</a>
							<a className="transition-colors hover:text-tealAccent" href="#" aria-label="Twitter">
								<img src="/src/assets/x_logo.png" alt="Twitter" style={{height:'24px',width:'24px',display:'inline'}} />
							</a>
						</div>
					</div>
					<div>
						<div className="font-semibold mb-1"> Contact us</div>
						<div className="text-cleanWhite/80">+91 12345 67890</div>
						<div className="text-cleanWhite/80">support@placemint.com</div>
					</div>
				</div>
			</footer>
		</div>
	)
}


