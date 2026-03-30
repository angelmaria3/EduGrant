// js/pages/office/Documents.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function OfficeDocuments() {
    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    
                    <div class="card" style="padding: 0;">
                        <div style="padding: 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0; font-family: 'Outfit';">Document Repository</h3>
                            <div style="display: flex; gap: 12px; flex: 1; max-width: 400px; margin-left: 24px;">
                                <input type="text" placeholder="Search by student name or document..." style="width: 100%; padding: 10px; border-radius: 12px; font-size: 0.85rem;">
                            </div>
                            <div style="display: flex; gap: 12px;">
                                <select style="width: 150px; padding: 10px; border-radius: 12px; font-size: 0.85rem;">
                                    <option>All Status</option>
                                    <option>Verified</option>
                                    <option>Pending</option>
                                    <option>Rejected</option>
                                </select>
                            </div>
                        </div>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="text-align: left; background: #fafafa; border-bottom: 1px solid var(--border);">
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Document Name</th>
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Student</th>
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Submitted Date</th>
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Status</th>
                                    <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700; text-align: right;">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${[
                                    { name: 'Income Certificate', student: 'Anjali R.', date: '2024-03-01', status: 'Verified' },
                                    { name: 'Marksheet (Sem 4)', student: 'Anjali R.', date: '2024-03-10', status: 'Pending' },
                                    { name: 'Caste Certificate', student: 'Rahul Krishnan', date: '2024-03-05', status: 'Verified' },
                                    { name: 'Income Certificate', student: 'Arun Nair', date: '2024-03-12', status: 'Pending' }
                                ].map(doc => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 16px;">
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <span style="font-size: 1.2rem;">📄</span>
                                                <span style="font-weight: 600;">${doc.name}</span>
                                            </div>
                                        </td>
                                        <td style="padding: 16px; font-size: 0.9rem;">${doc.student}</td>
                                        <td style="padding: 16px; font-size: 0.9rem;">${doc.date}</td>
                                        <td style="padding: 16px;">
                                            <span class="badge" style="background: ${getStatusColor(doc.status)}15; color: ${getStatusColor(doc.status)};">
                                                ${doc.status}
                                            </span>
                                        </td>
                                        <td style="padding: 16px; text-align: right;">
                                            <button style="background: none; color: var(--primary-staff); font-weight: 700; font-size: 0.85rem;">View File</button>
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
