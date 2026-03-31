// js/pages/admin/Applications.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getAllApplications } from '../../services/applicationService.js';

export async function AdminApplicationsPage() {
    if (store.user.role !== 'admin') { window.location.hash = '#admin/dashboard'; return ''; }

    const applications = await getAllApplications().catch(() => []);
    let filter = 'all';

    function renderTable(apps) {
        if (apps.length === 0) return `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-secondary);">No applications found.</td></tr>`;
        return apps.map(app => `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:14px 12px;">
                    <div style="font-weight:700;font-size:0.9rem;">${app.student?.name || '—'}</div>
                    <div style="font-size:0.72rem;color:var(--text-secondary);">${app.student?.register_number || ''}</div>
                </td>
                <td style="padding:14px 12px;font-size:0.85rem;color:var(--text-secondary);">${app.student?.department || '—'}</td>
                <td style="padding:14px 12px;">
                    <div style="font-weight:600;font-size:0.88rem;">${app.scholarship?.scholarship_name || '—'}</div>
                    <div style="font-size:0.72rem;color:var(--primary);font-weight:700;">₹${Number(app.scholarship?.amount||0).toLocaleString()}</div>
                </td>
                <td style="padding:14px 12px;font-size:0.8rem;color:var(--text-secondary);">${new Date(app.application_date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                <td style="padding:14px 12px;font-size:0.82rem;"><strong style="color:var(--success);">${app.student?.cgpa || '—'}</strong></td>
                <td style="padding:14px 12px;">
                    <span class="badge" style="background:${getStatusColor(app.status)}20;color:${getStatusColor(app.status)};">${app.status}</span>
                </td>
                <td style="padding:14px 12px;">
                    ${app.status === 'pending'
                        ? `<button onclick="window.location.hash='#admin/applications/${app.application_id}'" style="background:var(--primary);color:white;padding:5px 12px;font-size:0.75rem;border-radius:6px;">Review →</button>`
                        : `<button onclick="window.location.hash='#admin/applications/${app.application_id}'" style="background:var(--neutral-bg);border:1px solid var(--border);padding:5px 12px;font-size:0.75rem;border-radius:6px;">View</button>`}
                </td>
            </tr>`).join('');
    }

    setTimeout(() => {
        const tbody = document.getElementById('app-tbody');
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => { b.style.background='white'; b.style.color='var(--text-primary)'; });
                btn.style.background = 'var(--primary)'; btn.style.color = 'white';
                const f = btn.dataset.filter;
                const filtered = f === 'all' ? applications : applications.filter(a => a.status === f);
                tbody.innerHTML = renderTable(filtered);
            });
        });
    }, 0);

    const pending  = applications.filter(a => a.status === 'pending').length;
    const approved = applications.filter(a => a.status === 'approved').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="margin-bottom:28px;display:flex;justify-content:space-between;align-items:flex-end;">
                        <div>
                            <h1 style="font-size:2rem;margin:0;">All Applications</h1>
                            <p style="color:var(--text-secondary);margin-top:4px;">${applications.length} total applications</p>
                        </div>
                    </div>

                    <!-- Filter Tabs -->
                    <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
                        ${[
                            { label: `All (${applications.length})`, val: 'all' },
                            { label: `Pending (${pending})`,  val: 'pending'  },
                            { label: `Approved (${approved})`,val: 'approved' },
                            { label: `Rejected (${rejected})`,val: 'rejected' }
                        ].map((f,i) => `
                            <button class="filter-btn" data-filter="${f.val}" style="padding:8px 18px;border-radius:var(--radius-pill);font-weight:700;font-size:0.85rem;border:1px solid var(--border);background:${i===0?'var(--primary)':'white'};color:${i===0?'white':'var(--text-primary)'};">${f.label}</button>
                        `).join('')}
                    </div>

                    <div class="card" style="padding:0;overflow:hidden;">
                        <table style="width:100%;border-collapse:collapse;">
                            <thead><tr style="background:var(--neutral-bg);">
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Student</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Dept</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Scholarship</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Date</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">CGPA</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Status</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Action</th>
                            </tr></thead>
                            <tbody id="app-tbody">${renderTable(applications)}</tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `;
}
