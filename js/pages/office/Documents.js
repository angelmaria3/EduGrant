// js/pages/office/Documents.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getAllPendingDocuments, updateDocumentStatus, getSignedUrl } from '../../services/documentService.js';
import { showToast } from '../../utils.js';

export async function OfficeDocuments() {
    if (!['office_staff','admin'].includes(store.user.role)) { window.location.hash = '#login'; return ''; }

    const docs = await getAllPendingDocuments().catch(() => []);

    setTimeout(() => {
        document.querySelectorAll('.view-signed').forEach(btn => {
            btn.addEventListener('click', async () => {
                btn.textContent = '…';
                try {
                    const url = await getSignedUrl(btn.dataset.path);
                    if (url) window.open(url, '_blank');
                    else showToast('No URL generated.', 'error');
                } catch { showToast('Error.', 'error'); }
                finally { btn.textContent = '👁 View'; }
            });
        });

        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', async () => {
                const docId = btn.dataset.id;
                const action = btn.dataset.action;
                btn.disabled = true;
                try {
                    await updateDocumentStatus(docId, action);
                    const row = document.getElementById(`drow-${docId}`);
                    if (row) { row.style.opacity = '0'; setTimeout(() => row.remove(), 400); }
                    showToast(`Marked as ${action}.`, 'success');
                } catch (err) { showToast(err.message, 'error'); btn.disabled = false; }
            });
        });
    }, 0);

    const rows = docs.length === 0
        ? `<tr><td colspan="5" style="text-align:center;padding:48px;color:var(--text-secondary);">
                <div style="font-size:2.5rem;margin-bottom:12px;">📭</div>
                No pending documents!
           </td></tr>`
        : docs.map(doc => `
            <tr id="drow-${doc.document_id}" style="border-bottom:1px solid var(--border);transition:opacity 0.4s;">
                <td style="padding:14px 12px;">
                    <div style="font-weight:700;font-size:0.9rem;">${doc.application?.student?.name || '—'}</div>
                    <div style="font-size:0.72rem;color:var(--text-secondary);">${doc.application?.student?.register_number || ''}</div>
                </td>
                <td style="padding:14px 12px;font-weight:600;">${doc.document_type}</td>
                <td style="padding:14px 12px;">
                    <span class="badge" style="background:${getStatusColor(doc.verification_status)}20;color:${getStatusColor(doc.verification_status)};">${doc.verification_status}</span>
                </td>
                <td style="padding:14px 12px;">
                    <button class="view-signed" data-path="${doc.document_path}" style="background:var(--primary);color:white;padding:5px 12px;font-size:0.75rem;border-radius:6px;">👁 View</button>
                </td>
                <td style="padding:14px 12px;display:flex;gap:6px;">
                    <button class="quick-action" data-id="${doc.document_id}" data-action="verified" style="background:var(--success);color:white;padding:5px 10px;font-size:0.75rem;border-radius:6px;">✅</button>
                    <button class="quick-action" data-id="${doc.document_id}" data-action="rejected" style="background:var(--danger);color:white;padding:5px 10px;font-size:0.75rem;border-radius:6px;">❌</button>
                </td>
            </tr>`).join('');

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <h1 style="font-size:2rem;margin-bottom:8px;">Document Verification</h1>
                    <p style="color:var(--text-secondary);margin-bottom:32px;">${docs.length} document${docs.length!==1?'s':''} awaiting verification</p>
                    <div class="card" style="padding:0;overflow:hidden;">
                        <table style="width:100%;border-collapse:collapse;">
                            <thead><tr style="background:var(--neutral-bg);">
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Student</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Document</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Status</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">File</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Verify</th>
                            </tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `;
}
