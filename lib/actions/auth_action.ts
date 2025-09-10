'use server'
import { db, auth } from '@/firebase/admin';
import { cookies } from 'next/headers';
const ONE_WEEK = 60 * 60 * 24 * 7;
export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;
    try {
        const userRecord = await db.collection('users').doc(uid).get();
        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'

            }
        }
        await db.collection('users').doc(uid).set({
            name,
            email

        });
        return {
            success: true,
            message: 'User created successfully. Please sign in.'
        }
    }
    catch (e: any) {
        console.log("Error creating user:", e);
        if (e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'Email already in use. Please sign in instead.'
            }
        }
        return {
            success: false,
            message: 'There was an error creating the account. Please try again.'
        }
    }
}
export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        const userRecord = auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: 'User does not exist. Please sign up first.'
            }
        }
        await setSessionCookie(idToken);

    } catch (e) {
        console.log(e);
        return {
            success: false,
            message: 'There was an error signing in. Please try again.'
        }
    }
}
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: 60 * 60 * 24 * 7 * 1000 });
    cookieStore.set('session', sessionCookie, { maxAge: ONE_WEEK * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', sameSite: 'lax' });
}
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
        return null;
    }
    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('Users').doc(decodedClaims.uid).get();
        if (!userRecord.exists) {
            return null;
        }
        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User;


    } catch (error) {
        console.log('Error verifying session cookie:', error);
        return null;
    }
}
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}