// js/services/documentService.js
import { supabase } from '../supabaseClient.js';

export async function uploadDocument(file, studentId, applicationId, docType) {
    const ext = file.name.split('.').pop();
    const path = `${studentId}/${applicationId}/${docType}_${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
        .from('sfces-documents')
        .upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;

    const { error: dbErr } = await supabase.from('document').insert({
        application_id: applicationId,
        document_type: docType,
        document_path: data.path,
    });
    if (dbErr) throw dbErr;
    return data.path;
}

export async function getDocumentsByApplication(applicationId) {
    const { data, error } = await supabase
        .from('document')
        .select('*')
        .eq('application_id', applicationId)
        .order('uploaded_at', { ascending: false });
    if (error) throw error;
    return data;
}

export async function getAllPendingDocuments() {
    const { data, error } = await supabase
        .from('document')
        .select(`
            *,
            application (
                application_id, status,
                student (name, register_number, department)
            )
        `)
        .eq('verification_status', 'pending')
        .order('uploaded_at');
    if (error) throw error;
    return data;
}

export async function updateDocumentStatus(documentId, status) {
    const { error } = await supabase
        .from('document')
        .update({ verification_status: status })
        .eq('document_id', documentId);
    if (error) throw error;
}

export async function getSignedUrl(path) {
    const { data } = await supabase.storage
        .from('sfces-documents')
        .createSignedUrl(path, 3600); // 1-hour expiry
    return data?.signedUrl;
}
