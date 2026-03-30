// js/pages/office/VerificationQueue.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function VerificationQueue() {
    const pendingApps = store.applications.filter(a => a.status === 'Pending' || a.status === 'Under Review');
    
    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    
                    <!-- Stats Section -->
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px;">
                        <div class="card stat-card">
                            <span class="text-overline">Total Pending</span>
                            <div class="stat-value">${pendingApps.length}</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">Awaiting Review</div>
                        </div>
                        <div class="card stat-card" style="border-left: 4px solid var(--info);">
                            <span class="text-overline">Documents</span>
                            <div class="stat-value" style="color: var(--info);">8</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">Docs to Verify</div>
                        </div>
                        <div class="card stat-card" style="border-left: 4px solid var(--success);">
                            <span class="text-overline">Verified Today</span>
                            <div class="stat-value" style="color: var(--success);">5</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">Processed</div>
                        </div>
                        <div class="card stat-card" style="border-left: 4px solid var(--danger);">
                            <span class="text-overline">Rejected</span>
                            <div class="stat-value" style="color: var(--danger);">2</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">This Week</div>
                        </div>
                    </div>

                    <!-- Deadline Strip -->
                    <div style="background: rgba(91, 13, 27, 0.05); border: 1px solid var(--primary-student); padding: 14px 20px; border-radius: 12px; margin-bottom: 32px; display: flex; align-items: center; gap: 12px; font-size: 0.9rem; color: var(--primary-student);">
                        <span style="font-size: 1.2rem;">⚖️</span>
                        <div style="flex: 1; font-weight: 600;">
                            Priority: 3 income certificates are nearing deadline (15 Apr). Verify them first.
                        </div>
                    </div>

                    <div class="card" style="padding: 0;">
                        <div style="padding: 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0; font-family: 'Outfit';">Pending Verifications</h3>
                            <button style="background: none; color: var(--primary); font-size: 0.85rem; font-weight: 700;">Mark all reviewed</button>
                        </div>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="text-align: left; background: #fafafa; border-bottom: 1px solid var(--border);">
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Student</th>
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Document</th>
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Application</th>
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Submitted</th>
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Status</th>
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700; text-align: right;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${pendingApps.map(app => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 16px;">
                                            <div style="font-weight: 700; color: var(--text-primary);">${app.studentName}</div>
                                            <div style="font-size: 0.75rem; color: var(--text-secondary);">${app.regNo}</div>
                                        </td>
                                        <td style="padding: 16px; font-size: 0.9rem;">${app.docs[0]}</td>
                                        <td style="padding: 16px; font-size: 0.9rem;">${app.scholarshipName}</td>
                                        <td style="padding: 16px; font-size: 0.9rem;">${app.date}</td>
                                        <td style="padding: 16px;">
                                            <span class="badge" style="background: ${getStatusColor(app.status)}15; color: ${getStatusColor(app.status)};">
                                                ${app.status}
                                            </span>
                                        </td>
                                        <td style="padding: 16px; text-align: right; display: flex; gap: 8px; justify-content: flex-end;">
                                            <button style="background: var(--success); color: white; padding: 8px 14px; font-size: 0.75rem;">Verify</button>
                                            <button style="background: var(--danger); color: white; padding: 8px 14px; font-size: 0.75rem;">Reject</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </div>
    `;
}
