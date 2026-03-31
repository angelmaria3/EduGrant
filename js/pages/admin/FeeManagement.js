// js/pages/admin/FeeManagement.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { supabase } from '../../supabaseClient.js';
import { showToast } from '../../utils.js';

export async function FeeManagement() {
    if (store.user.role !== 'admin') { window.location.hash = '#login'; return ''; }

    const { data: structures, error } = await supabase
        .from('global_fee_structure')
        .select('*')
        .order('semester');

    if (error) { showToast('Error loading fees', 'error'); }

    setTimeout(() => {
        document.querySelectorAll('.fee-input').forEach(input => {
            input.addEventListener('change', async (e) => {
                const id = e.target.dataset.id;
                const field = e.target.dataset.field;
                const val = parseFloat(e.target.value) || 0;

                try {
                    await supabase
                        .from('global_fee_structure')
                        .update({ [field]: val })
                        .eq('id', id);
                    
                    // Recalculate row total in UI
                    const row = e.target.closest('tr');
                    const inputs = row.querySelectorAll('.fee-input');
                    let total = 0;
                    inputs.forEach(i => total += parseFloat(i.value) || 0);
                    row.querySelector('.row-total').textContent = `₹${total.toLocaleString()}`;
                    
                    showToast('Updated!', 'success');
                } catch (err) {
                    showToast('Update failed', 'error');
                }
            });
        });
    }, 0);

    const rows = structures?.map(s => {
        const total = parseFloat(s.tuition_fee) + parseFloat(s.exam_fee) + parseFloat(s.university_fee) + 
                      parseFloat(s.bus_fee) + parseFloat(s.arts_sports_fee) + parseFloat(s.misc_fee);
        
        return `
            <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 16px; font-weight: 700; color: var(--primary);">Sem ${s.semester}</td>
                <td style="padding: 8px;"><input type="number" class="fee-input" data-id="${s.id}" data-field="tuition_fee" value="${s.tuition_fee}" style="width: 80px; padding: 6px; border: 1px solid var(--border); border-radius: 4px;"></td>
                <td style="padding: 8px;"><input type="number" class="fee-input" data-id="${s.id}" data-field="exam_fee" value="${s.exam_fee}" style="width: 80px; padding: 6px; border: 1px solid var(--border); border-radius: 4px;"></td>
                <td style="padding: 8px;"><input type="number" class="fee-input" data-id="${s.id}" data-field="university_fee" value="${s.university_fee}" style="width: 80px; padding: 6px; border: 1px solid var(--border); border-radius: 4px;"></td>
                <td style="padding: 8px;"><input type="number" class="fee-input" data-id="${s.id}" data-field="bus_fee" value="${s.bus_fee}" style="width: 80px; padding: 6px; border: 1px solid var(--border); border-radius: 4px;"></td>
                <td style="padding: 8px;"><input type="number" class="fee-input" data-id="${s.id}" data-field="arts_sports_fee" value="${s.arts_sports_fee}" style="width: 80px; padding: 6px; border: 1px solid var(--border); border-radius: 4px;"></td>
                <td style="padding: 8px;"><input type="number" class="fee-input" data-id="${s.id}" data-field="misc_fee" value="${s.misc_fee}" style="width: 80px; padding: 6px; border: 1px solid var(--border); border-radius: 4px;"></td>
                <td style="padding: 16px; font-weight: 800; color: var(--text-primary);" class="row-total">₹${total.toLocaleString()}</td>
            </tr>
        `;
    }).join('');

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="margin-bottom: 32px;">
                        <h1 style="font-size: 2rem; margin: 0;">Fee Management</h1>
                        <p style="color: var(--text-secondary); margin-top: 4px;">Configure the standard fee structure for all 8 semesters (AY 2026)</p>
                    </div>

                    <div class="card" style="padding: 0; overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; min-width: 900px;">
                            <thead>
                                <tr style="background: var(--neutral-bg); border-bottom: 2px solid var(--border);">
                                    <th style="padding: 16px; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">Semester</th>
                                    <th style="padding: 16px; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">Tuition</th>
                                    <th style="padding: 16px; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">Exam</th>
                                    <th style="padding: 16px; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">University</th>
                                    <th style="padding: 16px; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">Bus</th>
                                    <th style="padding: 16px; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">Sports</th>
                                    <th style="padding: 16px; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">Misc</th>
                                    <th style="padding: 16px; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows || '<tr><td colspan="8" style="padding: 40px; text-align: center;">No fee structures found. Run migration.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                    
                </div>
            </main>
        </div>
    `;
}
