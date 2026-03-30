// js/pages/admin/ReviewPanel.js
import { store, getStatusColor, mockStudent } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function AdminReviewPanel() {
    const parts = window.location.hash.split('/');
    const appId = parts[parts.length - 1];

    // Simulated application details
    const appData = {
        id: appId,
        student: mockStudent,
        scholarship: store.scholarships[0],
        status: 'Pending',
        documents: [
            { type: 'Income Certificate', file: 'income_cert.pdf', status: 'Pending' },
            { type: 'Caste Certificate', file: 'caste_cert.pdf', status: 'Pending' }
        ]
    };

    setTimeout(() => {
        document.querySelectorAll('.btn-verify').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const badge = e.target.parentElement.previousElementSibling.querySelector('span');
                badge.innerText = 'Verified';
                badge.style.background = 'var(--success)20';
                badge.style.color = 'var(--success)';
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'none';
            });
        });

        const approveBtn = document.getElementById('approve-btn');
        const rejectBtn = document.getElementById('reject-btn');

        approveBtn?.addEventListener('click', () => {
            alert(`Application ${appId} Approved!`);
            window.location.hash = '#admin/dashboard';
        });

        rejectBtn?.addEventListener('click', () => {
            const reason = prompt('Enter rejection reason:');
            if (reason) {
                alert(`Application ${appId} Rejected.`);
                window.location.hash = '#admin/dashboard';
            }
        });
    }, 0);

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container" style="max-width: 1000px; margin: 0 auto;">
                    <div style="margin-bottom: var(--space-lg); display: flex; align-items: center; gap: 12px;">
                        <a href="#admin/applications" style="font-size: 1.25rem;">←</a>
                        <h1 style="margin: 0;">Review Application #${appId}</h1>
                        <span style="margin-left: auto; background: var(--warning)20; color: var(--warning); padding: 6px 16px; border-radius: var(--radius-pill); font-weight: 700;">PENDING</span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div class="card">
                            <h3 style="font-size: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 8px;">Student Info</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.9rem; margin-top: 12px;">
                                <div><span style="color: var(--text-secondary);">Name:</span> <strong>${appData.student.name}</strong></div>
                                <div><span style="color: var(--text-secondary);">Reg No:</span> <strong>${appData.student.registerNumber}</strong></div>
                                <div><span style="color: var(--text-secondary);">Dept:</span> <strong>${appData.student.department}</strong></div>
                                <div><span style="color: var(--text-secondary);">Category:</span> <strong>${appData.student.category}</strong></div>
                                <div><span style="color: var(--text-secondary);">CGPA:</span> <strong style="color: var(--success);">${appData.student.cgpa}</strong></div>
                                <div><span style="color: var(--text-secondary);">Income:</span> <strong style="color: var(--primary);">₹${appData.student.annualIncome.toLocaleString()}</strong></div>
                            </div>
                        </div>
                        <div class="card">
                            <h3 style="font-size: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 8px;">Scholarship Info</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.9rem; margin-top: 12px;">
                                <div style="grid-column: span 2;"><span style="color: var(--text-secondary);">Title:</span> <strong>${appData.scholarship.name}</strong></div>
                                <div><span style="color: var(--text-secondary);">Amount:</span> <strong style="color: var(--primary);">₹${appData.scholarship.amount.toLocaleString()}</strong></div>
                                <div><span style="color: var(--text-secondary);">Provider:</span> <strong>${appData.scholarship.provider}</strong></div>
                                <div><span style="color: var(--text-secondary);">Type:</span> <strong>${appData.scholarship.type}</strong></div>
                                <div><span style="color: var(--text-secondary);">Year:</span> <strong>${appData.scholarship.applicableYear}</strong></div>
                            </div>
                        </div>
                    </div>

                    <div class="card" style="margin-bottom: var(--space-md);">
                        <h3 style="font-size: 1rem; margin-bottom: var(--space-md);">Eligibility Auto-Check</h3>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; align-items: center; gap: 10px; color: var(--success); font-weight: 600;">
                                <span>✅</span> CGPA ≥ 7.5 (Student: ${appData.student.cgpa})
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px; color: var(--success); font-weight: 600;">
                                <span>✅</span> Income ≤ ₹2,50,000 (Student: ₹${appData.student.annualIncome.toLocaleString()})
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px; color: var(--success); font-weight: 600;">
                                <span>✅</span> Category: OBC (Eligible)
                            </div>
                        </div>
                    </div>

                    <div class="card" style="margin-bottom: var(--space-xl);">
                        <h3 style="font-size: 1rem; margin-bottom: var(--space-md);">Uploaded Documents</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="text-align: left; border-bottom: 1px solid var(--border);">
                                    <th style="padding: 12px 8px; font-size: 0.85rem; color: var(--text-secondary);">Type</th>
                                    <th style="padding: 12px 8px; font-size: 0.85rem; color: var(--text-secondary);">File</th>
                                    <th style="padding: 12px 8px; font-size: 0.85rem; color: var(--text-secondary);">Status</th>
                                    <th style="padding: 12px 8px; font-size: 0.85rem; color: var(--text-secondary);">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${appData.documents.map(doc => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 12px 8px; font-weight: 600;">${doc.type}</td>
                                        <td style="padding: 12px 8px;"><a href="#" style="color: var(--primary-light); text-decoration: underline;">view_doc.pdf 👁</a></td>
                                        <td style="padding: 12px 8px;"><span style="background: var(--warning)20; color: var(--warning); padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700;">${doc.status}</span></td>
                                        <td style="padding: 12px 8px;">
                                            <button class="btn-verify" style="background: var(--success); color: white; padding: 4px 8px; font-size: 0.7rem; margin-right: 4px;">Verify</button>
                                            <button style="background: var(--danger); color: white; padding: 4px 8px; font-size: 0.7rem;">Reject</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div style="display: flex; gap: var(--space-md);">
                        <textarea id="admin-remarks" placeholder="Add optional remarks here..." style="flex: 1; height: 100px; padding: 12px;"></textarea>
                        <div style="display: flex; flex-direction: column; gap: 12px; width: 250px;">
                            <button id="approve-btn" style="background: var(--success); color: white; padding: 16px; font-size: 1rem;">✅ Approve Application</button>
                            <button id="reject-btn" style="background: var(--danger); color: white; padding: 16px; font-size: 1rem;">❌ Reject Application</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
