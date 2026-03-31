// js/pages/office/Applications.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getAllApplications } from '../../services/applicationService.js';

export async function OfficeApplications() {
    if (!['office_staff','admin'].includes(store.user.role)) { window.location.hash = '#login'; return ''; }

    const applications = await getAllApplications().catch(() => []);

    const rows = applications.length === 0
        ? `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-secondary);">No applications found.</td></tr>`
        : applications.map(app => `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:14px 12px;">
                    <div style="font-weight:700;font-size:0.9rem;">${app.student?.name || '—'}</div>
                    <div style="font-size:0.72rem;color:var(--text-secondary);">${app.student?.register_number || ''}</div>
                </td>
                <td style="padding:14px 12px;font-size:0.85rem;">${app.scholarship?.scholarship_name || '—'}</td>
                <td style="padding:14px 12px;font-weight:700;color:var(--primary);font-size:0.9rem;">₹${Number(app.scholarship?.amount||0).toLocaleString()}</td>
                <td style="padding:14px 12px;font-size:0.8rem;color:var(--text-secondary);">${new Date(app.application_date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                <td style="padding:14px 12px;">
                    <span class="badge" style="background:${getStatusColor(app.status)}20;color:${getStatusColor(app.status)};">${app.status}</span>
                </td>
                <td style="padding:14px 12px;font-size:0.82rem;color:var(--text-secondary);max-width:160px;">${app.remarks || '—'}</td>
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
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Scholarship</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Amount</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Date</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Status</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Remarks</th>
                            </tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `;
}
