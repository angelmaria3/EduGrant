// js/pages/admin/Reports.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getAllApplications } from '../../services/applicationService.js';
import { getAllStudents } from '../../services/studentService.js';
import { supabase } from '../../supabaseClient.js';

export async function ReportsPage() {
    if (store.user.role !== 'admin') { window.location.hash = '#admin/dashboard'; return ''; }

    const [applications, students, { data: globalFees = [] }] = await Promise.all([
        getAllApplications().catch(() => []),
        getAllStudents().catch(() => []),
        supabase.from('global_fee_structure').select('*')
    ]);

    const approved = applications.filter(a => a.status === 'approved');
    
    let totalGranted = 0;
    approved.forEach(a => {
        const sch = a.scholarship;
        if (sch && (sch.type === 'fee_concession' || sch.is_percentage)) {
            // Find student for their semester
            const student = students.find(s => s.student_id === a.student_id);
            const sem = student?.current_semester || 1;
            
            // Find tuition fee for that semester
            const feeRow = globalFees.find(f => f.semester === sem);
            const tuition = parseFloat(feeRow?.tuition_fee || 3500);

            if (sch.is_percentage) {
                totalGranted += (tuition * (parseFloat(sch.amount) / 100));
            } else {
                totalGranted += parseFloat(sch.amount);
            }
        }
    });

    const deptStats = {};
    students.forEach(s => {
        if (!deptStats[s.department]) deptStats[s.department] = { students: 0, applied: 0, approved: 0 };
        deptStats[s.department].students++;
    });
    applications.forEach(a => {
        const dept = a.student?.department;
        if (dept && deptStats[dept]) {
            deptStats[dept].applied++;
            if (a.status === 'approved') deptStats[dept].approved++;
        }
    });

    const catMap = {};
    students.forEach(s => { catMap[s.category] = (catMap[s.category]||0) + 1; });

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <h1 style="font-size:2rem;margin-bottom:8px;">Reports &amp; Analytics</h1>
                    <p style="color:var(--text-secondary);margin-bottom:32px;">Summary statistics for Academic Year ${new Date().getFullYear()}</p>

                    <!-- Top KPIs -->
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:32px;">
                        ${[
                            { label:'Total Students',    value: students.length,          color:'var(--primary)' },
                            { label:'Total Applications',value: applications.length,       color:'#1A3C6E' },
                            { label:'Approved',          value: approved.length,           color:'var(--success)' },
                            { label:'Institution Fee Relief', value:`₹${Math.round(totalGranted).toLocaleString()}`, color:'#8E44AD' }
                        ].map(s=>`
                            <div class="card stat-card" style="border-top:4px solid ${s.color};">
                                <span class="text-overline">${s.label}</span>
                                <div style="font-size:1.8rem;font-weight:800;color:${s.color};margin-top:4px;">${s.value}</div>
                            </div>`).join('')}
                    </div>

                    <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px;">
                        <!-- Dept Table -->
                        <div class="card" style="padding:0;">
                            <div style="padding:20px 24px;border-bottom:1px solid var(--border);">
                                <h3 style="margin:0;">Department-wise Breakdown</h3>
                            </div>
                            <table style="width:100%;border-collapse:collapse;">
                                <thead><tr style="background:var(--neutral-bg);">
                                    <th style="padding:12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Department</th>
                                    <th style="padding:12px;text-align:center;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Students</th>
                                    <th style="padding:12px;text-align:center;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Applied</th>
                                    <th style="padding:12px;text-align:center;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Approved</th>
                                    <th style="padding:12px;text-align:center;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Rate</th>
                                </tr></thead>
                                <tbody>
                                    ${Object.entries(deptStats).sort((a,b)=>b[1].students-a[1].students).map(([dept,d])=>`
                                    <tr style="border-bottom:1px solid var(--border);">
                                        <td style="padding:12px;font-weight:600;">${dept}</td>
                                        <td style="padding:12px;text-align:center;">${d.students}</td>
                                        <td style="padding:12px;text-align:center;color:var(--warning);font-weight:700;">${d.applied}</td>
                                        <td style="padding:12px;text-align:center;color:var(--success);font-weight:700;">${d.approved}</td>
                                        <td style="padding:12px;text-align:center;">
                                            <span style="font-weight:700;color:var(--primary);">${d.applied > 0 ? Math.round(d.approved/d.applied*100) : 0}%</span>
                                        </td>
                                    </tr>`).join('') || '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text-secondary);">No data.</td></tr>'}
                                </tbody>
                            </table>
                        </div>

                        <!-- Category distribution -->
                        <div style="display:flex;flex-direction:column;gap:20px;">
                            <div class="card">
                                <h3 style="margin-bottom:16px;">Category Distribution</h3>
                                ${Object.entries(catMap).map(([cat,count])=>`
                                    <div style="margin-bottom:14px;">
                                        <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:5px;">
                                            <span style="font-weight:600;">${cat}</span>
                                            <span style="color:var(--primary);font-weight:700;">${count}</span>
                                        </div>
                                        <div style="height:8px;background:var(--border);border-radius:4px;">
                                            <div style="height:8px;border-radius:4px;background:var(--primary);width:${students.length?Math.round(count/students.length*100):0}%;transition:width 1s;"></div>
                                        </div>
                                    </div>`).join('') || '<p style="color:var(--text-secondary);text-align:center;padding:16px;">No student data.</p>'}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
