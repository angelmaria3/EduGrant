// js/services/studentService.js
import { supabase } from '../supabaseClient.js';

export async function getStudentProfile(authUserId) {
    const { data, error } = await supabase
        .from('student')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();
    if (error) throw error;
    return data;
}

export async function updateStudentProfile(studentId, updates) {
    const { error } = await supabase
        .from('student')
        .update(updates)
        .eq('student_id', studentId);
    if (error) throw error;
}

export async function updateStudentCGPA(studentId, newCgpa) {
    const { error } = await supabase
        .from('student')
        .update({ cgpa: newCgpa })
        .eq('student_id', studentId);
    if (error) throw error;
}

export async function getAllStudents() {
    const { data, error } = await supabase
        .from('student')
        .select('student_id, name, register_number, department, cgpa, category, annual_income, year_study, email, phone')
        .order('name');
    if (error) throw error;
    return data;
}
