// js/pages/office/CGPAUpdates.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getAllStudents, updateStudentCGPA } from '../../services/studentService.js';
import { showToast } from '../../utils.js';

export async function CGPAUpdates() {
    if (!['office_staff','admin'].includes(store.user.role)) { window.location.hash = '#login'; return ''; }

    const students = await getAllStudents().catch(() => []);

    setTimeout(() => {
        const searchEl = document.getElementById('cgpa-search');
        const tbody    = document.getElementById('cgpa-tbody');

        searchEl?.addEventListener('input', () => {
            const q = searchEl.value.toLowerCase();
            const filtered = students.filter(s =>
                s.name?.toLowerCase().includes(q) ||
                s.register_number?.toLowerCase().includes(q)
            );
            tbody.innerHTML = renderRows(filtered);
            attachSaveHandlers();
        });

        attachSaveHandlers();
    }, 0);

    function attachSaveHandlers() {
        document.querySelectorAll('.save-cgpa').forEach(btn => {
            btn.addEventListener('click', async () => {
                const studentId = btn.dataset.id;
                const input     = document.getElementById(`cgpa-input-${studentId}`);
                const newCgpa   = parseFloat(input.value);
                if (isNaN(newCgpa) || newCgpa < 0 || newCgpa > 10) {
                    showToast('CGPA must be between 0 and 10.', 'error');
                    return;
                }
                btn.disabled = true; btn.textContent = 'Saving…';
                try {
                    await updateStudentCGPA(studentId, newCgpa);
                    const display = document.getElementById(`cgpa-display-${studentId}`);
                    if (display) display.textContent = newCgpa.toFixed(2);
                    showToast('CGPA updated successfully!', 'success');
                } catch (err) {
                    showToast(err.message || 'Update failed.', 'error');
                } finally { btn.disabled = false; btn.textContent = 'Save'; }
            });
        });
    }

    function renderRows(list) {
        if (list.length === 0)
            return `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-secondary);">No matching students.</td></tr>`;
        return list.map(s => `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:14px 12px;">
                    <div style="font-weight:700;font-size:0.9rem;">${s.name || '—'}</div>
                    <div style="font-size:0.72rem;color:var(--text-secondary);">${s.register_number}</div>
                </td>
                <td style="padding:14px 12px;font-size:0.85rem;">${s.department || '—'}</td>
                <td style="padding:14px 12px;text-align:center;">Year ${s.year_study || '—'}</td>
                <td style="padding:14px 12px;text-align:center;font-weight:700;color:${s.cgpa>=7.5?'var(--success)':s.cgpa>=5?'var(--warning)':'var(--danger)'};">
                    <span id="cgpa-display-${s.student_id}">${s.cgpa ?? '—'}</span>
                </td>
                <td style="padding:14px 12px;">
                    <div style="display:flex;gap:8px;align-items:center;">
                        <input id="cgpa-input-${s.student_id}" type="number" step="0.01" min="0" max="10" value="${s.cgpa ?? ''}" style="width:90px;padding:6px 10px;text-align:center;">
                        <button class="save-cgpa" data-id="${s.student_id}" style="background:var(--primary);color:white;padding:7px 14px;font-size:0.8rem;border-radius:6px;font-weight:700;">Save</button>
                    </div>
                </td>
            </tr>`).join('');
    }

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <h1 style="font-size:2rem;margin:0;">CGPA Updates</h1>
                            <p style="color:var(--text-secondary);margin-top:4px;">Update student academic records after semester results</p>
                        </div>
                        <input id="cgpa-search" type="text" placeholder="🔍 Search student…" style="min-width:240px;padding:10px 14px;">
                    </div>

                    <div class="card" style="padding:0;overflow:hidden;">
                        <table style="width:100%;border-collapse:collapse;">
                            <thead><tr style="background:var(--neutral-bg);">
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Student</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Dept</th>
                                <th style="padding:14px 12px;text-align:center;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Year</th>
                                <th style="padding:14px 12px;text-align:center;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Current CGPA</th>
                                <th style="padding:14px 12px;text-align:left;font-size:0.78rem;color:var(--text-secondary);text-transform:uppercase;">Update</th>
                            </tr></thead>
                            <tbody id="cgpa-tbody">${renderRows(students)}</tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `;
}
