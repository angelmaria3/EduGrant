// js/services/applicationService.js
import { supabase } from '../supabaseClient.js';

let myAppsCache = {};

export async function submitApplication(studentId, scholarshipId, externalApplicationId = null) {
    const year = new Date().getFullYear();
    const payload = { student_id: studentId, scholarship_id: scholarshipId, year, status: 'submitted' };
    if (externalApplicationId) {
        payload.external_application_id = externalApplicationId;
    }
    const { data, error } = await supabase
        .from('application')
        .insert(payload)
        .select()
        .single();
    if (error) throw error;
    delete myAppsCache[studentId]; // bust cache
    return data;
}

export async function getMyApplications(studentId) {
    if (myAppsCache[studentId]) return myAppsCache[studentId];

    const { data, error } = await supabase
        .from('application')
        .select(`
            *,
            scholarship (scholarship_name, amount, is_percentage, provider, type),
            document (document_id, document_type, verification_status)
        `)
        .eq('student_id', studentId)
        .order('application_date', { ascending: false });
    if (error) throw error;
    
    myAppsCache[studentId] = data;
    return data;
}

export async function getAllApplications() {
    const { data, error } = await supabase
        .from('application')
        .select(`
            *,
            student (name, register_number, department, cgpa, category, annual_income),
            scholarship (scholarship_name, amount, is_percentage, type)
        `)
        .order('application_date', { ascending: false });
    if (error) throw error;
    return data;
}

export async function getPendingApplications() {
    const { data, error } = await supabase
        .from('application')
        .select(`
            *,
            student (name, register_number, department, cgpa, category, annual_income),
            scholarship (scholarship_name, amount, is_percentage, external_url),
            document (*)
        `)
        .in('status', ['submitted', 'under_verification', 'pending'])
        .order('application_date');
    if (error) throw error;

    return data;
}

export async function getApplicationById(applicationId) {
    const { data, error } = await supabase
        .from('application')
        .select(`
            *,
            student (*),
            scholarship (*, eligibility_criteria(*)),
            document (*)
        `)
        .eq('application_id', applicationId)
        .single();
    if (error) throw error;
    return data;
}

export async function updateApplicationStatus(applicationId, status, remarks, adminId) {
    // 1. Update Application status
    const { data: app, error } = await supabase
        .from('application')
        .update({ status, remarks, admin_id: adminId })
        .eq('application_id', applicationId)
        .select('student_id, scholarship_id')
        .single();
    if (error) throw error;

    // 2. If approved → Credit amount (flat OR percentage based)
    if (status === 'approved') {
        const { data: sch } = await supabase
            .from('scholarship')
            .select('amount, is_percentage')
            .eq('scholarship_id', app.scholarship_id)
            .single();

        const year = new Date().getFullYear();
        
        // 1. Get student current semester
        const { data: student } = await supabase
            .from('student')
            .select('current_semester')
            .eq('student_id', app.student_id)
            .single();

        // 2. Get global fee structure for that semester
        const { data: globalFee } = await supabase
            .from('global_fee_structure')
            .select('tuition_fee')
            .eq('semester', student.current_semester || 1)
            .eq('academic_year', year)
            .single();

        if (globalFee && sch) {
            let amountToCredit = parseFloat(sch.amount);

            // Calculation based specifically on Tuition Fee component
            if (sch.is_percentage) {
                amountToCredit = parseFloat(globalFee.tuition_fee) * (amountToCredit / 100.0);
            }

            // Update individual fee_details record for overall payment tracking
            const { data: fee } = await supabase
                .from('fee_details')
                .select('paid_amount, total_fee')
                .eq('student_id', app.student_id)
                .eq('academic_year', year)
                .single();

            if (fee) {
                const newPaid = parseFloat(fee.paid_amount) + amountToCredit;
                const payStatus = newPaid >= fee.total_fee ? 'paid' : 'partial';

                await supabase
                    .from('fee_details')
                    .update({ 
                        paid_amount: newPaid, 
                        payment_status: payStatus, 
                        updated_at: new Date().toISOString() 
                    })
                    .eq('student_id', app.student_id)
                    .eq('academic_year', year);
            }
        }
    }
}

