// js/services/authService.js
import { supabase } from '../supabaseClient.js';

export async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
}

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
}

export async function getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
}

export async function getUserRole(authUserId) {
    const { data: adminData } = await supabase
        .from('admin')
        .select('role')
        .eq('auth_user_id', authUserId)
        .single();
    if (adminData) return adminData.role; // 'admin' or 'office_staff'
    return 'student';
}

export async function signOut() {
    await supabase.auth.signOut();
    window.location.hash = '#login';
}
