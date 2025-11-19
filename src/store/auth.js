import { create } from 'zustand'
import { auth, db } from '../lib/firebase'
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { ref, set as dbSet, get as dbGet, child } from 'firebase/database'

const predefinedAccounts = {
    placement: {
        email: 'placement@placemint.com',
        password: 'Placement#123',
        profile: {
            name: 'Placement Officer',
            role: 'placement',
            department: 'Training & Placement'
        }
    },
    company: {
        email: 'company@placemint.com',
        password: 'Company#123',
        profile: {
            name: 'Company Partner',
            role: 'company',
            department: 'Industry Relations'
        }
    }
}

export const useAuthStore = create((set, get) => {
    // initialize from Firebase auth
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (!fbUser) {
            set({ user: null })
            return
        }
        const userRef = child(ref(db), `users/${fbUser.uid}`)
        const snap = await dbGet(userRef).catch(() => null)
        const profile = snap && snap.exists() ? snap.val() : { role: 'student' }
        set({ user: { uid: fbUser.uid, email: fbUser.email, displayName: fbUser.displayName, ...profile } })
    })

    const state = {
        user: null,
        signup: async ({ email, password, name, role, department }) => {
            const cred = await createUserWithEmailAndPassword(auth, email, password)
            if (name) {
                await updateProfile(cred.user, { displayName: name })
            }
            const userProfile = { name: name || '', role: role || 'student', department: department || '' }
            await dbSet(ref(db, `users/${cred.user.uid}`), userProfile)
            set({ user: { uid: cred.user.uid, email: cred.user.email, displayName: cred.user.displayName, ...userProfile } })
        },
        loginWithPassword: async ({ email, password }) => {
            const cred = await signInWithEmailAndPassword(auth, email, password)
            const snap = await dbGet(ref(db, `users/${cred.user.uid}`)).catch(() => null)
            const profile = snap && snap.exists() ? snap.val() : { role: 'student' }
            set({ user: { uid: cred.user.uid, email: cred.user.email, displayName: cred.user.displayName, ...profile } })
        },
        logout: async () => {
            await signOut(auth)
            set({ user: null })
        },
        // legacy helper kept for compatibility
        login: (user) => set(() => ({ user })),
        loginPredefined: async (type) => {
            const account = predefinedAccounts[type]
            if (!account) {
                throw new Error('Unsupported login type')
            }

            const ensureProfile = async (uid, fallbackProfile) => {
                const userRef = ref(db, `users/${uid}`)
                const snap = await dbGet(userRef).catch(() => null)
                if (snap && snap.exists()) {
                    return snap.val()
                }
                await dbSet(userRef, fallbackProfile)
                return fallbackProfile
            }

            const setStateWithProfile = (fbUser, profile) => {
                set({ user: { uid: fbUser.uid, email: fbUser.email, displayName: fbUser.displayName, ...profile } })
            }

            const signInExisting = async () => {
                const cred = await signInWithEmailAndPassword(auth, account.email, account.password)
                const profile = await ensureProfile(cred.user.uid, account.profile)
                if (account.profile?.name && cred.user.displayName !== account.profile.name) {
                    await updateProfile(cred.user, { displayName: account.profile.name }).catch(() => {})
                }
                setStateWithProfile(cred.user, profile)
            }

            const createAccount = async () => {
                const cred = await createUserWithEmailAndPassword(auth, account.email, account.password).catch((createErr) => {
                    if (createErr.code === 'auth/email-already-in-use') {
                        throw new Error(`${type === 'placement' ? 'Placement' : 'Company'} account already exists with a different password. Reset it in Firebase console.`)
                    }
                    throw createErr
                })
                if (account.profile?.name) {
                    await updateProfile(cred.user, { displayName: account.profile.name }).catch(() => {})
                }
                await dbSet(ref(db, `users/${cred.user.uid}`), account.profile)
                setStateWithProfile(cred.user, account.profile)
            }

            try {
                await signInExisting()
            } catch (err) {
                if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                    await createAccount()
                    return
                }
                throw err
            }
        }
    }

    // attach unsubscribe handle for potential cleanup (not used here since store lives for app lifetime)
    return state
})
