// js/pages/office/StudentRecords.js
import { store, mockStudent } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function StudentRecords() {
    const students = [
        { ...mockStudent, id: 1 },
        { id: 2, name: 'Rahul Krishnan', registerNumber: '2022CS019', department: 'CSE', yearStudy: 2, cgpa: 7.8, status: 'Active' },
        { id: 3, name: 'Meena Pillai', registerNumber: '2021EC032', department: 'ECE', yearStudy: 3, cgpa: 8.9, status: 'Active' },
        { id: 4, name: 'Arun Nair', registerNumber: '2023ME005', department: 'ME', yearStudy: 1, cgpa: null, status: 'New Register' }
    ];

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container" style="display: flex; flex-direction: column; gap: 32px;">
                    
                    <div class="grid" style="grid-template-columns: 1fr 320px; gap: 32px;">
                        <!-- Main Table Area -->
                        <div class="card" style="padding: 0;">
                            <div style="padding: 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                                <h3 style="margin: 0; font-family: 'Outfit';">Student Records</h3>
                                <input type="text" placeholder="Search by name or ID..." style="width: 280px; padding: 10px; border-radius: 12px; font-size: 0.85rem;">
                            </div>
                            
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="text-align: left; background: #fafafa; border-bottom: 1px solid var(--border);">
                                        <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Student Details</th>
                                        <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Dept/Year</th>
                                        <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">CGPA</th>
                                        <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${students.map(s => `
                                        <tr style="border-bottom: 1px solid var(--border); cursor: pointer;" onclick="this.style.background='#fcfcfc'">
                                            <td style="padding: 16px;">
                                                <div style="font-weight: 700;">${s.name}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-secondary);">${s.registerNumber}</div>
                                            </td>
                                            <td style="padding: 16px; font-size: 0.9rem;">${s.department} • Year ${s.yearStudy}</td>
                                            <td style="padding: 16px; font-weight: 700; color: var(--primary);">${s.cgpa || 'N/A'}</td>
                                            <td style="padding: 16px;">
                                                <span class="badge" style="background: ${s.status === 'Active' ? 'var(--success)' : 'var(--warning)'}15; color: ${s.status === 'Active' ? 'var(--success)' : 'var(--warning)'}; border: 1px solid ${s.status === 'Active' ? 'var(--success)' : 'var(--warning)'}30;">
                                                    ${s.status}
                                                </span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <!-- Side Details Panel -->
                        <div style="display: flex; flex-direction: column; gap: 24px;">
                            <div class="card" style="padding: 24px;">
                                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                                    <div style="width: 50px; height: 50px; background: var(--primary-staff); color: white; border-radius: 14px; display: grid; place-items: center; font-weight: 800; font-size: 1.25rem;">A</div>
                                    <div>
                                        <h3 style="margin: 0; font-family: 'Outfit'; font-size: 1.1rem;">Anjali R.</h3>
                                        <div style="font-size: 0.75rem; color: var(--text-secondary);">2021CS001</div>
                                    </div>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                                    <span class="text-overline">Academic Progress</span>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                        ${[1,2,3,4].map(sem => `
                                            <div style="padding: 8px; border: 1px solid var(--border); border-radius: 8px; text-align: center;">
                                                <div style="font-size: 0.6rem; color: var(--text-secondary);">Sem ${sem}</div>
                                                <div style="font-weight: 700; font-size: 0.9rem;">8.${sem+1}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 8px;">
                                    <span class="text-overline">Recent History</span>
                                    <div style="font-size: 0.8rem; line-height: 1.4;">
                                        <div style="margin-bottom: 4px; border-left: 2px solid var(--success); padding-left: 10px;">Income Cert Verified (12 Mar)</div>
                                        <div style="margin-bottom: 4px; border-left: 2px solid var(--warning); padding-left: 10px;">Applied OBC Concession (10 Mar)</div>
                                    </div>
                                </div>
                                <button style="width: 100%; margin-top: 24px; background: var(--primary-staff); color: white; padding: 12px; font-size: 0.85rem;">View Full Profile</button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    `;
}
