// js/pages/student/FeeDetails.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getGlobalFeeStructure } from '../../services/feeService.js';
import { getMyApplications }     from '../../services/applicationService.js';

export async function FeeDetailsPage() {
    const student = store.user.data;
    if (!student) { window.location.hash = '#login'; return ''; }

    const year = new Date().getFullYear();
    const sem  = student.current_semester || 1;

    // 1. Get Global Structure for current semester
    const structure = await getGlobalFeeStructure(sem, year);
    
    // 2. Get Approved Fee Concessions
    const apps = await getMyApplications(student.student_id).catch(() => []);
    const concessions = apps.filter(a => a.status === 'approved' && a.scholarship?.type === 'fee_concession');

    // 3. Calculate Tuition Discount
    let tuitionOriginal = parseFloat(structure?.tuition_fee || 0);
    let totalDiscount = 0;
    
    concessions.forEach(c => {
        const sch = c.scholarship;
        if (sch.is_percentage) {
            totalDiscount += tuitionOriginal * (parseFloat(sch.amount) / 100);
        } else {
            totalDiscount += parseFloat(sch.amount);
        }
    });

    const tuitionFinal = Math.max(0, tuitionOriginal - totalDiscount);

    const components = [
        { label: 'Tuition Fee',      original: tuitionOriginal, final: tuitionFinal, isConcession: totalDiscount > 0 },
        { label: 'Examination Fee',  original: parseFloat(structure?.exam_fee || 0), final: parseFloat(structure?.exam_fee || 0) },
        { label: 'University Fee',   original: parseFloat(structure?.university_fee || 0), final: parseFloat(structure?.university_fee || 0) },
        { label: 'Bus Fee',          original: parseFloat(structure?.bus_fee || 0), final: parseFloat(structure?.bus_fee || 0) },
        { label: 'Arts & Sports Fee',original: parseFloat(structure?.arts_sports_fee || 0), final: parseFloat(structure?.arts_sports_fee || 0) },
        { label: 'Miscellaneous Fee',original: parseFloat(structure?.misc_fee || 0), final: parseFloat(structure?.misc_fee || 0) },
    ];

    const grandTotalOriginal = components.reduce((sum, c) => sum + c.original, 0);
    const grandTotalFinal    = components.reduce((sum, c) => sum + c.final, 0);

    const tableRows = components.map(c => `
        <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 16px; font-weight: 500;">${c.label}</td>
            <td style="padding: 16px; text-align: right; color: var(--text-secondary); ${c.isConcession ? 'text-decoration: line-through; font-size: 0.8rem;' : ''}">₹${c.original.toLocaleString()}</td>
            <td style="padding: 16px; text-align: right; font-weight: 700; color: ${c.isConcession ? 'var(--success)' : 'var(--text-primary)'}">₹${c.final.toLocaleString()}</td>
        </tr>
    `).join('');

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container" style="width: 100% !important; max-width: none !important; margin: 0 !important;">
                    <div style="margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end;">
                        <div>
                            <h1 style="font-size: 2rem; margin: 0;">Fee Structure</h1>
                            <p style="color: var(--text-secondary); margin-top: 4px;">Detailed breakdown for <strong>Semester ${sem}</strong></p>
                        </div>
                        <div style="background: var(--neutral-bg); padding: 8px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; color: var(--primary);">
                            AY ${year}
                        </div>
                    </div>

                    <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 32px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--neutral-bg); border-bottom: 2px solid var(--border);">
                                    <th style="padding: 16px; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">Fee Component</th>
                                    <th style="padding: 16px; text-align: right; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">Original Amount</th>
                                    <th style="padding: 16px; text-align: right; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">Payable Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                                <tr style="background: var(--neutral-bg); border-top: 2px solid var(--border);">
                                    <td style="padding: 20px 16px; font-weight: 800; font-size: 1.1rem;">Total (Semester ${sem})</td>
                                    <td style="padding: 20px 16px; text-align: right; font-weight: 700; color: var(--text-secondary); ${totalDiscount > 0 ? 'text-decoration: line-through;' : ''}">₹${grandTotalOriginal.toLocaleString()}</td>
                                    <td style="padding: 20px 16px; text-align: right; font-weight: 900; font-size: 1.2rem; color: var(--primary);">₹${grandTotalFinal.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    ${concessions.length > 0 ? `
                        <div style="display: flex; flex-direction: column; gap: 12px; padding: 20px; background: rgba(39, 174, 96, 0.08); border: 1px solid rgba(39, 174, 96, 0.2); border-radius: 12px; color: #1a6b3a;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span style="font-size: 1.5rem;">✨</span>
                                <div style="font-weight: 800; font-size: 1rem;">Scholarship Concessions Applied</div>
                            </div>
                            <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem;">
                                ${concessions.map(c => `
                                    <li style="margin-bottom: 4px;">
                                        <strong>${c.scholarship.scholarship_name}</strong>: 
                                        ${c.scholarship.is_percentage ? `${c.scholarship.amount}% concession` : `₹${parseFloat(c.scholarship.amount).toLocaleString()} discount`} 
                                        (Saved ₹${(c.scholarship.is_percentage ? (tuitionOriginal * parseFloat(c.scholarship.amount)/100) : parseFloat(c.scholarship.amount)).toLocaleString()})
                                    </li>
                                `).join('')}
                            </ul>
                            <div style="margin-top: 8px; font-weight: 700; border-top: 1px solid rgba(39,174,96,0.2); padding-top: 8px;">
                                Total Savings: ₹${totalDiscount.toLocaleString()}
                            </div>
                        </div>
                    ` : `
                        <div style="padding: 20px; background: var(--neutral-bg); border-radius: 12px; border: 1px solid var(--border); color: var(--text-secondary); font-size: 0.9rem;">
                            <strong>No concessions applied yet.</strong> If you're eligible for fee-waiver scholarships, apply in the <a href="#student/scholarships" style="color: var(--primary); font-weight: 700; text-decoration: none;">Scholarships section</a>.
                        </div>
                    `}

                    </div>
                </div>
            </main>
        </div>
    `;
}

