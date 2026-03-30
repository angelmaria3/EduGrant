// js/pages/admin/Staff.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function StaffManagement() {
    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
                        
                        <!-- Staff List -->
                        <div style="display: flex; flex-direction: column; gap: 24px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                ${store.staff.map(s => `
                                    <div class="card" style="display: flex; align-items: center; gap: 16px;">
                                        <div style="width: 50px; height: 50px; background: var(--primary-staff)10; color: var(--primary-staff); border-radius: 12px; display: grid; place-items: center; font-size: 1.25rem; font-weight: 800;">
                                            ${s.name.charAt(0)}
                                        </div>
                                        <div style="flex: 1;">
                                            <div style="font-weight: 700; font-size: 1rem;">${s.name}</div>
                                            <div style="font-size: 0.75rem; color: var(--text-secondary);">${s.role}</div>
                                        </div>
                                        <button style="background: none; color: var(--text-secondary); font-size: 1.2rem;">⋮</button>
                                    </div>
                                `).join('')}
                            </div>

                            <div class="card">
                                <h3 style="margin-bottom: 20px; font-family: 'Outfit';">Activity Log</h3>
                                <div style="display: flex; flex-direction: column; gap: 12px;">
                                    ${[
                                        { user: 'Rekha S.', action: 'Verified 3 income certificates', time: '10 mins ago' },
                                        { user: 'Vinod M.', action: 'Assigned 5 new applications', time: '1 hour ago' },
                                        { user: 'Rekha S.', action: 'Logged in to staff portal', time: '2 hours ago' }
                                    ].map(log => `
                                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #fafafa; border-radius: 8px; font-size: 0.85rem;">
                                            <div style="display: flex; gap: 8px;">
                                                <span style="font-weight: 700;">${log.user}</span>
                                                <span style="color: var(--text-secondary);">${log.action}</span>
                                            </div>
                                            <span style="font-size: 0.75rem; color: #ccc;">${log.time}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Create Form -->
                        <div class="card" style="align-self: flex-start;">
                            <h3 style="margin-bottom: 24px; font-family: 'Outfit';">Create Staff Account</h3>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                <div class="form-group">
                                    <label>Full Name</label>
                                    <input type="text" placeholder="e.g. Rahul Sharma">
                                </div>
                                <div class="form-group">
                                    <label>Email ID</label>
                                    <input type="email" placeholder="rahul@institution.edu">
                                </div>
                                <div class="form-group">
                                    <label>Department Access</label>
                                    <select>
                                        <option>All Departments</option>
                                        <option>Office Main</option>
                                        <option>Finance Section</option>
                                    </select>
                                </div>
                                <button style="background: var(--primary-admin); color: white; padding: 14px; font-weight: 700; width: 100%; margin-top: 12px;">Generate Invite Link</button>
                                <p style="font-size: 0.75rem; color: var(--text-secondary); text-align: center;">Invitation will be sent via email with login credentials.</p>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </main>
        </div>
    `;
}
