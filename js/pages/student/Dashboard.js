// js/pages/student/Dashboard.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function StudentDashboard() {
    const student = store.user.data;
    const stats = [
        { label: 'Total Applied', value: store.applications.length, color: 'var(--primary)', icon: '📋' },
        { label: 'Approved', value: store.applications.filter(a => a.status === 'Approved').length, color: 'var(--success)', icon: '✅' },
        { label: 'Pending', value: store.applications.filter(a => a.status === 'Pending').length, color: 'var(--warning)', icon: '⏳' },
        { label: 'Fees Due', value: `₹${store.fees.pending.toLocaleString()}`, color: 'var(--danger)', icon: '💳' }
    ];

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    
                    <!-- Notice Strip -->
                    <div style="background: rgba(243, 156, 18, 0.1); border: 1px solid rgba(243, 156, 18, 0.2); padding: 12px 20px; border-radius: 12px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; font-size: 0.9rem;">
                        <span style="font-size: 1.2rem;">⚡</span>
                        <div style="flex: 1; font-weight: 500; color: #856404;">
                            Important: Please upload your Sem 5 marksheets before 15th April to avoid scholarship rejection.
                        </div>
                        <button style="background: var(--warning); color: white; padding: 6px 12px; font-size: 0.8rem;">Fix Now</button>
                    </div>

                    <div style="margin-bottom: var(--space-lg);">
                        <h1 style="font-size: 2.2rem; letter-spacing: -1px; margin-bottom: 8px;">Welcome back, ${student.name.split(' ')[0]}!</h1>
                        <p style="color: var(--text-secondary); font-weight: 500;">Your scholarship and fee status for Academic Year 2024-25</p>
                    </div>

                    <!-- Enhanced Stat Cards -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px;">
                        ${stats.map(s => `
                            <div class="card stat-card" style="border-top: 4px solid ${s.color}; position: relative; overflow: hidden;">
                                <div style="position: absolute; right: -10px; top: -10px; font-size: 4rem; opacity: 0.05;">${s.icon}</div>
                                <span class="text-overline">${s.label}</span>
                                <div class="stat-value" style="color: ${s.color}; margin-top: 4px;">${s.value}</div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 8px; display: flex; align-items: center; gap: 4px;">
                                    <span style="color: var(--success); font-weight: 700;">↑ 12%</span> vs last month
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
                        <!-- Recent Applications -->
                        <div style="display: flex; flex-direction: column; gap: 24px;">
                            <div class="card" style="padding: 0;">
                                <div style="padding: 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                                    <h3 style="margin: 0; font-family: 'Outfit';">Recent Applications</h3>
                                    <button style="background: none; color: var(--primary); font-size: 0.85rem; font-weight: 700;">View All →</button>
                                </div>
                                <div style="padding: 12px;">
                                    ${store.applications.length === 0 ? `
                                        <div style="text-align: center; padding: 40px; color: var(--text-secondary);">No applications yet.</div>
                                    ` : `
                                        <table style="width: 100%; border-collapse: collapse;">
                                            <tbody>
                                                ${store.applications.map(app => `
                                                    <tr>
                                                        <td style="padding: 16px; display: flex; align-items: center; gap: 16px;">
                                                            <div style="width: 48px; height: 48px; background: rgba(91, 13, 27, 0.05); color: var(--primary); border-radius: 12px; display: grid; place-items: center; font-size: 1.2rem;">🎓</div>
                                                            <div>
                                                                <div style="font-weight: 700; color: var(--text-primary);">${app.scholarshipName}</div>
                                                                <div style="font-size: 0.75rem; color: var(--text-secondary);">${app.date}</div>
                                                            </div>
                                                        </td>
                                                        <td style="padding: 16px; text-align: right;">
                                                            <span class="badge" style="background: ${getStatusColor(app.status)}15; color: ${getStatusColor(app.status)};">
                                                                ${app.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    `}
                                </div>
                            </div>

                            <!-- Document Status -->
                            <div class="card">
                                <h3 style="margin-bottom: 20px;">Required Documents</h3>
                                <div style="display: flex; flex-direction: column; gap: 12px;">
                                    ${store.documents.map(doc => `
                                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #fcfcfc; border: 1px solid var(--border); border-radius: 12px;">
                                            <div style="display: flex; align-items: center; gap: 12px;">
                                                <span style="font-size: 1.2rem;">📄</span>
                                                <span style="font-weight: 600; font-size: 0.9rem;">${doc.name}</span>
                                            </div>
                                            <span style="font-size: 0.8rem; font-weight: 700; color: ${getStatusColor(doc.status)};">${doc.status}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Side Cards -->
                        <div style="display: flex; flex-direction: column; gap: 24px;">
                            <!-- Profile Summary -->
                            <div class="card" style="background: var(--primary); color: white; text-align: center;">
                                <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.2); margin: 0 auto 16px; display: grid; place-items: center; font-size: 2rem; font-weight: 700;">
                                    ${student.name.charAt(0)}
                                </div>
                                <h3 style="color: white; margin-bottom: 4px;">${student.name}</h3>
                                <p style="color: rgba(255,255,255,0.6); font-size: 0.85rem; margin-bottom: 20px;">${student.department} • Year ${student.yearStudy}</p>
                                <button style="width: 100%; background: white; color: var(--primary); padding: 12px; font-family: 'Outfit';" onclick="window.location.hash = '#student/profile'">Edit Profile</button>
                            </div>

                            <!-- Fee Progress Bar -->
                            <div class="card">
                                <h3 style="margin-bottom: 16px; font-size: 1.1rem;">Fee Progress</h3>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
                                    <span style="color: var(--text-secondary); font-weight: 500;">Amount Paid</span>
                                    <span style="font-weight: 700;">₹${store.fees.paid.toLocaleString()}</span>
                                </div>
                                <div class="progress-bar-container">
                                    <div class="progress-bar-fill" style="width: ${(store.fees.paid / store.fees.total) * 100}%; background: var(--success);"></div>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 0.85rem;">
                                    <span style="color: var(--text-secondary); font-weight: 500;">Total Fee: ₹${store.fees.total.toLocaleString()}</span>
                                    <a href="#student/fee-details" style="color: var(--primary); font-weight: 700;">Details</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}

