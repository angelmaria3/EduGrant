// js/pages/admin/Dashboard.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function AdminDashboard() {
    const stats = [
        { label: 'Total Applications', value: 142, subtext: 'This academic year', color: 'var(--primary-admin)' },
        { label: 'Approved', value: 89, subtext: '62% approval rate', color: 'var(--success)' },
        { label: 'Active Schemes', value: 7, subtext: 'Scholarships + concessions', color: 'var(--warning)' },
        { label: 'Staff Accounts', value: 4, subtext: 'Office staff active', color: 'var(--info)' }
    ];

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    
                    <div style="margin-bottom: 32px;">
                        <h1 style="font-size: 2.2rem; font-family: 'Outfit'; margin: 0; letter-spacing: -1px;">Admin Dashboard</h1>
                        <p style="color: var(--text-secondary);">System-wide overview of scholarships, applications, and staff activity.</p>
                    </div>

                    <!-- System Stats -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 32px;">
                        ${stats.map(s => `
                            <div class="card stat-card" style="border-top: 4px solid ${s.color};">
                                <span class="text-overline">${s.label}</span>
                                <div class="stat-value" style="color: ${s.color}; margin: 4px 0;">${s.value}</div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary);">${s.subtext}</div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
                        
                        <!-- Left Column -->
                        <div style="display: flex; flex-direction: column; gap: 32px;">
                            
                            <!-- Application Status Progress Bars -->
                            <div class="card">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                                    <h3 style="margin: 0; font-family: 'Outfit';">Application Status Overview</h3>
                                    <button style="background: none; color: var(--primary-admin); font-size: 0.85rem; font-weight: 700;">Full report →</button>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 20px;">
                                    <div>
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
                                            <span style="font-weight: 600;">Approved</span>
                                            <span style="color: var(--success); font-weight: 700;">89 / 142</span>
                                        </div>
                                        <div class="progress-bar-container">
                                            <div class="progress-bar-fill" style="width: 62.6%; background: var(--success);"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
                                            <span style="font-weight: 600;">Pending / Under Review</span>
                                            <span style="color: var(--warning); font-weight: 700;">34 / 142</span>
                                        </div>
                                        <div class="progress-bar-container">
                                            <div class="progress-bar-fill" style="width: 23.9%; background: var(--warning);"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
                                            <span style="font-weight: 600;">Rejected</span>
                                            <span style="color: var(--danger); font-weight: 700;">19 / 142</span>
                                        </div>
                                        <div class="progress-bar-container">
                                            <div class="progress-bar-fill" style="width: 13.3%; background: var(--danger);"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Active Scholarship Schemes Table -->
                            <div class="card" style="padding: 0;">
                                <div style="padding: 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                                    <h3 style="margin: 0; font-family: 'Outfit';">Active Scholarship Schemes</h3>
                                    <button style="background: none; color: var(--primary-admin); font-size: 0.85rem; font-weight: 700;" onclick="window.location.hash='#admin/scholarships'">Manage →</button>
                                </div>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <thead>
                                        <tr style="text-align: left; background: #fafafa; border-bottom: 1px solid var(--border);">
                                            <th style="padding: 16px; font-size: 0.7rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Scheme</th>
                                            <th style="padding: 16px; font-size: 0.7rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Type</th>
                                            <th style="padding: 16px; font-size: 0.7rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Applications</th>
                                            <th style="padding: 16px; font-size: 0.7rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${store.scholarships.map(s => `
                                            <tr style="border-bottom: 1px solid var(--border);">
                                                <td style="padding: 16px; font-weight: 600;">${s.name}</td>
                                                <td style="padding: 16px;"><span class="badge" style="background: rgba(91, 13, 27, 0.05); color: var(--primary-student);">${s.type.split('-')[0]}</span></td>
                                                <td style="padding: 16px; font-size: 0.9rem;">${Math.floor(Math.random() * 50) + 10}</td>
                                                <td style="padding: 16px;"><span class="badge" style="background: rgba(39, 174, 96, 0.1); color: var(--success);">Active</span></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <!-- Right Column -->
                        <div style="display: flex; flex-direction: column; gap: 32px;">
                            
                            <!-- Staff Activity Feed -->
                            <div class="card">
                                <h3 style="margin-bottom: 20px; font-family: 'Outfit';">Staff Activity</h3>
                                <div style="display: flex; flex-direction: column; gap: 16px;">
                                    ${store.staff.map(s => `
                                        <div style="display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f5f5f5; padding-bottom: 12px;">
                                            <div style="width: 36px; height: 36px; border-radius: 10px; background: #f0f0f0; display: grid; place-items: center; font-size: 0.8rem; font-weight: 700;">${s.name.charAt(0)}</div>
                                            <div style="flex: 1;">
                                                <div style="font-weight: 700; font-size: 0.85rem;">${s.name}</div>
                                                <div style="font-size: 0.7rem; color: var(--text-secondary);">${s.verifications} verifications today</div>
                                            </div>
                                            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--success);"></div>
                                        </div>
                                    `).join('')}
                                    <div style="display: flex; align-items: center; gap: 12px; opacity: 0.5;">
                                        <div style="width: 36px; height: 36px; border-radius: 10px; background: #f0f0f0; display: grid; place-items: center; font-size: 0.8rem; font-weight: 700;">A</div>
                                        <div style="flex: 1;">
                                            <div style="font-weight: 700; font-size: 0.85rem;">Aisha Rahman</div>
                                            <div style="font-size: 0.7rem; color: var(--text-secondary);">Last active: yesterday</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Quick Actions -->
                            <div class="card" style="background: #fcfcfc; border: 1px dashed var(--border);">
                                <h3 style="margin-bottom: 16px; font-family: 'Outfit'; font-size: 1.1rem;">Quick Actions</h3>
                                <div style="display: flex; flex-direction: column; gap: 10px;">
                                    <button style="width: 100%; padding: 12px; background: white; border: 1px solid var(--border); text-align: left; font-size: 0.85rem; display: flex; align-items: center; gap: 10px;">
                                        <span>➕</span> Create Staff Account
                                    </button>
                                    <button style="width: 100%; padding: 12px; background: white; border: 1px solid var(--border); text-align: left; font-size: 0.85rem; display: flex; align-items: center; gap: 10px;">
                                        <span>⚙️</span> Update Eligibility Rules
                                    </button>
                                    <button style="width: 100%; padding: 12px; background: white; border: 1px solid var(--border); text-align: left; font-size: 0.85rem; display: flex; align-items: center; gap: 10px;">
                                        <span>🔔</span> Broadcast Announcement
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </main>
        </div>
    `;
}
