import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useUiStore } from '../store/ui'

export default function Training() {
    const { user } = useAuthStore()
    const { enablePlacementAptitude, enablePlacementMock } = useUiStore()
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Training Program</h1>
                <p className="text-gray-600">Aptitude prep, mock interviews, and curated resources by the placement cell.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded p-4">
                    <h2 className="font-semibold mb-2">Aptitude Tests</h2>
                    <p className="text-sm text-gray-600 mb-3">Take scheduled online tests and track your scores.</p>
                    <Link className="btn" to="/training/aptitude" onClick={enablePlacementAptitude}>Go to Aptitude</Link>
                </div>
                <div className="border rounded p-4">
                    <h2 className="font-semibold mb-2">Mock Interviews</h2>
                    <p className="text-sm text-gray-600 mb-3">Book slots, attend mocks, and get feedback.</p>
                    <Link className="btn" to="/training/mocks" onClick={enablePlacementMock}>Go to Mocks</Link>
                </div>
                <div className="border rounded p-4">
                    <h2 className="font-semibold mb-2">Resources</h2>
                    <p className="text-sm text-gray-600 mb-3">Videos and guides for aptitude and interview prep.</p>
                    <Link className="btn" to="/training/resources">Browse Resources</Link>
                </div>
            </div>
            
        </div>
    )
}




