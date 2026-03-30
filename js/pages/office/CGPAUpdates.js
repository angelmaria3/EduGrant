// js/pages/office/CGPAUpdates.js
import { store, mockStudent } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function CGPAUpdates() {
    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
                        <!-- Update Queue -->
                        <div class="card" style="padding: 0;">
                            <div style="padding: 24px; border-bottom: 1px solid var(--border);">
                                <h3 style="margin: 0; font-family: 'Outfit';">GPA Entry Queue</h3>
                                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">Students awaiting latest semester GPA validation</p>
                            </div>
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="text-align: left; background: #fafafa; border-bottom: 1px solid var(--border);">
                                        <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Student</th>
                                        <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Prev CGPA</th>
                                        <th style="padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Target Sem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="border-bottom: 1px solid var(--border); cursor: pointer; background: rgba(91, 13, 27, 0.02);">
                                        <td style="padding: 16px;">
                                            <div style="font-weight: 700;">Anjali R.</div>
                                            <div style="font-size: 0.75rem; color: var(--text-secondary);">2021CS001</div>
                                        </td>
                                        <td style="padding: 16px;">8.48</td>
                                        <td style="padding: 16px;">
                                            <span class="badge" style="background: var(--primary-staff)15; color: var(--primary-staff);">Semester 5</span>
                                        </td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 16px;">
                                            <div style="font-weight: 700;">Rahul Krishnan</div>
                                            <div style="font-size: 0.75rem; color: var(--text-secondary);">2022CS019</div>
                                        </td>
                                        <td style="padding: 16px;">7.80</td>
                                        <td style="padding: 16px;">
                                            <span class="badge" style="background: var(--primary-staff)15; color: var(--primary-staff);">Semester 3</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Quick Update Form -->
                        <div class="card" style="align-self: flex-start;">
                            <h3 style="margin-bottom: 24px; font-family: 'Outfit';">Update Record</h3>
                            <div style="display: flex; flex-direction: column; gap: 20px;">
                                <div class="form-group">
                                    <label>Selected Student</label>
                                    <div style="font-weight: 700;">Anjali R. (2021CS001)</div>
                                </div>
                                <div class="form-group">
                                    <label>Enter Semester 5 GPA</label>
                                    <input type="number" step="0.01" placeholder="e.g. 8.5" style="border: 2px solid var(--primary-staff);">
                                </div>
                                <div class="form-group">
                                    <label>Verification Markshet (Uploaded)</label>
                                    <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f5f5f5; border-radius: 8px; font-size: 0.8rem;">
                                        <span>📄</span>
                                        <span style="flex: 1;">marksheet_s5.pdf</span>
                                        <span style="color: var(--primary-staff); font-weight: 700;">View</span>
                                    </div>
                                </div>
                                <button style="background: var(--primary-staff); color: white; padding: 14px; font-weight: 700; width: 100%;">Commit Entry</button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    `;
}
