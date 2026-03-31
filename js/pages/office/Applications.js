// js/pages/office/Applications.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getPendingApplications, updateApplicationStatus } from '../../services/applicationService.js';
import { showToast } from '../../utils.js';

export async function OfficeApplications() {
    if (!['office_staff','admin'].includes(store.user.role)) { window.location.hash = '#login'; return ''; }

    const applications = await getPendingApplications().catch(() => []);

    setTimeout(() => {
        document.querySelectorAll('.app-action').forEach(btn => {
            btn.addEventListener('click', async () => {
                const appId  = btn.dataset.id;
                const action = btn.dataset.action;
                
                let remarks = null;
                if (action === 'rejected') {
                    remarks = prompt('Enter a reason for rejecting this application:');
                    if (remarks === null) return;
                }

                const originalText = btn.textContent;
                btn.disabled = true; btn.textContent = '…';
                try {
                    await updateApplicationStatus(appId, action, remarks, store.user.data.admin_id);
                    const row = document.getElementById(`app-${appId}`);
                    if (row) { row.style.opacity = '0'; setTimeout(() => row.remove(), 400); }
                    showToast(`Application ${action}.`, 'success');
                } catch (err) { 
                    showToast(err.message, 'error'); 
                    btn.disabled = false; btn.textContent = originalText;
                }
            });
        });
    }, 0);

    const rows = applications.length === 0
        ? `<tr><td colspan="8" style="text-align:center;padding:48px;color:var(--text-secondary);">
                <div style="font-size:2.5rem;margin-bottom:12px;">🎉</div>
                No applications pending final review!
           </td></tr>`
        : applications.map(app => `
            <tr id="app-${app.application_id}" style="border-bottom:1px solid var(--border);transition:opacity 0.4s;">
                <td style="padding:14px 12px;">
                    <div style="font-weight:700;font-size:0.9rem;">${app.student?.name || '—'}</div>
                    <div style="font-size:0.72rem;color:var(--text-secondary);">${app.student?.register_number || ''}</div>
                </td>
                <td style="padding:14px 12px;font-size:0.85rem;font-weight:600;color:var(--text-primary);">
                    ${app.external_application_id || app.application_id.split('-')[0].toUpperCase()}
                </td>
                <td style="padding:14px 12px;font-size:0.85rem;">
                    <div>${app.scholarship?.scholarship_name || '—'}</div>
                    <div style="font-weight:700;color:var(--primary);margin-top:2px;">₹${Number(app.scholarship?.amount||0).toLocaleString()}</div>
                </td>
                <td style="padding:14px 12px;font-size:0.8rem;color:var(--text-secondary);">
                    ${new Date(app.application_date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                </td>
                <td style="padding:14px 12px;">
                    ${app.scholarship?.external_url 
                        ? `<a href="${app.scholarship.external_url}" target="_blank" style="font-size:0.75rem;color:white;background:var(--primary);padding:4px 10px;border-radius:6px;text-decoration:none;display:inline-block;">Portal ↗</a>`
                        : `<span style="font-size:0.75rem;color:var(--text-secondary);">Internal</span>`}
                </td>
                <td style="padding:14px 12px;">
                    <span class="badge" style="background:${getStatusColor(app.status)}20;color:${getStatusColor(app.status)};">${app.status}</span>
                </td>
                <td style="padding:14px 12px;display:flex;flex-direction:column;gap:6px;">
                    ${app.status === 'pending' ? `<button class="app-action" data-id="${app.application_id}" data-action="under_verification" style="background:var(--warning);color:white;padding:5px 10px;font-size:0.75rem;border-radius:6px;width:100%;">Inspect External</button>` : ''}
                    <div style="display:flex;gap:6px;">
                        <button class="app-action" data-id="${app.application_id}" data-action="approved" style="background:var(--success);color:white;padding:5px 10px;font-size:0.75rem;border-radius:6px;flex:1;">✅</button>
                        <button class="app-action" data-id="${app.application_id}" data-action="rejected" style="background:var(--danger);color:white;padding:5px 10px;font-size:0.75rem;border-radius:6px;flex:1;">❌</button>
                    </div>
                </td>
            </tr>`).join('');

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="margin-bottom:28px;">
                        <h1 style="font-size:2rem;margin:0;">All Applications</h1>
                        <p style="color:var(--text-secondary);margin-top:4px;">${applications.length} total applications (read-only view)</p>
                    </div>
                    <div class="card" style="padding:0;overflow:hidden;">
                        <table style="width:100%;border-collapse:collapse;">
                            <thead><tr style="background:var(--neutral-bg);">
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Student</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">App ID</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Scholarship</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Date</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">External Portal</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Status</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Action</th>
                            </tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `;
}
