// js/pages/student/StatusTracker.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getMyApplications } from '../../services/applicationService.js';

export async function StatusTrackerPage() {
    const student = store.user.data;
    if (!student) { window.location.hash = '#login'; return ''; }

    const applications = await getMyApplications(student.student_id).catch(() => []);

    const statusIcon = { approved: '✅', rejected: '❌', pending: '⏳' };

    const rows = applications.length === 0
        ? `<tr><td colspan="6" style="padding:48px;text-align:center;color:var(--text-secondary);">
                <div style="font-size:2.5rem;margin-bottom:12px;">📭</div>
                No applications yet. <a href="#student/scholarships" style="color:var(--primary);font-weight:700;">Browse scholarships →</a>
           </td></tr>`
        : applications.map(app => `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:16px 12px;">
                    <div style="font-weight:700;">${app.scholarship?.scholarship_name || '—'}</div>
                    <div style="font-size:0.75rem;color:var(--text-secondary);">${app.scholarship?.provider || ''}</div>
                </td>
                <td style="padding:16px 12px;font-weight:700;color:var(--primary);">₹${Number(app.scholarship?.amount || 0).toLocaleString()}</td>
                <td style="padding:16px 12px;color:var(--text-secondary);font-size:0.85rem;">
                    ${new Date(app.application_date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                </td>
                <td style="padding:16px 12px;">
                    ${(app.document || []).length > 0
                        ? `<span style="color:var(--success);font-weight:700;font-size:0.8rem;">📎 ${app.document.length} uploaded</span>`
                        : `<span style="color:var(--warning);font-size:0.8rem;">No docs</span>`}
                </td>
                <td style="padding:16px 12px;">
                    <span class="badge" style="background:${getStatusColor(app.status)}20;color:${getStatusColor(app.status)};">
                        ${statusIcon[app.status] || ''} ${app.status}
                    </span>
                </td>
                <td style="padding:16px 12px;font-size:0.82rem;color:var(--text-secondary);max-width:160px;">
                    ${app.remarks || '—'}
                </td>
            </tr>
        `).join('');

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="margin-bottom:32px;display:flex;justify-content:space-between;align-items:flex-end;">
                        <div>
                            <h1 style="font-size:2rem;margin:0;font-family:'Outfit';">Application Status</h1>
                            <p style="color:var(--text-secondary);margin-top:4px;">Track all your scholarship applications in real time</p>
                        </div>
                        <button onclick="window.location.hash='#student/scholarships'" style="background:var(--primary);color:white;padding:10px 20px;font-weight:700;">+ Apply New</button>
                    </div>

                    <!-- Summary Badges -->
                    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;">
                        ${[
                            { label: 'Total',    val: applications.length,                              color: '#1A3C6E' },
                            { label: 'Approved', val: applications.filter(a=>a.status==='approved').length, color: '#27AE60' },
                            { label: 'Pending',  val: applications.filter(a=>a.status==='pending').length,  color: '#F39C12' },
                            { label: 'Rejected', val: applications.filter(a=>a.status==='rejected').length, color: '#C0392B' }
                        ].map(b => `
                            <div style="background:${b.color}15;border:1px solid ${b.color}30;color:${b.color};padding:8px 20px;border-radius:var(--radius-pill);font-weight:700;font-size:0.9rem;">
                                ${b.label}: ${b.val}
                            </div>
                        `).join('')}
                    </div>

                    <div class="card" style="padding:0;overflow:hidden;">
                        <table style="width:100%;border-collapse:collapse;">
                            <thead>
                                <tr style="background:var(--neutral-bg);text-align:left;">
                                    <th style="padding:14px 12px;font-size:0.8rem;color:var(--text-secondary);font-weight:700;text-transform:uppercase;">Scholarship</th>
                                    <th style="padding:14px 12px;font-size:0.8rem;color:var(--text-secondary);font-weight:700;text-transform:uppercase;">Amount</th>
                                    <th style="padding:14px 12px;font-size:0.8rem;color:var(--text-secondary);font-weight:700;text-transform:uppercase;">Applied On</th>
                                    <th style="padding:14px 12px;font-size:0.8rem;color:var(--text-secondary);font-weight:700;text-transform:uppercase;">Documents</th>
                                    <th style="padding:14px 12px;font-size:0.8rem;color:var(--text-secondary);font-weight:700;text-transform:uppercase;">Status</th>
                                    <th style="padding:14px 12px;font-size:0.8rem;color:var(--text-secondary);font-weight:700;text-transform:uppercase;">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `;
}
