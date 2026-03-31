// js/services/scholarshipService.js
import { supabase } from '../supabaseClient.js';

export async function getAllScholarships() {
    const { data, error } = await supabase
        .from('scholarship')
        .select(`*, eligibility_criteria(*)`)
        .order('scholarship_name');
    if (error) throw error;
    return data;
}

export async function getScholarshipById(scholarshipId) {
    const { data, error } = await supabase
        .from('scholarship')
        .select(`*, eligibility_criteria(*)`)
        .eq('scholarship_id', scholarshipId)
        .single();
    if (error) throw error;
    return data;
}

export async function getEligibleScholarships(studentId) {
    const { data, error } = await supabase
        .rpc('get_eligible_scholarships', { p_student_id: studentId });
    if (error) throw error;
    return data;
}

export async function createScholarship(payload) {
    const { data, error } = await supabase
        .from('scholarship')
        .insert(payload)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function createEligibilityCriteria(criteriaPayload) {
    const { data, error } = await supabase
        .from('eligibility_criteria')
        .insert(criteriaPayload)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function updateScholarship(scholarshipId, updates) {
    const { error } = await supabase
        .from('scholarship')
        .update(updates)
        .eq('scholarship_id', scholarshipId);
    if (error) throw error;
}

export async function updateEligibilityCriteria(criteriaId, updates) {
    const { error } = await supabase
        .from('eligibility_criteria')
        .update(updates)
        .eq('criteria_id', criteriaId);
    if (error) throw error;
}

export async function deleteScholarship(scholarshipId) {
    const { error } = await supabase
        .from('scholarship')
        .delete()
        .eq('scholarship_id', scholarshipId);
    if (error) throw error;
}
