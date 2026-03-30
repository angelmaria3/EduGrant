// js/pages/student/ApplicationForm.js
import { store, mockStudent } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function ApplicationForm() {
    // Extract scholarship ID from hash: #student/apply/1
    const parts = window.location.hash.split('/');
    const scholarshipId = parseInt(parts[parts.length - 1]);
    const scholarship = store.scholarships.find(s => s.id === scholarshipId);

    let currentStep = 1;
    const formData = {
        ...mockStudent,
        scholarshipId: scholarshipId,
        scholarshipName: scholarship?.name || ''
    };

    function renderStep(step) {
        switch(step) {
            case 1:
                return `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" value="${formData.name}" disabled style="background: var(--neutral-bg);">
                        </div>
                        <div class="form-group">
                            <label>Register Number</label>
                            <input type="text" value="${formData.registerNumber}" disabled style="background: var(--neutral-bg);">
                        </div>
                        <div class="form-group">
                            <label>Date of Birth</label>
                            <input type="date" value="${formData.dob}" disabled style="background: var(--neutral-bg);">
                        </div>
                        <div class="form-group">
                            <label>Gender</label>
                            <input type="text" value="${formData.gender}" disabled style="background: var(--neutral-bg);">
                        </div>
                        <div class="form-group">
                            <label>Department</label>
                            <input type="text" value="${formData.department}" disabled style="background: var(--neutral-bg);">
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <input type="text" value="${formData.category}" disabled style="background: var(--neutral-bg);">
                        </div>
                    </div>
                `;
            case 2:
                return `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
                        <div class="form-group">
                            <label>Current CGPA</label>
                            <input type="number" id="form-cgpa" value="${formData.cgpa}" step="0.01" min="0" max="10">
                        </div>
                        <div class="form-group">
                            <label>Year of Study</label>
                            <select id="form-year">
                                ${[1,2,3,4].map(y => `<option value="${y}" ${formData.yearStudy == y ? 'selected' : ''}>Year ${y}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group" style="grid-column: span 2;">
                            <label>Annual Family Income (₹)</label>
                            <input type="number" id="form-income" value="${formData.annualIncome}">
                        </div>
                    </div>
                `;
            case 3:
                return `
                    <div class="card" style="border: 1px solid var(--primary-light); background: var(--primary)05;">
                        <h4 style="margin-bottom: 8px;">Selected Scholarship</h4>
                        <p style="font-weight: 700; font-size: 1.1rem; color: var(--primary);">${formData.scholarshipName}</p>
                        <hr style="margin: 12px 0; border: none; border-top: 1px dashed var(--border);">
                        <div style="font-size: 0.9rem;">
                            <p><strong>Provider:</strong> ${scholarship?.provider}</p>
                            <p><strong>Amount:</strong> ₹${scholarship?.amount.toLocaleString()}</p>
                            <p><strong>Year:</strong> ${scholarship?.applicableYear}</p>
                        </div>
                    </div>
                `;
            case 4:
                return `
                    <div style="padding: var(--space-md); text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: var(--space-md);">📜</div>
                        <h3>Self Declaration</h3>
                        <p style="margin-bottom: var(--space-lg); color: var(--text-secondary);">
                            I hereby certify that all the information provided above is true and accurate to the best of my knowledge. 
                            I understand that any discrepancy may lead to immediate rejection of my application.
                        </p>
                        <label style="display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" id="declaration-check" style="width: 20px; height: 20px;">
                            <span>I agree to the terms and conditions.</span>
                        </label>
                    </div>
                `;
        }
    }

    // Event listener logic within the return string using script or setTimeout
    setTimeout(() => {
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const stepDisplay = document.getElementById('step-content');
        const footer = document.getElementById('form-footer');

        function updateUI() {
            stepDisplay.innerHTML = renderStep(currentStep);
            document.querySelectorAll('.step-bubble').forEach((b, i) => {
                b.style.background = (i + 1) === currentStep ? 'var(--primary)' : (i + 1) < currentStep ? 'var(--success)' : 'var(--border)';
                b.style.color = (i + 1) <= currentStep ? 'white' : 'var(--text-secondary)';
            });
            
            prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
            nextBtn.innerText = currentStep === 4 ? 'Submit Application' : 'Next →';
            nextBtn.style.background = currentStep === 4 ? 'var(--success)' : 'var(--accent)';
        }

        nextBtn.addEventListener('click', () => {
            if (currentStep < 4) {
                // Collect data from inputs before moving
                if (currentStep === 2) {
                    formData.cgpa = document.getElementById('form-cgpa').value;
                    formData.yearStudy = document.getElementById('form-year').value;
                    formData.annualIncome = document.getElementById('form-income').value;
                }
                currentStep++;
                updateUI();
            } else {
                // Submit logic
                if (document.getElementById('declaration-check').checked) {
                    store.applications.push({
                        id: `APP-00${store.applications.length + 1}`,
                        scholarshipName: formData.scholarshipName,
                        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                        status: 'Pending'
                    });
                    alert('Application submitted successfully!');
                    window.location.hash = '#student/dashboard';
                } else {
                    alert('Please check the declaration box.');
                }
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateUI();
            }
        });

        updateUI();
    }, 0);

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container" style="max-width: 800px; margin: 0 auto;">
                    <div style="text-align: center; margin-bottom: var(--space-xl);">
                        <h1 style="margin-bottom: 8px;">Scholarship Application</h1>
                        <p style="color: var(--text-secondary);">Apply for ${scholarship?.name || 'Scholarship'}</p>
                        
                        <!-- Step Indicator -->
                        <div style="display: flex; justify-content: center; align-items: center; gap: 40px; margin-top: 32px; position: relative;">
                            <div style="position: absolute; top: 15px; left: 15%; right: 15%; height: 2px; background: var(--border); z-index: 1;"></div>
                            ${[1,2,3,4].map(i => `
                                <div style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                                    <div class="step-bubble" style="width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; font-weight: 700; font-size: 0.8rem; background: var(--border); transition: all 0.3s;">${i}</div>
                                    <span style="font-size: 0.7rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Step ${i}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="card" style="padding: var(--space-xl);">
                        <div id="step-content" style="min-height: 250px;"></div>
                        
                        <div id="form-footer" style="display: flex; justify-content: space-between; margin-top: var(--space-xl); padding-top: var(--space-md); border-top: 1px solid var(--border);">
                            <button id="prev-btn" style="background: var(--neutral-bg); padding: 12px 24px;">← Back</button>
                            <button id="next-btn" style="background: var(--accent); color: white; padding: 12px 32px; margin-left: auto;">Next →</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
