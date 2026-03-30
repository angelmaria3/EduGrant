// js/pages/student/Profile.js
import { store, updateStudentProfile } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';
import { showToast } from '../../utils.js';

export async function ProfilePage() {
    const student = store.user.data;

    setTimeout(() => {
        const form = document.getElementById('profile-form');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                dob: formData.get('dob'),
                gender: formData.get('gender'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                department: formData.get('department'),
                category: formData.get('category'),
                annualIncome: parseInt(formData.get('annualIncome') || '0')
            };
            
            updateStudentProfile(data);
            showToast('Profile updated successfully!', 'success');
        });
    }, 0);

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px;">
                        
                        <!-- Left Column: Forms & Details -->
                        <div style="display: flex; flex-direction: column; gap: 32px;">
                            
                            <form id="profile-form">
                                <div class="card">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                                        <h3 style="margin: 0; font-family: 'Outfit';">Personal & Financial Details</h3>
                                        <button type="submit" style="background: var(--primary); color: white; padding: 10px 24px; font-size: 0.85rem;">Save Changes</button>
                                    </div>

                                    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 24px;">
                                        <div class="form-group">
                                            <label>Full Name</label>
                                            <input type="text" name="name" value="${student.name}" required>
                                        </div>
                                        <div class="form-group">
                                            <label>Register Number</label>
                                            <input type="text" value="${student.registerNumber}" disabled style="background: #f5f5f5;">
                                        </div>
                                        <div class="form-group">
                                            <label>Department</label>
                                            <input type="text" name="department" value="${student.department}" required>
                                        </div>
                                        <div class="form-group">
                                            <label>Email Address</label>
                                            <input type="email" name="email" value="${student.email}" required>
                                        </div>
                                        <div class="form-group">
                                            <label>Category</label>
                                            <select name="category">
                                                <option value="General" ${student.category === 'General' ? 'selected' : ''}>General</option>
                                                <option value="OBC" ${student.category === 'OBC' ? 'selected' : ''}>OBC</option>
                                                <option value="SC/ST" ${student.category === 'SC/ST' ? 'selected' : ''}>SC/ST</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label>Annual Family Income (₹)</label>
                                            <input type="number" name="annualIncome" value="${student.annualIncome}" required>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <!-- Academic Semester-wise CGPA Grid -->
                            <div class="card">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                                    <h3 style="margin: 0; font-family: 'Outfit';">Academic Performance</h3>
                                    <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary);">Total CGPA: ${student.cgpa}</div>
                                </div>
                                <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px;">
                                    ${student.semesterWiseCgpa.map(sem => `
                                        <div style="padding: 16px; background: ${sem.gpa ? 'rgba(91, 13, 27, 0.03)' : '#fcfcfc'}; border: 1px solid var(--border); border-radius: 12px; text-align: center;">
                                            <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; text-transform: uppercase;">Semester ${sem.sem}</div>
                                            <div style="font-size: 1.25rem; font-family: 'Outfit'; font-weight: 700; color: ${sem.gpa ? 'var(--primary)' : '#ccc'};">
                                                ${sem.gpa || '—'}
                                            </div>
                                            ${!sem.gpa ? `<div style="font-size: 0.6rem; color: var(--warning); font-weight: 600; margin-top: 4px;">Pending</div>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                                <div style="margin-top: 24px; padding: 12px; background: #fff9e6; border-radius: 8px; font-size: 0.85rem; color: #856404; display: flex; gap: 10px;">
                                    <span>💡</span>
                                    <span>Semester 5 marks are currently being verified by office staff.</span>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Security & Summary -->
                        <div style="display: flex; flex-direction: column; gap: 32px;">
                            <div class="card" style="text-align: center; background: linear-gradient(135deg, var(--primary), #8B1E3F); color: white;">
                                <div style="width: 100px; height: 100px; border-radius: 30px; background: rgba(255,255,255,0.2); margin: 0 auto 20px; display: grid; place-items: center; font-size: 3rem; font-weight: 800;">
                                    ${student.name.charAt(0)}
                                </div>
                                <h2 style="color: white; margin-bottom: 4px;">${student.name}</h2>
                                <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-bottom: 24px;">Member since June 2021</p>
                                <div style="display: flex; justify-items: center; gap: 8px; justify-content: center;">
                                    <span class="badge" style="background: rgba(255,255,255,0.1); color: white;">Verified Student</span>
                                    <span class="badge" style="background: rgba(255,255,255,0.1); color: white;">Year ${student.yearStudy}</span>
                                </div>
                            </div>

                            <div class="card">
                                <h3 style="margin-bottom: 20px; font-family: 'Outfit';">Account Security</h3>
                                <div style="display: flex; flex-direction: column; gap: 12px;">
                                    <button style="width: 100%; text-align: left; padding: 14px; background: #F8F9FA; border: 1px solid var(--border); border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                                        <div style="display: flex; align-items: center; gap: 12px;">
                                            <span>🔑</span>
                                            <span style="font-weight: 600; font-size: 0.9rem;">Change Password</span>
                                        </div>
                                        <span style="color: #ccc;">→</span>
                                    </button>
                                    <button style="width: 100%; text-align: left; padding: 14px; background: #F8F9FA; border: 1px solid var(--border); border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                                        <div style="display: flex; align-items: center; gap: 12px;">
                                            <span>📱</span>
                                            <span style="font-weight: 600; font-size: 0.9rem;">Two-Factor Auth</span>
                                        </div>
                                        <span style="color: var(--success); font-weight: 700; font-size: 0.75rem;">ENABLED</span>
                                    </button>
                                    <button style="width: 100%; text-align: left; padding: 14px; background: #fff5f5; border: 1px solid #ffebeb; border-radius: 12px; margin-top: 12px;">
                                        <div style="display: flex; align-items: center; gap: 12px; color: var(--danger);">
                                            <span>⚠️</span>
                                            <span style="font-weight: 600; font-size: 0.9rem;">Request Account Deletion</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    `;
}

