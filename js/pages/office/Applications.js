// js/pages/office/Applications.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function OfficeApplications() {
    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    
                    <div class="card" style="padding: 0;">
                        <div style="padding: 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0; font-family: 'Outfit';">All Applications</h3>
                            <div style="display: flex; gap: 12px;">
                                <select style="width: 150px; padding: 10px; border-radius: 12px; font-size: 0.85rem;">
                                    <option>All Types</option>
                                    <option>Internal</option>
                                    <option>External</option>
                                </select>
                                <button style="background: var(--primary-staff); color: white; padding: 10px 20px; font-size: 0.85rem;">Export CSV</button>
                            </div>
                        </div>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="text-align: left; background: #fafafa; border-bottom: 1px solid var(--border);">
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Student</th>
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Scheme</th>
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Type</th>
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Date</th>
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${store.applications.map(app => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 16px;">
                                            <div style="font-weight: 700;">${app.studentName}</div>
                                            <div style="font-size: 0.75rem; color: var(--text-secondary);">${app.regNo}</div>
                                        </td>
                                        <td style="padding: 16px; font-size: 0.9rem;">${app.scholarshipName}</td>
                                        <td style="padding: 16px; font-size: 0.85rem; color: var(--text-secondary);">${app.type}</td>
                                        <td style="padding: 16px; font-size: 0.9rem;">${app.date}</td>
                                        <td style="padding: 16px;">
                                            <span class="badge" style="background: ${getStatusColor(app.status)}15; color: ${getStatusColor(app.status)}; border: 1px solid ${getStatusColor(app.status)}30;">
                                                ${app.status}
                                            </span>
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
