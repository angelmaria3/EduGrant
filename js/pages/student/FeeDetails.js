// js/pages/student/FeeDetails.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function FeeDetailsPage() {
    const fees = store.fees;
    const paidPercent = Math.round((fees.paid / fees.total) * 100);

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="margin-bottom: var(--space-lg);">
                        <h1 style="margin-bottom: 4px;">Fee Details</h1>
                        <p style="color: var(--text-secondary);">View your current fee structure and applied concessions</p>
                    </div>

                    <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--space-md);">
                        <div class="card" style="padding: var(--space-xl);">
                            <h3 style="margin-bottom: var(--space-lg);">Payment Overview</h3>
                            
                            <div style="display: flex; align-items: flex-end; gap: var(--space-md); margin-bottom: var(--space-xl);">
                                <div style="flex: 1;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <span style="font-weight: 600;">Paid: ₹${fees.paid.toLocaleString()}</span>
                                        <span style="color: var(--text-secondary);">Total: ₹${fees.total.toLocaleString()}</span>
                                    </div>
                                    <div style="height: 16px; background: var(--neutral-bg); border-radius: 8px; overflow: hidden;">
                                        <div style="width: ${paidPercent}%; height: 100%; background: linear-gradient(90deg, var(--success) 0%, #a2d24d 100%); transition: width 1s ease-out;"></div>
                                    </div>
                                </div>
                                <div style="font-size: 2.5rem; font-weight: 700; color: var(--success); line-height: 1;">${paidPercent}%</div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-md); text-align: center; border-top: 1px solid var(--border); padding-top: var(--space-xl);">
                                <div>
                                    <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px;">Total Fee</div>
                                    <div style="font-size: 1.1rem; font-weight: 700;">₹${fees.total.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px;">Paid</div>
                                    <div style="font-size: 1.1rem; font-weight: 700; color: var(--success);">₹${fees.paid.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px;">Pending</div>
                                    <div style="font-size: 1.1rem; font-weight: 700; color: var(--danger);">₹${fees.pending.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div class="card" style="display: flex; flex-direction: column; gap: var(--space-md); background: linear-gradient(to bottom, #ffffff, #f8f9fb);">
                            <h3>Concessions Applied</h3>
                            ${store.applications.filter(a => a.status === 'Approved').length === 0 ? `
                                <div style="flex: 1; display: grid; place-items: center; color: var(--text-secondary); text-align: center; border: 1px dashed var(--border); border-radius: 8px; padding: var(--space-lg);">
                                    <div>
                                        <div style="font-size: 2rem; margin-bottom: 8px;">💳</div>
                                        <p>No active concessions or scholarships applied yet.</p>
                                    </div>
                                </div>
                            ` : store.applications.filter(a => a.status === 'Approved').map(app => `
                                <div style="padding: var(--space-md); border: 1px solid var(--success); background: var(--success)05; border-radius: 8px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                        <span style="font-weight: 700; color: var(--primary);">${app.scholarshipName}</span>
                                        <span style="background: var(--success); color: white; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px;">ACTIVE</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                        <span style="color: var(--text-secondary);">Concession Amount</span>
                                        <span style="font-weight: 700; color: var(--success);">₹10,000</span>
                                    </div>
                                    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 8px;">Applied on: ${app.date}</div>
                                </div>
                            `).join('')}
                            <div style="margin-top: auto; background: var(--primary)08; padding: var(--space-md); border-radius: 8px; font-size: 0.85rem;">
                                <strong>Note:</strong> Concessions are directly deducted from the total pending amount.
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
