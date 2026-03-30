// js/pages/admin/Applications.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function AdminApplicationsPage() {
    // Simulated all applications
    const allApps = [
        { id: 'APP-034', name: 'Anjali R.', scholarship: 'Merit Scholarship', date: '28 Mar 2026', status: 'Pending' },
        { id: 'APP-031', name: 'Rahul K.', scholarship: 'OBC Concession', date: '27 Mar 2026', status: 'Approved' },
        { id: 'APP-029', name: 'Sneha M.', scholarship: 'SC/ST Concession', date: '26 Mar 2026', status: 'Rejected' },
        ...store.applications.map(a => ({ id: a.id, name: 'New Student', scholarship: a.scholarshipName, date: a.date, status: a.status }))
    ];

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
                        <div>
                            <h1 style="margin-bottom: 4px;">Manage Applications</h1>
                            <p style="color: var(--text-secondary);">Verify and process all student scholarship requests</p>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <input type="text" placeholder="Search by name or ID..." style="width: 250px;">
                            <select style="width: 150px;">
                                <option>All Status</option>
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div class="card" style="padding: 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="text-align: left; border-bottom: 1px solid var(--border); background: var(--neutral-bg);">
                                    <th style="padding: 16px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">App ID</th>
                                    <th style="padding: 16px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">Student</th>
                                    <th style="padding: 16px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">Scholarship</th>
                                    <th style="padding: 16px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">Submitted</th>
                                    <th style="padding: 16px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">Status</th>
                                    <th style="padding: 16px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${allApps.map(app => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 16px; font-family: 'JetBrains Mono', monospace; font-weight: 700;">${app.id}</td>
                                        <td style="padding: 16px;">
                                            <div style="font-weight: 600;">${app.name}</div>
                                            <div style="font-size: 0.75rem; color: var(--text-secondary);">Reg: 2021CS034</div>
                                        </td>
                                        <td style="padding: 16px; font-size: 0.9rem;">${app.scholarship}</td>
                                        <td style="padding: 16px; font-size: 0.85rem; color: var(--text-secondary);">${app.date}</td>
                                        <td style="padding: 16px;">
                                            <span style="background: ${getStatusColor(app.status)}20; color: ${getStatusColor(app.status)}; padding: 4px 10px; border-radius: var(--radius-pill); font-size: 0.75rem; font-weight: 700;">
                                                ${app.status}
                                            </span>
                                        </td>
                                        <td style="padding: 16px;">
                                            <button style="background: var(--primary); color: white; padding: 6px 12px; font-size: 0.8rem;" onclick="window.location.hash = '#admin/applications/${app.id}'">Review</button>
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
