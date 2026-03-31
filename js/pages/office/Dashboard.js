// js/pages/office/Dashboard.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getPendingApplications } from '../../services/applicationService.js';
import { getAllPendingDocuments } from '../../services/documentService.js';
import { getAllStudents } from '../../services/studentService.js';

export async function StaffDashboard() {
    if (!['office_staff','admin'].includes(store.user.role)) { window.location.hash = '#login'; return ''; }

    const [pendingApps, pendingDocs, students] = await Promise.all([
        getPendingApplications().catch(() => []),
        getAllPendingDocuments().catch(() => []),
        getAllStudents().catch(() => [])
    ]);

    const stats = [
        { label: 'Total Students',    value: students.length,    color: 'var(--primary)',  icon: '🎓' },
        { label: 'Pending Apps',      value: pendingApps.length, color: 'var(--warning)',  icon: '📋' },
        { label: 'Docs to Verify',    value: pendingDocs.length, color: 'var(--danger)',   icon: '📄' },
        { label: 'My Verifications',  value: '—',                color: 'var(--success)',  icon: '✅' }
    ];

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="margin-bottom:var(--space-lg);">
                        <h1 style="font-size:2.2rem;letter-spacing:-1px;margin-bottom:6px;">Staff Dashboard</h1>
                        <p style="color:var(--text-secondary);">Hello, ${store.user.name} — here's your workload overview</p>
                    </div>

                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-bottom:32px;">
                        ${stats.map(s=>`
                            <div class="card stat-card" style="border-top:4px solid ${s.color};position:relative;overflow:hidden;">
                                <div style="position:absolute;right:-10px;top:-10px;font-size:4rem;opacity:0.05;">${s.icon}</div>
                                <span class="text-overline">${s.label}</span>
                                <div class="stat-value" style="color:${s.color};margin-top:4px;">${s.value}</div>
                            </div>`).join('')}
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
                        <!-- Pending Applications -->
                        <div class="card" style="padding:0;">
                            <div style="padding:20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                                <h3 style="margin:0;">Pending Applications</h3>
                                <button onclick="window.location.hash='#staff/applications'" style="background:none;color:var(--primary);font-weight:700;font-size:0.85rem;">View All →</button>
                            </div>
                            <div style="padding:12px;">
                                ${pendingApps.length === 0
                                    ? `<p style="text-align:center;padding:24px;color:var(--text-secondary);">All cleared! 🎉</p>`
                                    : pendingApps.slice(0,5).map(app=>`
                                        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:8px;margin-bottom:6px;background:var(--neutral-bg);">
                                            <div>
                                                <div style="font-weight:700;font-size:0.88rem;">${app.student?.name || '—'}</div>
                                                <div style="font-size:0.72rem;color:var(--text-secondary);">${app.scholarship?.scholarship_name || ''}</div>
                                            </div>
                                            <span class="badge" style="background:var(--warning)20;color:var(--warning);">pending</span>
                                        </div>`).join('')}
                            </div>
                        </div>

                        <!-- Pending Docs -->
                        <div class="card" style="padding:0;">
                            <div style="padding:20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                                <h3 style="margin:0;">Documents to Verify</h3>
                                <button onclick="window.location.hash='#staff/queue'" style="background:none;color:var(--primary);font-weight:700;font-size:0.85rem;">View Queue →</button>
                            </div>
                            <div style="padding:12px;">
                                ${pendingDocs.length === 0
                                    ? `<p style="text-align:center;padding:24px;color:var(--text-secondary);">No pending documents! 🎉</p>`
                                    : pendingDocs.slice(0,5).map(doc=>`
                                        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:8px;margin-bottom:6px;background:var(--neutral-bg);">
                                            <div>
                                                <div style="font-weight:700;font-size:0.88rem;">${doc.document_type}</div>
                                                <div style="font-size:0.72rem;color:var(--text-secondary);">${doc.application?.student?.name || ''}</div>
                                            </div>
                                            <button onclick="window.location.hash='#staff/queue'" style="background:var(--primary);color:white;padding:4px 10px;font-size:0.72rem;border-radius:6px;">Verify</button>
                                        </div>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
