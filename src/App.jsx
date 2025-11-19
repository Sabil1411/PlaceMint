import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import Jobs from './pages/Jobs'
import Approvals from './pages/Approvals'
import Scheduling from './pages/Scheduling'
import Feedback from './pages/Feedback'
import Certificates from './pages/Certificates'
import Analytics from './pages/Analytics'
import Layout from './components/Layout'
import About from './pages/About'
import Contact from './pages/Contact'
import Enrollment from './pages/Enrollment'
import Profile from './pages/Profile'
import Training from './pages/Training'
import Aptitude from './pages/Aptitude'
import MockInterviews from './pages/MockInterviews'
import Resources from './pages/Resources'

function ProtectedRoute({ roles, children }) {
	const { user } = useAuthStore()
	if (!user) return <Navigate to="/login" replace />
	if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
	return children
}

export default function App() {
	return (
		<Layout>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route index element={<Dashboard />} />
				<Route path="/jobs" element={<ProtectedRoute roles={["student","placement"]}><Jobs /></ProtectedRoute>} />
				<Route path="/applications" element={<Applications />} />
				<Route
					path="/approvals"
					element={
						<ProtectedRoute roles={["placement"]}>
							<Approvals />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/scheduling"
					element={
						<ProtectedRoute roles={["student", "placement"]}>
							<Scheduling />
						</ProtectedRoute>
					}
				/>
				<Route path="/feedback" element={<ProtectedRoute roles={["student","company","placement"]}><Feedback /></ProtectedRoute>} />
				<Route path="/certificates" element={<ProtectedRoute roles={["student","company"]}><Certificates /></ProtectedRoute>} />
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/training" element={<ProtectedRoute roles={["student","placement"]}><Training /></ProtectedRoute>} />
				<Route path="/training/aptitude" element={<ProtectedRoute roles={["student","placement"]}><Aptitude /></ProtectedRoute>} />
				<Route path="/training/mocks" element={<ProtectedRoute roles={["student","placement"]}><MockInterviews /></ProtectedRoute>} />
				<Route path="/training/resources" element={<ProtectedRoute roles={["student","placement"]}><Resources /></ProtectedRoute>} />
				<Route path="/enrollment" element={<ProtectedRoute roles={["company"]}><Enrollment /></ProtectedRoute>} />
				<Route path="/profile" element={<ProtectedRoute roles={["student"]}><Profile /></ProtectedRoute>} />
				<Route
					path="/analytics"
					element={
						<ProtectedRoute roles={["placement"]}>
							<Analytics />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Layout>
	)
}


