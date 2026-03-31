// js/pages/student/Dashboard.js
import { store, getStatusColor } from '../../store.js';
import { supabase } from '../../supabaseClient.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getMyApplications }  from '../../services/applicationService.js';
import { getStudentFee }      from '../../services/feeService.js';

export async function StudentDashboard() {
    const student = store.user.data;
    if (!student) { window.location.hash = '#login'; return ''; }

    // Fetch real data
    const [applications, fee] = await Promise.all([
        getMyApplications(student.student_id).catch(() => []),
        getStudentFee(student.student_id).catch(() => null)
    ]);

    const feeTotal   = fee?.total_fee   || 0;
    const feePaid    = fee?.paid_amount  || 0;
    const feePending = fee?.pending_amount ?? (feeTotal - feePaid);
    const feePercent = feeTotal > 0 ? Math.min((feePaid / feeTotal) * 100, 100) : 0;

    const approved = applications.filter(a => a.status === 'approved').length;
    const pending  = applications.filter(a => a.status === 'pending').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;

    const stats = [
        { label: 'Total Applied',  value: applications.length, color: 'var(--primary)',  icon: '📋' },
        { label: 'Approved',       value: approved,            color: 'var(--success)',  icon: '✅' },
        { label: 'Pending Review', value: pending,             color: 'var(--warning)',  icon: '⏳' },
        { label: 'Fees Due',       value: `₹${feePending.toLocaleString()}`, color: 'var(--danger)', icon: '💳' }
    ];

    setTimeout(() => {
        // Realtime subscription for application status changes
        const channel = supabase
            .channel('student-app-updates')
            .on('postgres_changes', {
                event: 'UPDATE', schema: 'public', table: 'application',
                filter: `student_id=eq.${student.student_id}`
            }, payload => {
                const badge = document.getElementById(`status-${payload.new.application_id}`);
                if (badge) {
                    badge.textContent = payload.new.status;
                    badge.style.color      = getStatusColor(payload.new.status);
                    badge.style.background = getStatusColor(payload.new.status) + '20';
                }
            })
            .subscribe();

        window.addEventListener('hashchange', () => supabase.removeChannel(channel), { once: true });

        document.getElementById('btn-fix-docs')?.addEventListener('click', () => {
            window.location.hash = '#student/documents';
        });
    }, 0);

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">



                    <div style="margin-bottom:var(--space-lg);">
                        <h1 style="font-size:2.2rem;letter-spacing:-1px;margin-bottom:8px;">Welcome back, ${student.name?.split(' ')[0] || 'Student'}!</h1>
                        <p style="color:var(--text-secondary);font-weight:500;">Your scholarship &amp; fee status for Academic Year ${new Date().getFullYear()}-${(new Date().getFullYear()+1).toString().slice(2)}</p>
                    </div>

                    <!-- Stat Cards -->
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;margin-bottom:32px;">
                        ${stats.map(s => `
                            <div class="card stat-card" style="border-top:4px solid ${s.color};position:relative;overflow:hidden;">
                                <div style="position:absolute;right:-10px;top:-10px;font-size:4rem;opacity:0.05;">${s.icon}</div>
                                <span class="text-overline">${s.label}</span>
                                <div class="stat-value" style="color:${s.color};margin-top:4px;">${s.value}</div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="display:grid;grid-template-columns:2fr 1fr;gap:32px;">
                        <!-- Recent Applications -->
                        <div style="display:flex;flex-direction:column;gap:24px;">
                            <div class="card" style="padding:0;">
                                <div style="padding:24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                                    <h3 style="margin:0;font-family:'Outfit';">Recent Applications</h3>
                                    <button onclick="window.location.hash='#student/applications'" style="background:none;color:var(--primary);font-size:0.85rem;font-weight:700;">View All →</button>
                                </div>
                                <div style="padding:12px;">
                                    ${applications.length === 0 ? `
                                        <div style="text-align:center;padding:40px;color:var(--text-secondary);">
                                            <div style="font-size:2rem;margin-bottom:8px;">📭</div>
                                            No applications yet. <a href="#student/scholarships" style="color:var(--primary);font-weight:700;">Browse scholarships →</a>
                                        </div>
                                    ` : applications.slice(0, 5).map(app => `
                                        <div style="display:flex;align-items:center;gap:16px;padding:14px 12px;border-radius:10px;transition:background 0.2s;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='transparent'">
                                            <div style="width:48px;height:48px;background:rgba(91,13,27,0.05);color:var(--primary);border-radius:12px;display:grid;place-items:center;font-size:1.2rem;flex-shrink:0;">🎓</div>
                                            <div style="flex:1;min-width:0;">
                                                <div style="font-weight:700;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${app.scholarship?.scholarship_name || 'Scholarship'}</div>
                                                <div style="font-size:0.75rem;color:var(--text-secondary);">${new Date(app.application_date).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</div>
                                            </div>
                                            <span id="status-${app.application_id}" class="badge" style="background:${getStatusColor(app.status)}20;color:${getStatusColor(app.status)};flex-shrink:0;">
                                                ${app.status}
                                            </span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Side Cards -->
                        <div style="display:flex;flex-direction:column;gap:24px;">
                            <!-- Profile -->
                            <div class="card" style="background:var(--primary);color:white;text-align:center;">
                                <div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.2);margin:0 auto 16px;display:grid;place-items:center;font-size:2rem;font-weight:700;">
                                    ${student.name?.charAt(0) || 'S'}
                                </div>
                                <h3 style="color:white;margin-bottom:4px;">${student.name || 'Student'}</h3>
                                <p style="color:rgba(255,255,255,0.7);font-size:0.8rem;margin-bottom:4px;">${student.register_number || ''}</p>
                                <p style="color:rgba(255,255,255,0.6);font-size:0.85rem;margin-bottom:20px;">${student.department || ''} • Year ${student.year_study || 1}</p>
                                <button onclick="window.location.hash='#student/profile'" style="width:100%;background:white;color:var(--primary);padding:12px;font-family:'Outfit';font-weight:700;">Edit Profile</button>
                            </div>

                            <!-- Fee Progress -->
                            <div class="card">
                                <h3 style="margin-bottom:16px;font-size:1.1rem;">Fee Progress</h3>
                                ${feeTotal === 0 ? `
                                    <div style="text-align:center;padding:20px;color:var(--text-secondary);font-size:0.9rem;">No fee record for ${new Date().getFullYear()}.</div>
                                ` : `
                                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.85rem;">
                                        <span style="color:var(--text-secondary);font-weight:500;">Amount Paid</span>
                                        <span style="font-weight:700;">₹${feePaid.toLocaleString()}</span>
                                    </div>
                                    <div class="progress-bar-container">
                                        <div class="progress-bar-fill" style="width:${feePercent}%;background:var(--success);"></div>
                                    </div>
                                    <div style="display:flex;justify-content:space-between;margin-top:12px;font-size:0.85rem;">
                                        <span style="color:var(--text-secondary);">Total: ₹${feeTotal.toLocaleString()}</span>
                                        <a href="#student/fee-details" style="color:var(--primary);font-weight:700;">Details →</a>
                                    </div>
                                `}
                            </div>

                            <!-- Quick Actions -->
                            <div class="card">
                                <h3 style="margin-bottom:16px;font-size:1rem;">Quick Actions</h3>
                                <div style="display:flex;flex-direction:column;gap:8px;">
                                    <button onclick="window.location.hash='#student/scholarships'" style="background:var(--primary);color:white;padding:10px;font-weight:600;font-size:0.85rem;">🔍 Browse Scholarships</button>
                                    <button onclick="window.location.hash='#student/documents'" style="background:var(--neutral-bg);border:1px solid var(--border);padding:10px;font-weight:600;font-size:0.85rem;">📄 Upload Documents</button>
                                    <button onclick="window.location.hash='#student/applications'" style="background:var(--neutral-bg);border:1px solid var(--border);padding:10px;font-weight:600;font-size:0.85rem;">📊 Track Status</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
