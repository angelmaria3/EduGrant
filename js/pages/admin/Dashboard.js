// js/pages/admin/Dashboard.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { supabase } from '../../supabaseClient.js';
import { getPendingApplications, getAllApplications } from '../../services/applicationService.js';
import { getAllStudents } from '../../services/studentService.js';

export async function AdminDashboard() {
    if (!store.user.role || store.user.role !== 'admin') {
        window.location.hash = '#login'; return '';
    }

    const [allApps, students] = await Promise.all([
        getAllApplications().catch(() => []),
        getAllStudents().catch(() => [])
    ]);

    const pending  = allApps.filter(a => a.status === 'pending').length;
    const approved = allApps.filter(a => a.status === 'approved').length;
    const rejected = allApps.filter(a => a.status === 'rejected').length;

    const stats = [
        { label: 'Total Students',    value: students.length,  color: 'var(--primary)',  icon: '🎓' },
        { label: 'Pending Review',    value: pending,          color: 'var(--warning)',  icon: '⏳' },
        { label: 'Approved',          value: approved,         color: 'var(--success)',  icon: '✅' },
        { label: 'Rejected',          value: rejected,         color: 'var(--danger)',   icon: '❌' }
    ];

    const recentApps = allApps.slice(0, 8);

    // Dept breakdown
    const deptMap = {};
    students.forEach(s => { deptMap[s.department] = (deptMap[s.department] || 0) + 1; });
    const deptRows = Object.entries(deptMap).sort((a,b)=>b[1]-a[1]).slice(0,5)
        .map(([dept, count]) => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">
                <span style="font-weight:600;font-size:0.9rem;">${dept}</span>
                <span style="background:var(--primary)20;color:var(--primary);padding:3px 10px;border-radius:20px;font-weight:700;font-size:0.8rem;">${count} students</span>
            </div>`).join('');

    setTimeout(() => {
        // Realtime: new application notification
        const channel = supabase.channel('admin-new-apps')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'application' }, payload => {
                const counter = document.getElementById('pending-counter');
                if (counter) counter.textContent = parseInt(counter.textContent || 0) + 1;
                const badge = document.getElementById('new-app-badge');
                if (badge) { badge.style.display = 'inline-block'; setTimeout(() => badge.style.display='none', 4000); }
            }).subscribe();
        window.addEventListener('hashchange', () => supabase.removeChannel(channel), { once: true });
    }, 0);

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="margin-bottom:var(--space-lg);display:flex;justify-content:space-between;align-items:flex-end;">
                        <div>
                            <h1 style="font-size:2.2rem;letter-spacing:-1px;margin-bottom:6px;">Admin Dashboard</h1>
                            <p style="color:var(--text-secondary);">Overview of all scholarship applications &amp; students</p>
                        </div>
                        <div style="display:flex;gap:10px;">
                            <span id="new-app-badge" style="display:none;background:var(--danger);color:white;padding:6px 12px;border-radius:20px;font-weight:700;font-size:0.8rem;animation:pulse 1s infinite;">🔔 New Application!</span>
                            <button onclick="window.location.hash='#admin/applications'" style="background:var(--primary);color:white;padding:10px 20px;font-weight:700;">Review Applications →</button>
                        </div>
                    </div>

                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-bottom:32px;">
                        ${stats.map(s => `
                            <div class="card stat-card" style="border-top:4px solid ${s.color};position:relative;overflow:hidden;">
                                <div style="position:absolute;right:-10px;top:-10px;font-size:4rem;opacity:0.05;">${s.icon}</div>
                                <span class="text-overline">${s.label}</span>
                                <div class="stat-value" id="${s.label==='Pending Review'?'pending-counter':''}" style="color:${s.color};margin-top:4px;">${s.value}</div>
                            </div>`).join('')}
                    </div>

                    <div style="display:grid;grid-template-columns:2fr 1fr;gap:32px;">
                        <!-- Recent Applications -->
                        <div class="card" style="padding:0;">
                            <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                                <h3 style="margin:0;">Recent Applications</h3>
                                <button onclick="window.location.hash='#admin/applications'" style="background:none;color:var(--primary);font-weight:700;font-size:0.85rem;">View All →</button>
                            </div>
                            <table style="width:100%;border-collapse:collapse;">
                                <thead><tr style="background:var(--neutral-bg);">
                                    <th style="padding:12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Student</th>
                                    <th style="padding:12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Scholarship</th>
                                    <th style="padding:12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Date</th>
                                    <th style="padding:12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Status</th>
                                    <th style="padding:12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Action</th>
                                </tr></thead>
                                <tbody>
                                    ${recentApps.length === 0 ? `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-secondary);">No applications yet.</td></tr>` :
                                    recentApps.map(app => `
                                        <tr style="border-bottom:1px solid var(--border);">
                                            <td style="padding:14px 12px;">
                                                <div style="font-weight:700;font-size:0.9rem;">${app.student?.name || '—'}</div>
                                                <div style="font-size:0.72rem;color:var(--text-secondary);">${app.student?.register_number || ''}</div>
                                            </td>
                                            <td style="padding:14px 12px;font-size:0.85rem;">${app.scholarship?.scholarship_name || '—'}</td>
                                            <td style="padding:14px 12px;font-size:0.8rem;color:var(--text-secondary);">${new Date(app.application_date).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</td>
                                            <td style="padding:14px 12px;">
                                                <span class="badge" style="background:${getStatusColor(app.status)}20;color:${getStatusColor(app.status)};">${app.status}</span>
                                            </td>
                                            <td style="padding:14px 12px;">
                                                ${app.status === 'pending' ? `<button onclick="window.location.hash='#admin/applications/${app.application_id}'" style="background:var(--primary);color:white;padding:4px 10px;font-size:0.75rem;border-radius:6px;">Review</button>` : '—'}
                                            </td>
                                        </tr>`).join('')}
                                </tbody>
                            </table>
                        </div>

                        <!-- Dept Breakdown -->
                        <div class="card">
                            <h3 style="margin-bottom:16px;">Students by Department</h3>
                            ${deptRows || '<p style="color:var(--text-secondary);text-align:center;padding:20px;">No student data.</p>'}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
