// js/pages/admin/Staff.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';
import { supabase } from '../../supabaseClient.js';
import { showToast } from '../../utils.js';
import { navigate } from '../../router.js';

export async function StaffManagement() {
    const { data: staffList = [] } = await supabase.from('admin').select('*');

    setTimeout(() => {
        document.getElementById('create-staff-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const btn = document.getElementById('create-staff-btn');
            btn.disabled = true;
            btn.textContent = 'Adding...';

            try {
                const { error } = await supabase.from('admin').insert({
                    name: fd.get('name').trim(),
                    email: fd.get('email').trim().toLowerCase(),
                    department: fd.get('department'),
                    role: fd.get('role')
                });
                if (error) throw error;
                showToast('Staff profile successfully added!', 'success');
                navigate(); // Refresh to render the new record
            } catch (err) {
                showToast(err.message, 'error');
                btn.disabled = false;
                btn.textContent = '+ Add Staff Record';
            }
        });
    }, 0);

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container" style="max-width: 1200px; margin: 0 auto;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 64px;">
                        
                        <!-- Staff List -->
                        <div style="display: flex; flex-direction: column; gap: 24px; flex: 1;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                ${staffList.map(s => `
                                    <div class="card" style="display: flex; align-items: center; gap: 16px;">
                                        <div style="width: 50px; height: 50px; background: var(--primary-staff)10; color: var(--primary-staff); border-radius: 12px; display: grid; place-items: center; font-size: 1.25rem; font-weight: 800;">
                                            ${(s.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div style="flex: 1;">
                                            <div style="font-weight: 700; font-size: 1rem;">${s.name}</div>
                                            <div style="font-size: 0.75rem; color: var(--text-secondary);">${s.role === 'admin' ? 'Admin' : 'Office Staff'} • ${s.department || 'All'}</div>
                                            <div style="font-size: 0.7rem; color: #888;">${s.email}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Create Form -->
                        <div class="card" style="align-self: flex-start; width: 450px;">
                            <h3 style="margin-bottom: 24px; font-family: 'Outfit';">Create Staff Account</h3>
                            <form id="create-staff-form" style="display: flex; flex-direction: column; gap: 16px;">
                                <div class="form-group">
                                    <label>Full Name *</label>
                                    <input type="text" name="name" placeholder="e.g. Rahul Sharma" required>
                                </div>
                                <div class="form-group">
                                    <label>Email ID *</label>
                                    <input type="email" name="email" placeholder="rahul@institution.edu" required>
                                </div>
                                <div class="form-group">
                                    <label>Department Access</label>
                                    <select name="department">
                                        <option value="All Departments">All Departments</option>
                                        <option value="Office Main">Office Main</option>
                                        <option value="Finance Section">Finance Section</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Role</label>
                                    <select name="role">
                                        <option value="office_staff">Office Staff</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                                <button type="submit" id="create-staff-btn" style="background: var(--primary-admin); color: white; padding: 14px; font-weight: 700; width: 100%; margin-top: 12px; border-radius: 8px;">+ Add Staff Record</button>
                                <p style="font-size: 0.75rem; color: var(--text-secondary); text-align: center;">Record added directly to admin table.</p>
                            </form>
                        </div>

                    </div>
                    
                </div>
            </main>
        </div>
    `;
}
