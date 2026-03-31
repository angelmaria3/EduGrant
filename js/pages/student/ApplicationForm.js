// js/pages/student/ApplicationForm.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getScholarshipById } from '../../services/scholarshipService.js';
import { submitApplication }  from '../../services/applicationService.js';
import { showToast } from '../../utils.js';

export async function ApplicationForm(params) {
    const student      = store.user.data;
    if (!student) { window.location.hash = '#login'; return ''; }

    const scholarshipId = params?.id;
    if (!scholarshipId) { window.location.hash = '#student/scholarships'; return ''; }

    let scholarship = null;
    try {
        scholarship = await getScholarshipById(scholarshipId);
    } catch {
        return `<div style="padding:40px;text-align:center;color:var(--danger);">Scholarship not found.</div>`;
    }

    let currentStep = 1;
    let savedExternalId = '';

    function renderStep(step) {
        switch (step) {
            case 1: return `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                    <div class="form-group"><label>Full Name</label><input value="${student.name}" disabled style="background:var(--neutral-bg);"></div>
                    <div class="form-group"><label>Register Number</label><input value="${student.register_number}" disabled style="background:var(--neutral-bg);"></div>
                    <div class="form-group"><label>Date of Birth</label><input type="date" value="${student.dob}" disabled style="background:var(--neutral-bg);"></div>
                    <div class="form-group"><label>Gender</label><input value="${student.gender}" disabled style="background:var(--neutral-bg);"></div>
                    <div class="form-group"><label>Department</label><input value="${student.department}" disabled style="background:var(--neutral-bg);"></div>
                    <div class="form-group"><label>Category</label><input value="${student.category}" disabled style="background:var(--neutral-bg);"></div>
                </div>`;
            case 2: return `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                    <div class="form-group"><label>Current CGPA</label><input type="number" id="f-cgpa" value="${student.cgpa || ''}" step="0.01" min="0" max="10"></div>
                    <div class="form-group"><label>Year of Study</label>
                        <select id="f-year">${[1,2,3,4].map(y=>`<option value="${y}" ${student.year_study==y?'selected':''}>${y}${['st','nd','rd','th'][y-1]} Year</option>`).join('')}</select>
                    </div>
                    <div class="form-group" style="grid-column:span 2"><label>Annual Family Income (₹)</label><input type="number" id="f-income" value="${student.annual_income || ''}"></div>
                </div>`;
            case 3: return `
                <div class="card" style="border:1px solid var(--primary-light);background:rgba(91,13,27,0.03);">
                    <h4 style="margin-bottom:8px;color:var(--primary);">Selected Scholarship</h4>
                    <p style="font-weight:700;font-size:1.1rem;">${scholarship.scholarship_name}</p>
                    <hr style="margin:12px 0;border:none;border-top:1px dashed var(--border);">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.9rem;">
                        <div><strong>Provider:</strong> ${scholarship.provider}</div>
                        <div><strong>Amount:</strong> ₹${Number(scholarship.amount).toLocaleString()}</div>
                        <div><strong>Type:</strong> ${scholarship.type}</div>
                        <div><strong>Year:</strong> ${scholarship.applicable_year}</div>
                    </div>
                </div>
                ${scholarship.external_url ? `
                <div class="card" style="margin-top:16px;border:1px solid var(--warning);background:rgba(243,156,18,0.05);">
                    <h4 style="margin-bottom:8px;color:#b45309;">External Application Required</h4>
                    <p style="font-size:0.9rem;margin-bottom:12px;color:var(--text-secondary);">You must have already applied on the external portal. Please provide your application ID below.</p>
                    <div class="form-group">
                        <label>External Application ID*</label>
                        <input type="text" id="f-external-id" value="${savedExternalId}" placeholder="Enter your application ID from the external portal" required>
                    </div>
                </div>` : ''}`;
            case 4: return `
                <div style="padding:var(--space-md);text-align:center;">
                    <div style="font-size:3rem;margin-bottom:var(--space-md);">📜</div>
                    <h3>Self Declaration</h3>
                    <p style="margin-bottom:var(--space-lg);color:var(--text-secondary);max-width:480px;margin-inline:auto;">I hereby certify that all information provided is true and accurate. I understand any discrepancy may lead to rejection and legal action.</p>
                    <label style="display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer;font-weight:600;">
                        <input type="checkbox" id="declaration-check" style="width:20px;height:20px;">
                        I agree to the terms and conditions.
                    </label>
                </div>`;
        }
    }

    setTimeout(() => {
        const nextBtn    = document.getElementById('next-btn');
        const prevBtn    = document.getElementById('prev-btn');
        const stepContent = document.getElementById('step-content');

        const stepLabels = ['Personal Info', 'Academic Details', 'Review Scholarship', 'Declaration'];

        function updateUI() {
            stepContent.innerHTML = renderStep(currentStep);
            document.querySelectorAll('.step-bubble').forEach((b, i) => {
                b.style.background = i + 1 === currentStep ? 'var(--primary)' : i + 1 < currentStep ? 'var(--success)' : 'var(--border)';
                b.style.color      = i + 1 <= currentStep ? 'white' : 'var(--text-secondary)';
            });
            prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
            nextBtn.textContent   = currentStep === 4 ? '✅ Submit Application' : 'Next →';
            nextBtn.style.background = currentStep === 4 ? 'var(--success)' : 'var(--primary)';
        }

        nextBtn.addEventListener('click', async () => {
            if (currentStep === 3 && scholarship.external_url) {
                const inputVal = document.getElementById('f-external-id')?.value?.trim();
                if (!inputVal) {
                    showToast('Please enter your External Application ID.', 'error');
                    return;
                }
                savedExternalId = inputVal;
            }

            if (currentStep < 4) {
                currentStep++;
                updateUI();
            } else {
                if (!document.getElementById('declaration-check')?.checked) {
                    showToast('Please accept the declaration to proceed.', 'error');
                    return;
                }
                nextBtn.disabled = true;
                nextBtn.textContent = 'Submitting…';
                try {
                    await submitApplication(student.student_id, scholarshipId, savedExternalId);
                    showToast('Application submitted successfully! 🎉', 'success');
                    window.location.hash = '#student/applications';
                } catch (err) {
                    if (err.code === '23505') {
                        showToast('You have already applied for this scholarship this year.', 'error');
                    } else {
                        showToast(err.message || 'Submission failed. Try again.', 'error');
                    }
                    nextBtn.disabled = false;
                    nextBtn.textContent = '✅ Submit Application';
                }
            }
        });

        prevBtn.addEventListener('click', () => { if (currentStep > 1) { currentStep--; updateUI(); } });
        updateUI();
    }, 0);

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container" style="max-width:800px;margin:0 auto;">
                    <div style="text-align:center;margin-bottom:var(--space-xl);">
                        <h1 style="margin-bottom:8px;">Scholarship Application</h1>
                        <p style="color:var(--text-secondary);">Applying for <strong>${scholarship.scholarship_name}</strong></p>
                        <div style="display:flex;justify-content:center;align-items:center;gap:40px;margin-top:32px;position:relative;">
                            <div style="position:absolute;top:15px;left:15%;right:15%;height:2px;background:var(--border);z-index:1;"></div>
                            ${[1,2,3,4].map((i,idx) => `
                                <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:8px;">
                                    <div class="step-bubble" style="width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:0.8rem;background:var(--border);transition:all 0.3s;">${i}</div>
                                    <span style="font-size:0.65rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase;">Step ${i}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="card" style="padding:var(--space-xl);">
                        <div id="step-content" style="min-height:260px;"></div>
                        <div style="display:flex;justify-content:space-between;margin-top:var(--space-xl);padding-top:var(--space-md);border-top:1px solid var(--border);">
                            <button id="prev-btn" style="background:var(--neutral-bg);padding:12px 24px;">← Back</button>
                            <button id="next-btn" style="background:var(--primary);color:white;padding:12px 32px;margin-left:auto;">Next →</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
