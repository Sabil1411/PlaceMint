import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useDataStore, matchScore } from '../store/data'

export default function Dashboard() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { jobs, applications, interviews, approvals, users } = useDataStore()

    // live stats
    const studentsPlaced = approvals.filter(a=>a.status==='approved').length
    const partnerCompanies = new Set(jobs.map(j=>j.company)).size
    const successRate = applications.length ? Math.round((studentsPlaced / applications.length) * 100) : 0
    const activeUsers = users?.length || 0

    return (
        <div className="space-y-[60px]">
            {/* Hero */}
            <section className="bg-white rounded-xl border border-gray-200 p-[55px] shadow mt-10">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-5">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-freshLime/10 text-forest border border-freshLime/40">✓ Free for Public Institutes</span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-tealAccent/10 text-tealAccent border border-tealAccent/40">✓ GDPR Compliant</span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-forest/10 text-forest border border-forest/20">✓ 24/7 Support</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight mt-5 mb-6">Transform Your Campus Placement Journey</h1>
                        <p className="text-gray-600 max-w-2xl mb-[30px]">Streamline internships and placements with our comprehensive platform. From application to offer letter — manage everything in one place.</p>
                        <div className="flex flex-wrap gap-3">
                            <button className="btn" onClick={()=>navigate(user?'/':'/login')}>Get Started Free</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
                        {[{ label:'Students Placed', value: studentsPlaced, color:'text-freshLime' },
                          { label:'Partner Companies', value: partnerCompanies, color:'text-tealAccent' },
                          { label:'Success Rate', value: successRate + '%' , color:'text-forest' },
                          { label:'Active Users', value: activeUsers, color:'text-amber-600' }].map(s => (
                            <div key={s.label} className="card p-4 text-center hover:shadow-md transition-shadow">
                                <div className={`text-2xl font-semibold ${s.color}`}>{s.value}</div>
                                <div className="text-xs text-gray-500">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature bullets */}
            <section className="grid md:grid-cols-2 gap-4 py-[30px]">
                {[
                    { title:'Automated application matching', desc:'Smartly match students to roles based on skills and preferences.', icon:'🎯' },
                    { title:'Real-time status tracking', desc:'Live updates on applications, interviews, and approvals.', icon:'⏱️' },
                    { title:'Streamlined approvals', desc:'Placement approvals with one-click actions.', icon:'✅' },
                    { title:'Analytics & insights', desc:'High-level metrics to guide placement decisions.', icon:'📊' },
                ].map(f=> (
                    <div key={f.title} className="card p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="text-2xl" aria-hidden>{f.icon}</div>
                            <div>
                                <div className="font-semibold">{f.title}</div>
                                <p className="text-gray-600 text-sm mt-1">{f.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* About & Contact quick cards */}
            <section className="grid sm:grid-cols-2 gap-4 py-[30px]">
                <div className="card p-5">
                    <div className="font-semibold">About</div>
                    <p className="text-sm text-gray-600 mt-1">Learn about our mission and how we streamline placements.</p>
                    <Link to="/about" className="btn mt-3">Read more</Link>
                </div>
                <div className="card p-5">
                    <div className="font-semibold">Contact</div>
                    <p className="text-sm text-gray-600 mt-1">Reach our team for support and partnerships.</p>
                    <Link to="/contact" className="btn mt-3">Get in touch</Link>
                </div>
            </section>

            {/* Why Choose */}
            <section className="space-y-3 py-[30px]">
                <h2 className="text-xl font-semibold">Why Choose PlaceMint?</h2>
                <p className="text-gray-600">Built specifically for educational institutions to simplify the placement process</p>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { title:'Smart Matching', desc:'AI-powered algorithm matches students with relevant opportunities based on skills and preferences.', icon:'🤖' },
                        { title:'Real-time Analytics', desc:'Track placement statistics, application progress, and success rates with comprehensive dashboards.', icon:'📈' },
                        { title:'Secure & Compliant', desc:'GDPR compliant platform with role-based access control and data privacy protection.', icon:'🔒' },
                        { title:'Automated Workflows', desc:'Streamline approvals, notifications, and certificate generation with smart automation.', icon:'⚙️' },
                    ].map(f => (
                        <div key={f.title} className="card p-5 hover:shadow-md transition-all">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl" aria-hidden>{f.icon}</div>
                                <div>
                                    <div className="font-semibold">{f.title}</div>
                                    <p className="text-gray-600 text-sm mt-1">{f.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    <img src="/src/assets/diagram.png" alt="Campus Portal Workflow" style={{maxWidth:'100%',height:'auto'}} />
                </div>
            </section>

            {/* Personalized for logged-in student
            {user && user.role==='student' && (
                <section className="space-y-3 py-[30px]">
                    <h3 className="font-semibold">Your Dashboard</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                        <div className="card p-4">
                            <div className="font-medium">Profile Management</div>
                            <div className="text-sm text-gray-600 mt-1">Create and update your profile with USN, department, course, skills and resume</div>
                            <Link to="/profile" className="btn mt-3">View/Edit Profile</Link>
                        </div>
                        <div className="card p-4">
                            <div className="font-medium">Applications</div>
                            <div className="text-sm text-gray-600 mt-1">Track your job applications and their status</div>
                            <Link to="/applications" className="btn mt-3">View Applications</Link>
                        </div>
                        <div className="card p-4">
                            <div className="font-medium">Certificates</div>
                            <div className="text-sm text-gray-600 mt-1">View and download certificates from companies</div>
                            <Link to="/certificates" className="btn mt-3">View Certificates</Link>
                        </div>
                        <div className="card p-4">
                            <div className="font-medium">Feedback</div>
                            <div className="text-sm text-gray-600 mt-1">View feedback from the placement cell and companies</div>
                            <Link to="/feedback" className="btn mt-3">View Feedback</Link>
                        </div>
                    </div>
                </section>
            )} */}

            {/* Company quick actions */}
            {user && user.role === 'company' && (
                <section className="space-y-3 py-[30px]">
                    <h3 className="font-semibold">Company Console</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { title:'Company Enrollment', desc:'Share your hiring requirements with the placement cell.', to:'/enrollment', cta:'Fill Enrollment' },
                            { title:'Issue Certificates', desc:'Provide completion certificates for successful hires.', to:'/certificates', cta:'Issue Certificates' },
                            { title:'Feedbacks', desc:'Share interview feedback to help students improve.', to:'/feedback', cta:'Give Feedback' }
                        ].map(card=>(
                            <div key={card.title} className="card p-5 flex flex-col gap-3">
                                <div>
                                    <div className="font-semibold">{card.title}</div>
                                    <p className="text-sm text-gray-600 mt-1">{card.desc}</p>
                                </div>
                                <Link className="btn mt-auto" to={card.to}>{card.cta}</Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Placement quick actions */}
            {/*user && user.role === 'placement' && (
                <section className="space-y-3 py-[30px]">
                    <h3 className="font-semibold">Placement Control Center</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { title:'Analytics', desc:'Track hiring funnels and placement ratios.', to:'/analytics', cta:'View Analytics' },
                            { title:'Post Jobs', desc:'Publish roles based on company requirements.', to:'/jobs', cta:'Post Job' },
                            { title:'Approve Applications', desc:'Review and approve student applications.', to:'/approvals', cta:'Open Approvals' },
                            { title:'Training Hub', desc:'Launch programs and assign cohorts.', to:'/training', cta:'Manage Training' },
                            { title:'Mock Interviews', desc:'Schedule panels & review performance.', to:'/training/mocks', cta:'Manage Mocks' },
                            { title:'Aptitude Tests', desc:'Create/publish assessments and track results.', to:'/training/aptitude', cta:'Manage Aptitude' },
                            { title:'Interview Scheduling', desc:'Assign interview slots and outcomes.', to:'/scheduling', cta:'Schedule Interviews' }
                        ].map(card=>(
                            <div key={card.title} className="card p-5 flex flex-col gap-3">
                                <div>
                                    <div className="font-semibold">{card.title}</div>
                                    <p className="text-sm text-gray-600 mt-1">{card.desc}</p>
                                </div>
                                <Link className="btn mt-auto" to={card.to}>{card.cta}</Link>
                            </div>
                        ))}
                    </div>
                </section>
            )*/}
        </div>
    )
}


