import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useUiStore } from '../store/ui'
import logo from '../assets/logo.png'
import facebookLogo from '../assets/facebook.png'
import instagramLogo from '../assets/instagram.png'
import linkedinLogo from '../assets/linkedin.png'
import twitterLogo from '../assets/x_logo.png'


export default function Layout({ children }) {
	const navigate = useNavigate()
	const { user, logout } = useAuthStore()
	const [menuOpen, setMenuOpen] = useState(false)
	const { showPlacementAptitude, showPlacementMock, resetPlacementTrainingLinks } = useUiStore()
	const publicLinks = [
		{ to:'/', label:'Dashboard' },
		{ to:'/about', label:'About' },
		{ to:'/contact', label:'Contact' }
	]
	const placementLinks = [
		{ to:'/analytics', label:'Analytics' },
		{ to:'/jobs', label:'Post Jobs' },
		{ to:'/approvals', label:'Approvals' },
		{ to:'/training', label:'Training' }
	]
	if (showPlacementMock) placementLinks.push({ to:'/training/mocks', label:'Mock Interviews' })
	if (showPlacementAptitude) placementLinks.push({ to:'/training/aptitude', label:'Aptitude' })
	placementLinks.push({ to:'/scheduling', label:'Scheduling' })
	const roleLinks = user ? ({
		student: [
			{ to:'/profile', label:'Profile' },
			{ to:'/applications', label:'Applications' },
			{ to:'/jobs', label:'Jobs' },
			{ to:'/certificates', label:'Certificates' },
			{ to:'/feedback', label:'Feedback' },
			{ to:'/training', label:'Training' }
		],
		placement: placementLinks,
		company: [
			{ to:'/enrollment', label:'Enrollment' },
			{ to:'/certificates', label:'Certificates' },
			{ to:'/feedback', label:'Feedback' }
		]
	}[user.role] || []) : []
	const navLinks = user ? roleLinks : publicLinks

	const closeMenu = () => setMenuOpen(false)
	const handleLogout = () => {
		logout()
		resetPlacementTrainingLinks()
		setMenuOpen(false)
		navigate('/login')
	}
	const handleLoginNav = () => {
		setMenuOpen(false)
		navigate('/login')
	}
	return (
		<div className="min-h-full flex flex-col bg-cleanWhite drop-shadow-md">
			<header className="bg-forest text-cleanWhite shadow drop-shadow-lg sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 md:px-[50px] h-[70px] flex items-center justify-between">
					<Link to="/" className="flex items-center gap-2 font-semibold text-cleanWhite" onClick={closeMenu}>
						<img src={logo} alt="PlaceMint logo" className="h-12 sm:h-14 md:h-16 w-auto object-contain" />
						
					</Link>
					<nav className="hidden lg:flex items-center gap-7 text-sm font-medium ml-auto">
						{navLinks.map(link=>(
							<NavLink key={link.to} to={link.to} className={({isActive})=>isActive? 'text-freshLime' : 'text-cleanWhite/80 hover:text-cleanWhite'}>
								{link.label}
							</NavLink>
						))}
						{user ? (
							<>
								<span className="text-sm px-2 py-1 rounded-full bg-freshLime/20 text-cleanWhite border border-freshLime/40">{user.displayName || user.email} ({user.role})</span>
								<button className="btn" onClick={handleLogout}>Logout</button>
							</>
						) : (
							<button className="btn" onClick={handleLoginNav}>Login</button>
						)}
					</nav>
					<button
						type="button"
						className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-cleanWhite focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-freshLime focus:ring-offset-forest"
						onClick={()=>setMenuOpen(o=>!o)}
						aria-label="Toggle navigation"
					>
						<span className="sr-only">Toggle navigation</span>
						<div className="flex flex-col gap-1">
							<span className="w-6 h-0.5 bg-cleanWhite block"></span>
							<span className="w-6 h-0.5 bg-cleanWhite block"></span>
							<span className="w-6 h-0.5 bg-cleanWhite block"></span>
						</div>
					</button>
				</div>
				<div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
					<div className="px-4 pb-4 flex flex-col gap-3 text-sm font-medium bg-forest/95">
						{navLinks.map(link=>(
							<NavLink
								key={link.to}
								to={link.to}
								className={({isActive})=>isActive? 'text-freshLime' : 'text-cleanWhite/80 hover:text-cleanWhite'}
								onClick={closeMenu}
							>
								{link.label}
							</NavLink>
						))}
						{user ? (
							<>
								<span className="text-sm px-2 py-1 rounded-full bg-freshLime/20 text-cleanWhite border border-freshLime/40">{user.displayName || user.email} ({user.role})</span>
								<button className="btn" onClick={handleLogout}>Logout</button>
							</>
						) : (
							<button className="btn" onClick={handleLoginNav}>Login</button>
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
							<a className="transition-colors hover:text-tealAccent" href="https://www.instagram.com/_placemint_?igsh=ODVvNmdheGZ2ZTFo" target="_blank" aria-label="Instagram" >
								<img src={instagramLogo} alt="Instagram" style={{height:'24px',width:'24px',display:'inline'}} />
							</a>
							<a className="transition-colors hover:text-tealAccent" href="#" aria-label="Facebook">
								<img src={facebookLogo}	 alt="Facebook" style={{height:'24px',width:'24px',display:'inline'}} />
							</a>
							<a className="transition-colors hover:text-tealAccent" href="https://www.linkedin.com/company/place-mint/?viewAsMember=true" target="_blank" aria-label="LinkedIn" >
								<img src={linkedinLogo} alt="LinkedIn" style={{height:'24px',width:'24px',display:'inline'}} />
							</a>
							<a className="transition-colors hover:text-tealAccent" href="#" aria-label="Twitter">
								<img src={twitterLogo} alt="Twitter" style={{height:'24px',width:'24px',display:'inline'}} />
							</a>
						</div>
					</div>
					<div>
						<div className="font-semibold mb-1"> Contact us</div>
						<div className="text-cleanWhite/80">+91 12345 67890</div>
						<div className="text-cleanWhite/80" href="placemin247@gmail.com">placemin247@gmail.com</div>
					</div>
				</div>
			</footer>
		</div>
	)
}


