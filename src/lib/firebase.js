import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported as analyticsIsSupported } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: 'AIzaSyAWR5OjM-N_BhuBr-QDmJZSeHu7ddkcid4',
    authDomain: 'placemint-3540b.firebaseapp.com',
    databaseURL: 'https://placemint-3540b-default-rtdb.firebaseio.com',
    projectId: 'placemint-3540b',
    storageBucket: 'placemint-3540b.firebasestorage.app',
    messagingSenderId: '540728636964',
    appId: '1:540728636964:web:fd2828e95b36747aba8ab1',
    measurementId: 'G-S47K1JGDYY'
}

const app = initializeApp(firebaseConfig)

let analytics
analyticsIsSupported().then((ok) => {
    if (ok) {
        analytics = getAnalytics(app)
    }
}).catch(() => {})

export const auth = getAuth(app)
export const db = getDatabase(app)
export const storage = getStorage(app)
export default app


