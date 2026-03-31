// js/pages/office/VerificationQueue.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getAllPendingDocuments, updateDocumentStatus, getSignedUrl } from '../../services/documentService.js';
import { showToast } from '../../utils.js';

export async function VerificationQueue() {
    if (!['office_staff','admin'].includes(store.user.role)) { window.location.hash = '#login'; return ''; }

    const docs = await getAllPendingDocuments().catch(() => []);

    const groups = {};
    docs.forEach(d => {
        const appId = d.application_id;
        if (!groups[appId]) {
            groups[appId] = {
                appId,
                studentName: d.application?.student?.name || 'Unknown',
                scholarshipName: d.application?.scholarship?.scholarship_name || 'Fee Concession',
                details: `${d.application?.student?.register_number || ''} · ${d.application?.student?.department || ''}`,
                documents: []
            };
        }
        groups[appId].documents.push(d);
    });

    setTimeout(() => {
        document.querySelectorAll('.view-doc').forEach(btn => {
            btn.addEventListener('click', async () => {
                const path = btn.dataset.path;
                btn.textContent = '…';
                try {
                    const url = await getSignedUrl(path);
                    if (url) window.open(url, '_blank');
                } finally { btn.textContent = '👁 View'; }
            });
        });

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const docId = btn.dataset.id;
                const action = btn.dataset.action;
                let remarks = '';
                if (action === 'rejected') {
                    remarks = prompt('Enter rejection reason:');
                    if (remarks === null) return;
                }
                btn.disabled = true;
                try {
                    await updateDocumentStatus(docId, action, remarks);
                    showToast(`Document ${action}!`, 'success');
                    btn.closest('.doc-item').style.opacity = '0.4';
                    btn.parentElement.innerHTML = `<span style="color:var(--${action === 'verified' ? 'success' : 'danger'}); font-weight:700;">${action.toUpperCase()}</span>`;
                } catch (err) {
                    showToast(err.message, 'error');
                    btn.disabled = false;
                }
            });
        });
    }, 0);

    const groupCards = Object.values(groups).map(g => `
        <div class="card" style="margin-bottom: 24px; padding: 24px; border: 1px solid var(--border);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid var(--neutral-bg); padding-bottom: 12px;">
                <div>
                    <h3 style="margin: 0; color: var(--primary);">${g.scholarshipName}</h3>
                    <p style="margin: 4px 0 0; color: var(--text-secondary); font-size: 0.9rem;"><strong>Applicant:</strong> ${g.studentName} (${g.details})</p>
                </div>
                <button onclick="window.location.hash='#staff/applications'" style="background: var(--primary); color: white; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; border: none; cursor: pointer;">
                    Verify Application →
                </button>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
                ${g.documents.map(d => `
                    <div class="doc-item" style="display: flex; align-items: center; justify-content: space-between; background: var(--neutral-bg); padding: 12px 16px; border-radius: 8px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 1.25rem;">📄</span>
                            <div>
                                <div style="font-weight: 700; font-size: 0.9rem;">${d.document_type}</div>
                                <div style="font-size: 0.75rem; color: #888;">Uploaded on ${new Date(d.uploaded_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <button class="view-doc" data-path="${d.document_path}" style="background: white; border: 1px solid var(--border); padding: 6px 12px; font-size: 0.75rem; border-radius: 6px; cursor: pointer;">👁 View</button>
                            <div style="display: flex; gap: 4px;">
                                <button class="action-btn" data-id="${d.document_id}" data-action="verified" style="background: var(--success); color: white; border: none; padding: 6px 10px; font-size: 0.75rem; border-radius: 6px; cursor: pointer;">✅ Verify</button>
                                <button class="action-btn" data-id="${d.document_id}" data-action="rejected" style="background: var(--danger); color: white; border: none; padding: 6px 10px; font-size: 0.75rem; border-radius: 6px; cursor: pointer;">❌ Reject</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="margin-bottom:32px;">
                        <h1 style="font-size:2rem;margin:0;">Verification Queue</h1>
                        <p style="color:var(--text-secondary);margin-top:4px;">Grouped by student submissions</p>
                    </div>

                    ${docs.length === 0 
                        ? `<div class="card" style="text-align:center; padding: 64px;">
                             <div style="font-size: 3rem; margin-bottom: 16px;">🎉</div>
                             <h3>All caught up!</h3>
                             <p style="color: var(--text-secondary);">No documents are currently pending verification.</p>
                           </div>` 
                        : groupCards}
                </div>
            </main>
        </div>
    `;
}
