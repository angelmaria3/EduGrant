// js/services/feeService.js
import { supabase } from '../supabaseClient.js';

export async function getStudentFee(studentId) {
    const year = new Date().getFullYear();
    const { data, error } = await supabase
        .from('fee_details')
        .select('*')
        .eq('student_id', studentId)
        .eq('academic_year', year)
        .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
}

export async function getAllFeeDetails() {
    const { data, error } = await supabase
        .from('fee_details')
        .select(`
            *,
            student (name, register_number, department)
        `)
        .eq('academic_year', new Date().getFullYear())
        .order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
}

export async function initializeStudentFee(studentId, totalFee) {
    const year = new Date().getFullYear();
    const { error } = await supabase
        .from('fee_details')
        .upsert({
            student_id: studentId,
            total_fee: totalFee,
            paid_amount: 0,
            payment_status: 'unpaid',
            academic_year: year
        }, { onConflict: 'student_id,academic_year' });
    if (error) throw error;
}

export async function updateFeePayment(studentId, paidAmount, year) {
    const { data: fee } = await supabase
        .from('fee_details')
        .select('total_fee')
        .eq('student_id', studentId)
        .eq('academic_year', year)
        .single();

    const status = fee && paidAmount >= fee.total_fee ? 'paid' : 'partial';
    const { error } = await supabase
        .from('fee_details')
        .update({
            paid_amount: paidAmount,
            payment_status: status,
            updated_at: new Date().toISOString()
        })
        .eq('student_id', studentId)
        .eq('academic_year', year);
    if (error) throw error;
}
