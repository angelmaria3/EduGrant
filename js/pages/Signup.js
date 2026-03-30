// js/pages/Signup.js
import { signup, store } from '../store.js';
import { showToast } from '../utils.js';

export async function SignupPage() {
    setTimeout(() => {
        const form = document.getElementById('signup-form');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const studentData = {
                name: formData.get('name'),
                registerNumber: formData.get('regNo'),
                email: formData.get('email'),
                department: formData.get('dept'),
                category: formData.get('category'),
                cgpa: parseFloat(formData.get('cgpa')) || null,
                annualIncome: parseInt(formData.get('income')) || null,
                dob: formData.get('dob'),
                gender: formData.get('gender'),
                phone: formData.get('phone')
            };

            const success = signup(studentData);
            if (success) {
                showToast('Account created successfully!', 'success');
                window.location.hash = '#student/dashboard';
            }
        });
    }, 0);

    return `
        <div style="min-height: 100vh; background: var(--neutral-bg); display: grid; place-items: center; padding: 40px 20px;">
            <div class="card" style="width: 100%; max-width: 600px; padding: 40px;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="color: var(--primary); margin-bottom: 8px;">Create Account</h1>
                    <p style="color: var(--text-secondary);">Join EduGrant by providing your details</p>
                </div>

                <form id="signup-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" placeholder="e.g. Rahul Sharma" required>
                        </div>
                        <div class="form-group">
                            <label>Register Number</label>
                            <input type="text" name="regNo" placeholder="e.g. 2024CS001" required>
                        </div>
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" name="email" placeholder="email@example.com" required>
                        </div>
                        <div class="form-group">
                            <label>Department</label>
                            <input type="text" name="dept" placeholder="e.g. CSE" required>
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select name="category" required>
                                <option value="General">General</option>
                                <option value="OBC">OBC</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Date of Birth</label>
                            <input type="date" name="dob" required>
                        </div>
                        
                        <div style="grid-column: span 2; border-top: 1px solid var(--border); padding-top: 20px; margin-top: 10px;">
                            <h3 style="font-size: 1rem; margin-bottom: 15px;">Eligibility Details</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div class="form-group">
                                    <label>Current CGPA</label>
                                    <input type="number" step="0.01" name="cgpa" placeholder="Required for scholarships" required>
                                </div>
                                <div class="form-group">
                                    <label>Annual Income (₹)</label>
                                    <input type="number" name="income" placeholder="Required for scholarships" required>
                                </div>
                            </div>
                            <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 8px;">
                                * These values are used to calculate your scholarship eligibility.
                            </p>
                        </div>
                    </div>

                    <button type="submit" style="width: 100%; background: var(--primary); color: white; padding: 14px; font-weight: 700; font-size: 1rem;">Complete Registration</button>
                    
                    <div style="text-align: center; margin-top: 20px; font-size: 0.9rem; color: var(--text-secondary);">
                        Already have an account? <a href="#login" style="color: var(--primary); font-weight: 700;">Login here</a>
                    </div>
                </form>
            </div>
        </div>
    `;
}
