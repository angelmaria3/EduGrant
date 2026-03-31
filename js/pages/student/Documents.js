// js/pages/student/Documents.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getMyApplications } from '../../services/applicationService.js';
import { getDocumentsByApplication, uploadDocument, getSignedUrl } from '../../services/documentService.js';
import { showToast } from '../../utils.js';
import { navigate } from '../../router.js';

export async function DocumentsPage() {
    const student = store.user.data;
    if (!student) { window.location.hash = '#login'; return ''; }

    const applications = await getMyApplications(student.student_id).catch(() => []);

    const allDocs = [];
    for (const app of applications) {
        const docs = await getDocumentsByApplication(app.application_id).catch(() => []);
        docs.forEach(d => allDocs.push({ ...d, appName: app.scholarship?.scholarship_name || 'Application', appId: app.application_id }));
    }

    const statusColor = { verified: '#27AE60', pending: '#F39C12', rejected: '#C0392B' };
    const statusIcon  = { verified: '✅', pending: '⏳', rejected: '❌' };

    const docRows = allDocs.length === 0
        ? '<p style="text-align:center;padding:32px;color:var(--text-secondary);">No documents uploaded yet.</p>'
        : allDocs.map(doc => `
            <div style="display:flex;align-items:center;gap:14px;padding:14px;border:1px solid var(--border);border-radius:10px;background:#fcfcfc;">
                <span style="font-size:1.5rem;">📄</span>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:700;font-size:0.9rem;">${doc.document_type}</div>
                    <div style="font-size:0.75rem;color:var(--text-secondary);">${doc.appName}</div>
                </div>
                <span style="font-size:0.8rem;font-weight:700;color:${statusColor[doc.verification_status] || '#666'};">
                    ${statusIcon[doc.verification_status] || ''} ${doc.verification_status}
                </span>
                <button data-path="${doc.document_path}" class="view-doc-btn" style="background:var(--primary);color:white;padding:6px 12px;font-size:0.75rem;border-radius:6px;">View</button>
            </div>
        `).join('');

    const appOptions = applications.map(a =>
        `<option value="${a.application_id}">${a.scholarship?.scholarship_name || a.application_id}</option>`
    ).join('');

    setTimeout(() => {
        document.querySelectorAll('.view-doc-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const path = btn.dataset.path;
                btn.textContent = '…';
                try {
                    const url = await getSignedUrl(path);
                    if (url) window.open(url, '_blank');
                    else showToast('Could not generate link.', 'error');
                } catch { showToast('Error fetching document.', 'error'); }
                finally { btn.textContent = 'View'; }
            });
        });

        document.getElementById('upload-form')?.addEventListener('submit', async e => {
            e.preventDefault();
            const fd      = new FormData(e.target);
            const appId   = fd.get('appId');
            const docType = fd.get('docType');
            const file    = fd.get('file');
            const btn     = document.getElementById('upload-btn');
            if (!file || file.size === 0) { showToast('Please select a file.', 'error'); return; }
            if (file.size > 2 * 1024 * 1024) { showToast('File must be under 2MB.', 'error'); return; }
            btn.disabled = true; btn.textContent = 'Uploading…';
            try {
                await uploadDocument(file, store.user.authUser.id, appId, docType);
                showToast('Document uploaded!', 'success');
                e.target.reset();
                navigate();
            } catch (err) {
                showToast(err.message || 'Upload failed.', 'error');
            } finally { btn.disabled = false; btn.textContent = 'Upload Document'; }
        });
    }, 0);

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <h1 style="font-size:2rem;margin-bottom:8px;">My Documents</h1>
                    <p style="color:var(--text-secondary);margin-bottom:32px;">Upload and track document verification</p>

                    <div style="display:grid;grid-template-columns:2fr 1fr;gap:32px;align-items:start;">
                        <div class="card">
                            <h3 style="margin-bottom:20px;">Uploaded Documents</h3>
                            <div style="display:flex;flex-direction:column;gap:10px;">${docRows}</div>
                        </div>

                        <div class="card">
                            <h3 style="margin-bottom:20px;">Upload New</h3>
                            ${applications.length === 0 ? `
                                <p style="color:var(--text-secondary);font-size:0.9rem;">Apply first, then upload documents.</p>
                                <button onclick="window.location.hash='#student/scholarships'" style="margin-top:12px;background:var(--primary);color:white;padding:10px;width:100%;font-weight:700;">Browse Scholarships</button>
                            ` : `
                                <form id="upload-form" style="display:flex;flex-direction:column;gap:16px;">
                                    <div class="form-group">
                                        <label>Application</label>
                                        <select name="appId" required>${appOptions}</select>
                                    </div>
                                    <div class="form-group">
                                        <label>Document Type</label>
                                        <select name="docType" required>
                                            <option value="income_cert">Income Certificate</option>
                                            <option value="marksheet">Marksheet</option>
                                            <option value="id_proof">ID Proof (Aadhaar)</option>
                                            <option value="caste_cert">Caste Certificate</option>
                                            <option value="bonafide">Bonafide Certificate</option>
                                            <option value="bank_passbook">Bank Passbook</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>File (PDF/Image, max 2MB)</label>
                                        <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" required style="padding:6px;">
                                    </div>
                                    <button id="upload-btn" type="submit" style="background:var(--primary);color:white;padding:12px;font-weight:700;">Upload Document</button>
                                </form>
                            `}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
