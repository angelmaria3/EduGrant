// js/pages/student/Scholarships.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function ScholarshipsPage() {
    const student = store.user.data;
    
    const checkEligibility = (scholarship) => {
        const { minCgpa, maxIncome, category } = scholarship.criteria;
        const criteria = [];
        
        const isCgpaOk = student.cgpa >= minCgpa;
        const isIncomeOk = student.annualIncome <= maxIncome;
        const isCategoryOk = category === 'ALL' || student.category.includes(category);
        
        criteria.push({ label: `Min CGPA: ${minCgpa}`, met: isCgpaOk });
        criteria.push({ label: `Max Income: ₹${maxIncome.toLocaleString()}`, met: isIncomeOk });
        criteria.push({ label: `Category: ${category}`, met: isCategoryOk });
        
        return {
            isEligible: isCgpaOk && isIncomeOk && isCategoryOk,
            criteria
        };
    };

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    
                    <div style="margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end;">
                        <div>
                            <h1 style="font-size: 2rem; margin: 0; font-family: 'Outfit';">Available Schemes</h1>
                            <p style="color: var(--text-secondary); margin-top: 4px;">Explore internal and government scholarship opportunities</p>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <select style="width: 150px;">
                                <option>All Types</option>
                                <option>Merit-based</option>
                                <option>Income-based</option>
                                <option>Category-based</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: var(--space-md);">
                        ${scholarships.map(s => {
                            const { isEligible, isPendingProfile, reasons } = checkEligibility(s);
                            return `
                                <div class="card" style="display: grid; grid-template-columns: 1fr 200px; gap: var(--space-md); border-left: 6px solid ${s.type === 'Merit-based' ? 'var(--primary-light)' : 'var(--accent)'};">
                                    <div>
                                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                            <span style="background: var(--primary)15; color: var(--primary); padding: 4px 10px; border-radius: var(--radius-pill); font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
                                                ${s.type}
                                            </span>
                                            <h3 style="margin: 0; font-size: 1.25rem;">${s.name}</h3>
                                        </div>
                                        <p style="color: var(--text-secondary); margin-bottom: 12px;">Provided by: <strong>${s.provider}</strong></p>
                                        <p style="font-size: 0.95rem; margin-bottom: 16px;">${s.description}</p>
                                        
                                        <div style="display: flex; gap: 24px;">
                                            <div>
                                                <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700;">Amount</div>
                                                <div style="font-weight: 700; font-size: 1.1rem; color: var(--primary);">₹${s.amount.toLocaleString()}/year</div>
                                            </div>
                                            <div>
                                                <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700;">Year</div>
                                                <div style="font-weight: 700; font-size: 1.1rem; color: var(--primary);">${s.applicableYear}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style="display: flex; flex-direction: column; justify-content: center; border-left: 1px solid var(--border); padding-left: var(--space-md);">
                                        <div style="margin-bottom: var(--space-md); text-align: center;">
                                            ${isPendingProfile ? `
                                                <div style="color: var(--warning); font-weight: 700; display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 0.85rem; background: var(--warning)10; padding: 12px; border-radius: 8px;">
                                                    <span style="font-size: 1.5rem;">⚠️</span> 
                                                    <span>Verify Academic Details</span>
                                                </div>
                                                <button style="width: 100%; background: var(--primary); color: white; padding: 10px; font-weight: 700;" onclick="window.location.hash = '#student/profile'">Update Profile</button>
                                            ` : isEligible ? `
                                                <div style="color: var(--success); font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 8px;">
                                                    <span>✅</span> Eligible
                                                </div>
                                                <button style="width: 100%; background: var(--accent); color: white; padding: 10px; font-weight: 700;" onclick="window.location.hash = '#student/apply/${s.id}'">Apply Now →</button>
                                            ` : `
                                                <div style="color: var(--danger); font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 8px;">
                                                    <span>❌</span> Not Eligible
                                                </div>
                                                <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.2;">
                                                    ${reasons.map(r => `<div>${r}</div>`).join('')}
                                                </div>
                                                <button style="width: 100%; background: var(--border); color: var(--text-secondary); padding: 10px; margin-top: 12px; cursor: not-allowed;" disabled>Apply Now</button>
                                            `}
                                        </div>
                                        <button style="width: 100%; border: 1px solid var(--primary-light); background: transparent; color: var(--primary-light); padding: 8px; font-size: 0.85rem;">View Requirements</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </main>
        </div>
    `;
}
