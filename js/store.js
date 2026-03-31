// js/store.js
import { supabase } from './supabaseClient.js';
import { getUserRole } from './services/authService.js';

export const store = {
    user: {
        role: null,      // 'student' | 'office_staff' | 'admin'
        name: '',
        data: null,      // Full student or admin row from DB
        authUser: null   // auth.users object
    }
};

/**
 * Reads the current Supabase session, fetches the user profile, and
 * populates store.user. Cached — skips DB fetch if already initialized
 * for the same auth user.
 * Returns the session object, or null if unauthenticated.
 */
export async function initializeSession() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        store.user = { role: null, name: '', data: null, authUser: null };
        return null;
    }

    const authUser = session.user;

    // Already initialized for this user — skip DB round trip
    if (store.user.authUser?.id === authUser.id && store.user.data) {
        return session;
    }

    store.user.authUser = authUser;
    const role = await getUserRole(authUser.id);
    store.user.role = role;

    if (role === 'student') {
        const { data: student } = await supabase
            .from('student')
            .select('*')
            .eq('auth_user_id', authUser.id)
            .single();
        store.user.data = student;
        store.user.name = student?.name || authUser.email;
    } else {
        // admin or office_staff
        const { data: admin } = await supabase
            .from('admin')
            .select('*')
            .eq('auth_user_id', authUser.id)
            .single();
        store.user.data = admin;
        store.user.name = admin?.name || authUser.email;
    }

    return session;
}

/** Call this after supabase.auth.signOut() to clear in-memory state */
export function clearSession() {
    store.user = { role: null, name: '', data: null, authUser: null };
}

export function getStatusColor(status) {
    switch (status?.toLowerCase()) {
        case 'approved':
        case 'verified':
        case 'processed':           return '#27AE60'; // Green

        case 'rejected':            return '#C0392B'; // Red

        case 'pending':
        case 'submitted':           return '#F39C12'; // Orange

        case 'under review':
        case 'under_review':
        case 'in review':
        case 'under_verification':
        case 'submitted_to_institution': return '#1A3C6E'; // Blue

        case 'resubmission_required':
        case 'partial':             return '#E67E22'; // Dark Orange
        
        default:                    return '#5F6368'; // Gray
    }
}
