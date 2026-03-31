// js/pages/admin/ReviewPanel.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getApplicationById, updateApplicationStatus } from '../../services/applicationService.js';
import { updateDocumentStatus, getSignedUrl } from '../../services/documentService.js';
import { checkEligibility } from '../../services/eligibilityEngine.js';
import { showToast } from '../../utils.js';

export async function AdminReviewPanel(params) {
    if (store.user.role !== 'admin') { window.location.hash = '#admin/dashboard'; return ''; }

    const applicationId = params?.id;
    if (!applicationId) { window.location.hash = '#admin/applications'; return ''; }

    let appData;
    try {
        appData = await getApplicationById(applicationId);
    } catch {
        return `<div style="padding:40px;text-align:center;color:var(--danger);">Application not found.</div>`;
    }

    const student    = appData.student;
    const scholarship = appData.scholarship;
    const criteria   = scholarship?.eligibility_criteria?.[0];
    const documents  = appData.document || [];

    const { eligible, reasons } = criteria
        ? checkEligibility(student, criteria)
        : { eligible: true, reasons: [] };

    setTimeout(() => {
        // View document
        document.querySelectorAll('.view-doc').forEach(btn => {
            btn.addEventListener('click', async () => {
                const path = btn.dataset.path;
                btn.textContent = '…';
                try {
                    const url = await getSignedUrl(path);
                    if (url) window.open(url, '_blank');
                    else showToast('Could not fetch URL.', 'error');
                } catch { showToast('Error.', 'error'); }
                finally { btn.textContent = '👁 View'; }
            });
        });

        // Verify / Reject document
        document.querySelectorAll('.doc-verify').forEach(btn => {
            btn.addEventListener('click', async () => {
                const docId = btn.dataset.id;
                const status = btn.dataset.action;
                try {
                    await updateDocumentStatus(docId, status);
                    const row = document.getElementById(`doc-row-${docId}`);
                    const badge = row?.querySelector('.doc-status');
                    if (badge) { badge.textContent = status; badge.style.color = getStatusColor(status); badge.style.background = getStatusColor(status)+'20'; }
                    btn.parentElement.innerHTML = `<span style="color:${getStatusColor(status)};font-weight:700;font-size:0.8rem;">${status}</span>`;
                    showToast(`Document marked as ${status}`, 'success');
                } catch (err) { showToast(err.message, 'error'); }
            });
        });

        // Approve / Reject application
        document.getElementById('approve-btn')?.addEventListener('click', async () => {
            const remarks = document.getElementById('admin-remarks').value;
            if (!confirm('Approve this application? This will credit the scholarship amount to the student\'s fee account.')) return;
            const btn = document.getElementById('approve-btn');
            btn.disabled = true; btn.textContent = 'Processing…';
            try {
                await updateApplicationStatus(applicationId, 'approved', remarks, store.user.data.admin_id);
                showToast('Application approved! Fee record updated.', 'success');
                window.location.hash = '#admin/applications';
            } catch (err) { showToast(err.message || 'Failed.', 'error'); btn.disabled = false; btn.textContent = '✅ Approve'; }
        });

        document.getElementById('reject-btn')?.addEventListener('click', async () => {
            const remarks = document.getElementById('admin-remarks').value;
            if (!remarks.trim()) { showToast('Please enter rejection remarks.', 'error'); return; }
            if (!confirm('Reject this application?')) return;
            const btn = document.getElementById('reject-btn');
            btn.disabled = true; btn.textContent = 'Processing…';
            try {
                await updateApplicationStatus(applicationId, 'rejected', remarks, store.user.data.admin_id);
                showToast('Application rejected.', 'success');
                window.location.hash = '#admin/applications';
            } catch (err) { showToast(err.message || 'Failed.', 'error'); btn.disabled = false; btn.textContent = '❌ Reject'; }
        });
    }, 0);

    const docRows = documents.length === 0
        ? `<tr><td colspan="4" style="padding:24px;text-align:center;color:var(--text-secondary);">No documents uploaded for this application.</td></tr>`
        : documents.map(doc => `
            <tr id="doc-row-${doc.document_id}" style="border-bottom:1px solid var(--border);">
                <td style="padding:12px 8px;font-weight:600;">${doc.document_type}</td>
                <td style="padding:12px 8px;"><button class="view-doc" data-path="${doc.document_path}" style="background:var(--primary);color:white;padding:4px 10px;font-size:0.75rem;border-radius:6px;">👁 View</button></td>
                <td style="padding:12px 8px;">
                    <span class="doc-status badge" style="background:${getStatusColor(doc.verification_status)}20;color:${getStatusColor(doc.verification_status)};">${doc.verification_status}</span>
                </td>
                <td style="padding:12px 8px;">
                    ${doc.verification_status === 'pending' ? `
                        <button class="doc-verify" data-id="${doc.document_id}" data-action="verified" style="background:var(--success);color:white;padding:4px 8px;font-size:0.7rem;margin-right:4px;border-radius:4px;">Verify</button>
                        <button class="doc-verify" data-id="${doc.document_id}" data-action="rejected" style="background:var(--danger);color:white;padding:4px 8px;font-size:0.7rem;border-radius:4px;">Reject</button>
                    ` : `<span style="color:${getStatusColor(doc.verification_status)};font-weight:700;font-size:0.8rem;">${doc.verification_status}</span>`}
                </td>
            </tr>`).join('');

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container" style="max-width:1000px;margin:0 auto;">
                    <div style="margin-bottom:var(--space-lg);display:flex;align-items:center;gap:12px;">
                        <button onclick="window.location.hash='#admin/applications'" style="background:none;font-size:1.2rem;padding:0;">←</button>
                        <h1 style="margin:0;">Review Application</h1>
                        <span style="margin-left:auto;background:${getStatusColor(appData.status)}20;color:${getStatusColor(appData.status)};padding:6px 16px;border-radius:var(--radius-pill);font-weight:700;text-transform:uppercase;">${appData.status}</span>
                    </div>

                    <!-- Student + Scholarship Info -->
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);margin-bottom:var(--space-md);">
                        <div class="card">
                            <h3 style="font-size:1rem;border-bottom:1px solid var(--border);padding-bottom:8px;margin-bottom:12px;">Student Info</h3>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.88rem;">
                                <div><span style="color:var(--text-secondary);">Name:</span> <strong>${student?.name || '—'}</strong></div>
                                <div><span style="color:var(--text-secondary);">Reg No:</span> <strong>${student?.register_number || '—'}</strong></div>
                                <div><span style="color:var(--text-secondary);">Dept:</span> <strong>${student?.department || '—'}</strong></div>
                                <div><span style="color:var(--text-secondary);">Category:</span> <strong>${student?.category || '—'}</strong></div>
                                <div><span style="color:var(--text-secondary);">CGPA:</span> <strong style="color:var(--success);">${student?.cgpa || '—'}</strong></div>
                                <div><span style="color:var(--text-secondary);">Income:</span> <strong style="color:var(--primary);">₹${Number(student?.annual_income||0).toLocaleString()}</strong></div>
                                <div><span style="color:var(--text-secondary);">Year:</span> <strong>${student?.year_study || '—'}</strong></div>
                                <div><span style="color:var(--text-secondary);">Email:</span> <strong>${student?.email || '—'}</strong></div>
                            </div>
                        </div>
                        <div class="card">
                            <h3 style="font-size:1rem;border-bottom:1px solid var(--border);padding-bottom:8px;margin-bottom:12px;">Scholarship Info</h3>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.88rem;">
                                <div style="grid-column:span 2"><span style="color:var(--text-secondary);">Title:</span> <strong>${scholarship?.scholarship_name || '—'}</strong></div>
                                <div><span style="color:var(--text-secondary);">Amount:</span> <strong style="color:var(--primary);">₹${Number(scholarship?.amount||0).toLocaleString()}</strong></div>
                                <div><span style="color:var(--text-secondary);">Provider:</span> <strong>${scholarship?.provider || '—'}</strong></div>
                                <div><span style="color:var(--text-secondary);">Type:</span> <strong>${scholarship?.type || '—'}</strong></div>
                                <div><span style="color:var(--text-secondary);">Applied:</span> <strong>${new Date(appData.application_date).toLocaleDateString('en-IN')}</strong></div>
                            </div>
                        </div>
                    </div>

                    <!-- Eligibility Auto-Check -->
                    <div class="card" style="margin-bottom:var(--space-md);">
                        <h3 style="font-size:1rem;margin-bottom:16px;">Eligibility Auto-Check</h3>
                        ${criteria ? `
                            <div style="display:flex;flex-direction:column;gap:8px;">
                                <div style="display:flex;align-items:center;gap:10px;color:${student?.cgpa >= criteria.min_cgpa ? 'var(--success)' : 'var(--danger)'};font-weight:600;">
                                    <span>${student?.cgpa >= criteria.min_cgpa ? '✅' : '❌'}</span> CGPA ≥ ${criteria.min_cgpa} (Student: ${student?.cgpa})
                                </div>
                                <div style="display:flex;align-items:center;gap:10px;color:${student?.annual_income <= criteria.max_income ? 'var(--success)' : 'var(--danger)'};font-weight:600;">
                                    <span>${student?.annual_income <= criteria.max_income ? '✅' : '❌'}</span> Income ≤ ₹${Number(criteria.max_income).toLocaleString()} (Student: ₹${Number(student?.annual_income||0).toLocaleString()})
                                </div>
                                ${criteria.eligible_category ? `
                                <div style="display:flex;align-items:center;gap:10px;color:${criteria.eligible_category === student?.category ? 'var(--success)' : 'var(--danger)'};font-weight:600;">
                                    <span>${criteria.eligible_category === student?.category ? '✅' : '❌'}</span> Category: ${criteria.eligible_category} (Student: ${student?.category})
                                </div>` : `<div style="color:var(--success);font-weight:600;">✅ Open to all categories</div>`}
                                <div style="margin-top:8px;padding:10px 14px;background:${eligible?'rgba(39,174,96,0.1)':'rgba(192,57,43,0.1)'};border-radius:8px;font-weight:700;color:${eligible?'var(--success)':'var(--danger)'};">
                                    ${eligible ? '✅ Student meets all eligibility criteria' : '❌ Student does NOT meet criteria — ' + reasons.join('; ')}
                                </div>
                            </div>
                        ` : '<p style="color:var(--text-secondary);">No criteria defined for this scholarship.</p>'}
                    </div>

                    <!-- Documents -->
                    <div class="card" style="margin-bottom:var(--space-md);">
                        <h3 style="font-size:1rem;margin-bottom:var(--space-md);">Uploaded Documents</h3>
                        <table style="width:100%;border-collapse:collapse;">
                            <thead><tr style="text-align:left;border-bottom:1px solid var(--border);">
                                <th style="padding:10px 8px;font-size:0.8rem;color:var(--text-secondary);">Type</th>
                                <th style="padding:10px 8px;font-size:0.8rem;color:var(--text-secondary);">File</th>
                                <th style="padding:10px 8px;font-size:0.8rem;color:var(--text-secondary);">Status</th>
                                <th style="padding:10px 8px;font-size:0.8rem;color:var(--text-secondary);">Action</th>
                            </tr></thead>
                            <tbody>${docRows}</tbody>
                        </table>
                    </div>

                    <!-- Decision -->
                    ${appData.status === 'pending' ? `
                    <div style="display:flex;gap:var(--space-md);">
                        <textarea id="admin-remarks" placeholder="Add remarks (required for rejection)…" style="flex:1;height:100px;padding:12px;"></textarea>
                        <div style="display:flex;flex-direction:column;gap:12px;width:240px;">
                            <button id="approve-btn" style="background:var(--success);color:white;padding:16px;font-size:1rem;font-weight:700;">✅ Approve</button>
                            <button id="reject-btn" style="background:var(--danger);color:white;padding:16px;font-size:1rem;font-weight:700;">❌ Reject</button>
                        </div>
                    </div>
                    ` : `
                    <div class="card" style="background:${getStatusColor(appData.status)}10;border:1px solid ${getStatusColor(appData.status)}30;">
                        <strong style="color:${getStatusColor(appData.status)};">Decision: ${appData.status.toUpperCase()}</strong>
                        ${appData.remarks ? `<p style="margin-top:8px;color:var(--text-secondary);">Remarks: ${appData.remarks}</p>` : ''}
                    </div>`}
                </div>
            </main>
        </div>
    `;
}
