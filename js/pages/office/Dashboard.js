// js/pages/office/Dashboard.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function StaffDashboard() {
    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    
                    <div style="margin-bottom: 32px;">
                        <h1 style="font-size: 2.2rem; font-family: 'Outfit'; margin: 0; letter-spacing: -1px;">Office Staff Portal</h1>
                        <p style="color: var(--text-secondary);">Manage student verifications and academic record updates.</p>
                    </div>

                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
                        
                        <!-- Left Column: Primary Stats -->
                        <div style="display: flex; flex-direction: column; gap: 32px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                                <div class="card stat-card" style="border-left: 4px solid var(--primary-staff);">
                                    <span class="text-overline">Pending Review</span>
                                    <div class="stat-value" style="color: var(--primary-staff); font-size: 2.5rem;">08</div>
                                    <div style="font-size: 0.75rem; color: var(--text-secondary);">Apps awaiting verification</div>
                                </div>
                                <div class="card stat-card" style="border-left: 4px solid var(--warning);">
                                    <span class="text-overline">GPA Entries</span>
                                    <div class="stat-value" style="color: var(--warning); font-size: 2.5rem;">03</div>
                                    <div style="font-size: 0.75rem; color: var(--text-secondary);">Students pending GPA update</div>
                                </div>
                            </div>

                            <div class="card">
                                <h3 style="margin-bottom: 20px; font-family: 'Outfit';">Upcoming Deadlines</h3>
                                <div style="display: flex; flex-direction: column; gap: 12px;">
                                    <div style="padding: 16px; background: #fff5f5; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <div style="font-weight: 700; color: var(--danger);">MCM Scholarship Verification</div>
                                            <div style="font-size: 0.75rem; color: var(--text-secondary);">Deadline: 15 April 2024</div>
                                        </div>
                                        <span class="badge" style="background: var(--danger); color: white;">Critical</span>
                                    </div>
                                    <div style="padding: 16px; background: #f8f9fa; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <div style="font-weight: 700;">Internal Merit List Generation</div>
                                            <div style="font-size: 0.75rem; color: var(--text-secondary);">Deadline: 20 April 2024</div>
                                        </div>
                                        <span class="badge" style="background: var(--info); color: white;">Upcoming</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Quick Links -->
                        <div style="display: flex; flex-direction: column; gap: 32px;">
                            <div class="card">
                                <h3 style="margin-bottom: 20px; font-family: 'Outfit';">Verification Tasks</h3>
                                <div style="display: flex; flex-direction: column; gap: 10px;">
                                    <button class="btn" style="width: 100%; text-align: left; padding: 14px; background: var(--primary-staff); color: white; border-radius: 12px;" onclick="window.location.hash='#staff/queue'">
                                        Open Verification Queue
                                    </button>
                                    <button class="btn" style="width: 100%; text-align: left; padding: 14px; border: 1px solid var(--border); border-radius: 12px;" onclick="window.location.hash='#staff/cgpa'">
                                        Process GPA Updates
                                    </button>
                                    <button class="btn" style="width: 100%; text-align: left; padding: 14px; border: 1px solid var(--border); border-radius: 12px;" onclick="window.location.hash='#staff/documents'">
                                        Browse Document Repository
                                    </button>
                                </div>
                            </div>

                            <div class="card" style="background: rgba(26, 60, 110, 0.03);">
                                <h4 style="margin-bottom: 8px;">Staff Support</h4>
                                <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">
                                    For technical issues with the verification system, please contact the IT Administrator or use the internal ticketing system.
                                </p>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </main>
        </div>
    `;
}
