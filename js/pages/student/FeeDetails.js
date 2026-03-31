// js/pages/student/FeeDetails.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getStudentFee } from '../../services/feeService.js';

export async function FeeDetailsPage() {
    const student = store.user.data;
    if (!student) { window.location.hash = '#login'; return ''; }

    const fee = await getStudentFee(student.student_id).catch(() => null);

    const statusColor = { paid: '#27AE60', partial: '#E67E22', unpaid: '#C0392B' };
    const statusLabel = { paid: '✅ Fully Paid', partial: '⚠️ Partially Paid', unpaid: '❌ Unpaid' };

    const noFeeHtml = `
        <div class="card" style="text-align:center;padding:60px;color:var(--text-secondary);">
            <div style="font-size:3rem;margin-bottom:16px;">💳</div>
            <h3>No fee record found</h3>
            <p>Your fee record for ${new Date().getFullYear()} has not been created yet. Contact the office.</p>
        </div>`;

    const feeHtml = fee ? (() => {
        const total   = Number(fee.total_fee);
        const paid    = Number(fee.paid_amount);
        const pending = Number(fee.pending_amount);
        const pct     = total > 0 ? Math.min((paid / total) * 100, 100) : 0;
        const sc      = statusColor[fee.payment_status] || '#5F6368';

        return `
            <!-- Overview -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px;margin-bottom:32px;">
                ${[
                    { label:'Total Fee',    value:`₹${total.toLocaleString()}`,   color:'var(--primary)' },
                    { label:'Amount Paid',  value:`₹${paid.toLocaleString()}`,    color:'var(--success)' },
                    { label:'Pending',      value:`₹${pending.toLocaleString()}`, color:'var(--danger)'  },
                    { label:'Status',       value: statusLabel[fee.payment_status] || fee.payment_status, color: sc }
                ].map(s => `
                    <div class="card stat-card" style="border-top:4px solid ${s.color};">
                        <span class="text-overline">${s.label}</span>
                        <div style="font-size:1.5rem;font-weight:700;color:${s.color};margin-top:4px;">${s.value}</div>
                    </div>
                `).join('')}
            </div>

            <!-- Progress -->
            <div class="card" style="margin-bottom:24px;">
                <h3 style="margin-bottom:20px;">Payment Progress</h3>
                <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:8px;">
                    <span style="color:var(--text-secondary);">₹0</span>
                    <span style="font-weight:700;color:var(--success);">₹${paid.toLocaleString()} paid (${pct.toFixed(1)}%)</span>
                    <span style="color:var(--text-secondary);">₹${total.toLocaleString()}</span>
                </div>
                <div class="progress-bar-container" style="height:16px;border-radius:8px;">
                    <div class="progress-bar-fill" style="width:${pct}%;background:${pct===100?'var(--success)':'var(--primary)'};height:16px;border-radius:8px;transition:width 1s ease;"></div>
                </div>
                <div style="margin-top:16px;padding:12px 16px;background:${sc}15;border:1px solid ${sc}30;border-radius:8px;font-size:0.9rem;font-weight:600;color:${sc};">
                    ${statusLabel[fee.payment_status] || fee.payment_status} — Academic Year ${fee.academic_year}
                </div>
            </div>

            <!-- Info -->
            <div class="card">
                <h3 style="margin-bottom:16px;">Fee Breakdown</h3>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.9rem;">
                    <div style="padding:12px;background:var(--neutral-bg);border-radius:8px;">
                        <div style="color:var(--text-secondary);font-size:0.78rem;font-weight:700;text-transform:uppercase;margin-bottom:4px;">Academic Year</div>
                        <div style="font-weight:700;">${fee.academic_year}</div>
                    </div>
                    <div style="padding:12px;background:var(--neutral-bg);border-radius:8px;">
                        <div style="color:var(--text-secondary);font-size:0.78rem;font-weight:700;text-transform:uppercase;margin-bottom:4px;">Last Updated</div>
                        <div style="font-weight:700;">${new Date(fee.updated_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div>
                    </div>
                </div>
                <div style="margin-top:16px;padding:14px;background:rgba(39,174,96,0.08);border:1px solid rgba(39,174,96,0.2);border-radius:8px;font-size:0.85rem;color:#1a6b3a;">
                    <strong>Note:</strong> Scholarship approvals automatically reduce your pending fee amount.
                    <a href="#student/scholarships" style="color:var(--primary);font-weight:700;"> Apply now →</a>
                </div>
            </div>`;
    })() : noFeeHtml;

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="margin-bottom:32px;">
                        <h1 style="font-size:2rem;margin:0;">Fee Details</h1>
                        <p style="color:var(--text-secondary);margin-top:4px;">Your fee status for Academic Year ${new Date().getFullYear()}</p>
                    </div>
                    ${feeHtml}
                </div>
            </main>
        </div>
    `;
}
