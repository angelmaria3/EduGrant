// js/pages/student/Profile.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { updateStudentProfile } from '../../services/studentService.js';
import { showToast } from '../../utils.js';

export async function ProfilePage() {
    const student = store.user.data;
    if (!student) { window.location.hash = '#login'; return ''; }

    setTimeout(() => {
        document.getElementById('profile-form')?.addEventListener('submit', async e => {
            e.preventDefault();
            const fd  = new FormData(e.target);
            const btn = document.getElementById('save-btn');
            btn.disabled = true; btn.textContent = 'Saving…';

            const updates = {
                name:                 fd.get('name').trim(),
                phone:                fd.get('phone').trim() || null,
                department:           fd.get('department').trim(),
                year_study:           parseInt(fd.get('year_study')),
                category:             fd.get('category'),
                cgpa:                 parseFloat(fd.get('cgpa')) || 0,
                annual_income:        parseFloat(fd.get('annual_income')) || 0,
                
                course_level:         fd.get('course_level'),
                course_type:          fd.get('course_type'),
                marks_12:             parseFloat(fd.get('marks_12')) || 0,
                disability_percentage:parseInt(fd.get('disability_percentage')) || 0,
                religion:             fd.get('religion'),
                state_of_domicile:    fd.get('state_of_domicile'),
                
                admission_type:       fd.get('admission_type'),
                tfw_seat:             fd.get('tfw_seat') === 'on',
                sports_quota:         fd.get('sports_quota'),
                siblings_in_college:  parseInt(fd.get('siblings_in_college')) || 0,
                financial_crisis:     fd.get('financial_crisis') === 'on'
            };

            try {
                await updateStudentProfile(student.student_id, updates);
                Object.assign(store.user.data, updates);
                store.user.name = updates.name;
                showToast('Detailed profile updated successfully!', 'success');
            } catch (err) {
                showToast(err.message || 'Update failed.', 'error');
            } finally {
                btn.disabled = false; btn.textContent = '💾 Save Changes';
            }
        });
    }, 0);

    const s = student;
    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container" style="max-width:900px;margin:0 auto;">
                    <div style="margin-bottom:32px;">
                        <h1 style="font-size:2rem;margin:0;">Detailed Profile</h1>
                        <p style="color:var(--text-secondary);margin-top:4px;">Keep these metrics accurate to unlock accurate scholarships, fee waivers &amp; concessions.</p>
                    </div>

                    <form id="profile-form">
                        <div style="display:grid;grid-template-columns:1fr;gap:20px;">
                            <!-- Top locked info -->
                            <div class="card" style="display:flex;gap:24px;align-items:center;">
                                <div style="width:80px;height:80px;border-radius:50%;background:var(--primary);color:white;display:grid;place-items:center;font-size:2rem;font-weight:700;flex-shrink:0;">
                                    ${(s.name || 'S').charAt(0)}
                                </div>
                                <div style="flex:1;">
                                    <h3 style="margin:0;">${s.name || 'Student'}</h3>
                                    <div style="color:var(--text-secondary);font-size:0.9rem;">${s.register_number} • ${s.email}</div>
                                </div>
                                <div style="text-align:right;">
                                    <div style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;font-weight:700;">Date of Birth</div>
                                    <div style="font-weight:700;">${s.dob || '—'}</div>
                                </div>
                            </div>

                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                                <!-- Column 1 -->
                                <div style="display:flex;flex-direction:column;gap:20px;">
                                    <div class="card">
                                        <h3 style="margin-bottom:20px;font-size:1rem;color:var(--primary);">Identity & Demographics</h3>
                                        <div class="form-group"><label>Full Name</label><input type="text" name="name" value="${s.name || ''}" required></div>
                                        <div class="form-group"><label>Phone</label><input type="tel" name="phone" value="${s.phone || ''}"></div>
                                        <div class="form-group"><label>Religion</label>
                                            <select name="religion">
                                                ${['Hindu','Muslim','Christian','Sikh','Buddhist','Jain','Parsi','Other'].map(cat => `<option value="${cat}" ${s.religion===cat?'selected':''}>${cat}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="form-group"><label>Caste Category</label>
                                            <select name="category" required>
                                                ${['General','EWS','OBC','SC','ST'].map(c=>`<option value="${c}" ${s.category===c?'selected':''}>${c}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="form-group"><label>State of Domicile</label><input type="text" name="state_of_domicile" value="${s.state_of_domicile || ''}"></div>
                                    </div>

                                    <div class="card">
                                        <h3 style="margin-bottom:20px;font-size:1rem;color:var(--primary);">Financial & Special Cases</h3>
                                        <div class="form-group"><label>Annual Family Income (₹)</label><input type="number" name="annual_income" value="${s.annual_income || ''}" required></div>
                                        <div class="form-group"><label>Disability Percentage (%)</label><input type="number" name="disability_percentage" value="${s.disability_percentage || 0}" min="0" max="100"></div>
                                        <div class="form-group"><label>Sports Quota</label>
                                            <select name="sports_quota">
                                                ${['None','State','National','International'].map(sq=>`<option value="${sq}" ${s.sports_quota===sq?'selected':''}>${sq}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="form-group"><label>Siblings Studying Here</label><input type="number" name="siblings_in_college" value="${s.siblings_in_college || 0}" min="0" max="10"></div>
                                        <div class="form-group" style="display:flex;align-items:center;gap:12px;margin-top:10px;">
                                            <input type="checkbox" name="financial_crisis" id="p-fcry" style="width:18px;height:18px;" ${s.financial_crisis ? 'checked' : ''}>
                                            <label for="p-fcry" style="margin:0;cursor:pointer;">Experiencing financial crisis</label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Column 2 -->
                                <div style="display:flex;flex-direction:column;gap:20px;">
                                    <div class="card">
                                        <h3 style="margin-bottom:20px;font-size:1rem;color:var(--primary);">College Academics</h3>
                                        <div class="form-group"><label>Department</label><input type="text" name="department" value="${s.department || ''}" required></div>
                                        <div class="form-group"><label>Course Level</label>
                                            <select name="course_level" required>
                                                ${['UG','PG','Diploma'].map(lvl=>`<option value="${lvl}" ${s.course_level===lvl?'selected':''}>${lvl}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="form-group"><label>Course Type</label>
                                            <select name="course_type" required>
                                                ${['Technical','Science','Arts','Commerce','Other'].map(t=>`<option value="${t}" ${s.course_type===t?'selected':''}>${t}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="form-group"><label>Year of Study</label>
                                            <select name="year_study" required>
                                                ${[1,2,3,4].map(y=>`<option value="${y}" ${s.year_study==y?'selected':''}>Year ${y}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="form-group"><label>Current CGPA</label><input type="number" name="cgpa" step="0.01" min="0" max="10" value="${s.cgpa || ''}" required></div>
                                    </div>

                                    <div class="card">
                                        <h3 style="margin-bottom:20px;font-size:1rem;color:var(--primary);">Past Merit & Admission</h3>
                                        <div class="form-group"><label>12th Standard Marks (%)</label><input type="number" name="marks_12" step="0.01" min="0" max="100" value="${s.marks_12 || ''}"></div>
                                        <div class="form-group"><label>Admission Type</label>
                                            <select name="admission_type">
                                                ${['Merit','Management','NRI'].map(at=>`<option value="${at}" ${s.admission_type===at?'selected':''}>${at}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="form-group" style="display:flex;align-items:center;gap:12px;margin-top:10px;">
                                            <input type="checkbox" name="tfw_seat" id="p-tfws" style="width:18px;height:18px;" ${s.tfw_seat ? 'checked' : ''}>
                                            <label for="p-tfws" style="margin:0;cursor:pointer;">Admitted via TFW (Tuition Fee Waiver)</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:12px;">
                                <button type="button" onclick="window.location.hash='#student/dashboard'" style="background:var(--neutral-bg);border:1px solid var(--border);padding:12px 24px;">Cancel</button>
                                <button id="save-btn" type="submit" style="background:var(--primary);color:white;padding:12px 32px;font-weight:700;">💾 Save Complete Profile</button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    `;
}
