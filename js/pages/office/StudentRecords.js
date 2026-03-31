// js/pages/office/StudentRecords.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getAllStudents } from '../../services/studentService.js';

export async function StudentRecords() {
    if (!['office_staff','admin'].includes(store.user.role)) { window.location.hash = '#login'; return ''; }

    const students = await getAllStudents().catch(() => []);

    setTimeout(() => {
        const searchEl = document.getElementById('student-search');
        const tbody    = document.getElementById('student-tbody');

        searchEl?.addEventListener('input', () => {
            const q = searchEl.value.toLowerCase();
            const filtered = students.filter(s =>
                s.name?.toLowerCase().includes(q) ||
                s.register_number?.toLowerCase().includes(q) ||
                s.department?.toLowerCase().includes(q) ||
                `year ${s.year_study}`.toLowerCase().includes(q)
            );
            tbody.innerHTML = renderRows(filtered);
        });
    }, 0);

    function renderRows(list) {
        if (list.length === 0)
            return `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-secondary);">No matching students.</td></tr>`;
        return list.map(s => `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:14px 12px;">
                    <div style="font-weight:700;font-size:0.9rem;">${s.name || '—'}</div>
                    <div style="font-size:0.72rem;color:var(--text-secondary);">${s.email || ''}</div>
                </td>
                <td style="padding:14px 12px;font-size:0.85rem;">${s.register_number || '—'}</td>
                <td style="padding:14px 12px;font-size:0.85rem;">${s.department || '—'}</td>
                <td style="padding:14px 12px;text-align:center;font-weight:700;color:${s.cgpa>=7.5?'var(--success)':s.cgpa>=5?'var(--warning)':'var(--danger)'};">${s.cgpa ?? '—'}</td>
                <td style="padding:14px 12px;font-size:0.85rem;">${s.category || '—'}</td>
                <td style="padding:14px 12px;font-size:0.85rem;">₹${Number(s.annual_income||0).toLocaleString()}</td>
                <td style="padding:14px 12px;text-align:center;">Year ${s.year_study || '—'}</td>
            </tr>`).join('');
    }

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;gap:16px;">
                        <div>
                            <h1 style="font-size:2rem;margin:0;">Student Records</h1>
                            <p style="color:var(--text-secondary);margin-top:4px;">${students.length} registered students</p>
                        </div>
                        <input id="student-search" type="text" placeholder="🔍 Search by name, dept, year..." style="min-width:320px;padding:10px 14px;border-radius:12px;border:1px solid var(--border);outline:none;background:white;">
                    </div>

                    <div class="card" style="padding:0;overflow:hidden;">
                        <table style="width:100%;border-collapse:collapse;">
                            <thead><tr style="background:var(--neutral-bg);">
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Student</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Reg No</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Dept</th>
                                <th style="padding:14px 12px;text-align:center;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">CGPA</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Category</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Income</th>
                                <th style="padding:14px 12px;text-align:center;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Year</th>
                            </tr></thead>
                            <tbody id="student-tbody">${renderRows(students)}</tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `;
}
