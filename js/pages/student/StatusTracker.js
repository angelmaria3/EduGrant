// js/pages/student/StatusTracker.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function StatusTrackerPage() {
    const applications = store.applications;

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="margin-bottom: var(--space-lg);">
                        <h1 style="margin-bottom: 4px;">My Applications</h1>
                        <p style="color: var(--text-secondary);">Track the progress of your scholarship and concession requests</p>
                    </div>

                    <div class="card" style="padding: 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="text-align: left; border-bottom: 1px solid var(--border); background: var(--neutral-bg);">
                                    <th style="padding: 16px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary); width: 120px;">APP ID</th>
                                    <th style="padding: 16px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">SCHOLARSHIP</th>
                                    <th style="padding: 16px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">APPLIED ON</th>
                                    <th style="padding: 16px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">STATUS</th>
                                    <th style="padding: 16px; font-weight: 700; font-size: 0.85rem; color: var(--text-secondary);">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${applications.length === 0 ? `
                                    <tr>
                                        <td colspan="5" style="padding: var(--space-xl); text-align: center; color: var(--text-secondary);">
                                            No applications found. <a href="#student/scholarships">Apply now →</a>
                                        </td>
                                    </tr>
                                ` : applications.map(app => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 16px; font-family: 'JetBrains Mono', monospace; font-weight: 700;">${app.id}</td>
                                        <td style="padding: 16px; font-weight: 600;">${app.scholarshipName}</td>
                                        <td style="padding: 16px; color: var(--text-secondary); font-size: 0.9rem;">${app.date}</td>
                                        <td style="padding: 16px;">
                                            <span style="background: ${getStatusColor(app.status)}20; color: ${getStatusColor(app.status)}; padding: 6px 12px; border-radius: var(--radius-pill); font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                                <span style="width: 6px; height: 6px; border-radius: 50%; background: ${getStatusColor(app.status)};"></span>
                                                ${app.status}
                                            </span>
                                        </td>
                                        <td style="padding: 16px;">
                                            <button style="background: transparent; border: 1px solid var(--border); color: var(--text-primary); padding: 6px 12px; font-size: 0.8rem;">View Details</button>
                                        </td>
                                    </tr>
                                    ${app.status === 'Rejected' ? `
                                        <tr style="background: rgba(231, 76, 60, 0.03);">
                                            <td colspan="5" style="padding: 12px 16px; font-size: 0.85rem; color: var(--danger);">
                                                <strong>Admin Remarks:</strong> "Document mismatch – resubmit caste certificate with valid attestation."
                                            </td>
                                        </tr>
                                    ` : ''}
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `;
}
