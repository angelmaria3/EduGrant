// js/pages/student/Scholarships.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getAllScholarships } from '../../services/scholarshipService.js';
import { getMyApplications }  from '../../services/applicationService.js';
import { checkEligibility, checkProfileComplete } from '../../services/eligibilityEngine.js';

export async function ScholarshipsPage() {
    const student = store.user.data;
    if (!student) { window.location.hash = '#login'; return ''; }

    const profileOk = checkProfileComplete(student);

    const [scholarships, myApplications] = await Promise.all([
        getAllScholarships().catch(() => []),
        getMyApplications(student.student_id).catch(() => [])
    ]);

    const appliedIds = new Set(myApplications.map(a => a.scholarship_id));
    const year = new Date().getFullYear();

    const cards = scholarships.map(s => {
        const criteria  = s.eligibility_criteria?.[0] || null;
        const { eligible, reasons } = criteria && profileOk
            ? checkEligibility(student, criteria)
            : { eligible: false, reasons: profileOk ? ['No criteria defined'] : ['Complete your profile first'] };
        const alreadyApplied = appliedIds.has(s.scholarship_id);

        const typeColor = {
            'merit': '#1A3C6E', 'need': '#E67E22',
            'category_based': '#8E44AD', 'fee_concession': '#27AE60'
        }[s.type] || 'var(--primary)';

        let actionHtml;
        if (!profileOk) {
            actionHtml = `
                <div style="color:var(--warning);font-weight:700;font-size:0.85rem;text-align:center;background:rgba(243,156,18,0.1);padding:10px;border-radius:8px;margin-bottom:10px;">⚠️ Complete your profile to check eligibility</div>
                <button onclick="window.location.hash='#student/profile'" style="width:100%;background:var(--primary);color:white;padding:10px;font-weight:700;">Update Profile</button>`;
        } else if (alreadyApplied) {
            const app = myApplications.find(a => a.scholarship_id === s.scholarship_id);
            actionHtml = `
                <div style="color:${getStatusColor(app?.status || 'pending')};font-weight:700;text-align:center;margin-bottom:8px;">● Already Applied</div>
                <span class="badge" style="display:block;text-align:center;background:${getStatusColor(app?.status)}20;color:${getStatusColor(app?.status)};">${app?.status || 'pending'}</span>`;
        } else if (eligible) {
            actionHtml = `
                <div style="color:var(--success);font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:8px;">✅ Eligible</div>
                <button onclick="window.location.hash='#student/apply/${s.scholarship_id}'" style="width:100%;background:var(--primary);color:white;padding:10px;border-radius:8px;font-weight:700;">Apply Now →</button>`;
        } else {
            actionHtml = `
                <div style="color:var(--danger);font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:8px;">❌ Not Eligible</div>
                <div style="font-size:0.75rem;color:var(--text-secondary);line-height:1.6;margin-bottom:10px;">
                    ${reasons.map(r => `<div>• ${r}</div>`).join('')}
                </div>
                <button style="width:100%;background:var(--border);color:var(--text-secondary);padding:10px;cursor:not-allowed;" disabled>Apply Now</button>`;
        }

        return `
            <div class="card" style="display:grid;grid-template-columns:1fr 210px;gap:var(--space-md);border-left:5px solid ${typeColor};">
                <div>
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;flex-wrap:wrap;">
                        <span style="background:${typeColor}20;color:${typeColor};padding:3px 10px;border-radius:var(--radius-pill);font-size:0.72rem;font-weight:700;text-transform:uppercase;">${s.type?.replace('_',' ')}</span>
                        <h3 style="margin:0;font-size:1.2rem;">${s.scholarship_name}</h3>
                    </div>
                    <p style="color:var(--text-secondary);margin-bottom:10px;font-size:0.9rem;">Provider: <strong>${s.provider}</strong></p>
                    <p style="font-size:0.9rem;margin-bottom:16px;color:var(--text-primary);">${s.description || ''}</p>
                    <div style="display:flex;gap:32px;">
                        <div>
                            <div style="font-size:0.72rem;color:var(--text-secondary);text-transform:uppercase;font-weight:700;">Amount</div>
                            <div style="font-weight:700;color:var(--primary);">₹${Number(s.amount).toLocaleString()}/year</div>
                        </div>
                        <div>
                            <div style="font-size:0.72rem;color:var(--text-secondary);text-transform:uppercase;font-weight:700;">Year</div>
                            <div style="font-weight:700;color:var(--primary);">${s.applicable_year}</div>
                        </div>
                        ${criteria ? `
                        <div>
                            <div style="font-size:0.72rem;color:var(--text-secondary);text-transform:uppercase;font-weight:700;">Min CGPA</div>
                            <div style="font-weight:700;">${criteria.min_cgpa}</div>
                        </div>
                        <div>
                            <div style="font-size:0.72rem;color:var(--text-secondary);text-transform:uppercase;font-weight:700;">Max Income</div>
                            <div style="font-weight:700;">₹${Number(criteria.max_income).toLocaleString()}</div>
                        </div>` : ''}
                    </div>
                </div>
                <div style="border-left:1px solid var(--border);padding-left:var(--space-md);display:flex;flex-direction:column;justify-content:center;gap:8px;">
                    ${actionHtml}
                </div>
            </div>`;
    }).join('');

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="margin-bottom:32px;">
                        <h1 style="font-size:2rem;margin:0;font-family:'Outfit';">Available Schemes</h1>
                        <p style="color:var(--text-secondary);margin-top:4px;">Scholarship opportunities for Academic Year ${year}</p>
                    </div>

                    ${!profileOk ? `
                        <div style="background:rgba(243,156,18,0.12);border:1px solid rgba(243,156,18,0.3);padding:16px 20px;border-radius:12px;margin-bottom:24px;display:flex;align-items:center;gap:14px;">
                            <span style="font-size:1.5rem;">⚠️</span>
                            <div>
                                <strong style="color:#92400e;">Profile Incomplete</strong>
                                <p style="margin:4px 0 0;font-size:0.85rem;color:#92400e;">Your CGPA, income, or department is missing. <a href="#student/profile" style="font-weight:700;color:var(--primary);">Complete your profile →</a></p>
                            </div>
                        </div>
                    ` : ''}

                    ${scholarships.length === 0
                        ? `<div class="card" style="text-align:center;padding:60px;color:var(--text-secondary);"><div style="font-size:2.5rem;margin-bottom:12px;">🔍</div>No scholarships available for ${year}.</div>`
                        : `<div style="display:flex;flex-direction:column;gap:var(--space-md);">${cards}</div>`
                    }
                </div>
            </main>
        </div>
    `;
}
