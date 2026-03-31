// js/pages/Signup.js
import { supabase } from '../supabaseClient.js';
import { showToast } from '../utils.js';

export function SignupPage() {
    setTimeout(() => {
        const form  = document.getElementById('signup-form');
        const errEl = document.getElementById('signup-error');
        const btnEl = document.getElementById('signup-submit');

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            errEl.style.display = 'none';
            btnEl.disabled      = true;
            btnEl.textContent   = 'Creating account…';

            const fd = new FormData(form);
            const email    = fd.get('email').trim();
            const password = fd.get('password');
            const confirm  = fd.get('confirm');

            if (password !== confirm) {
                errEl.textContent   = 'Passwords do not match.';
                errEl.style.display = 'block';
                btnEl.disabled      = false;
                btnEl.textContent   = 'Complete Registration';
                return;
            }
            if (password.length < 6) {
                errEl.textContent   = 'Password must be at least 6 characters.';
                errEl.style.display = 'block';
                btnEl.disabled      = false;
                btnEl.textContent   = 'Complete Registration';
                return;
            }

            try {
                // 1. Create auth user
                const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password });
                if (authErr) throw authErr;

                const userId = authData.user?.id;
                if (!userId) throw new Error('Signup succeeded but no user ID returned. Email confirmation may be enabled — please disable it in Supabase Auth settings.');

                // 2. Insert student profile row
                const { error: profileErr } = await supabase.from('student').insert({
                    auth_user_id:         userId,
                    email:                email,
                    name:                 fd.get('name').trim(),
                    register_number:      fd.get('regNo').trim(),
                    dob:                  fd.get('dob'),
                    gender:               fd.get('gender'),
                    phone:                fd.get('phone')?.trim() || null,
                    department:           fd.get('dept').trim(),
                    year_study:           parseInt(fd.get('yearStudy')) || 1,
                    
                    category:             fd.get('category'),
                    cgpa:                 parseFloat(fd.get('cgpa')) || 0,
                    annual_income:        parseFloat(fd.get('income')) || 0,
                    
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
                });
                if (profileErr) throw profileErr;

                showToast('Account created! Welcome to EduGrant 🎓', 'success');
                window.location.hash = '#student/dashboard';

            } catch (err) {
                console.error(err);
                errEl.textContent   = err.message || 'Registration failed. Please try again.';
                errEl.style.display = 'block';
            } finally {
                btnEl.disabled    = false;
                btnEl.textContent = 'Complete Registration';
            }
        });
    }, 0);

    return `
        <div style="width:100%;min-height:100vh;background:var(--neutral-bg);display:grid;place-items:center;padding:40px 20px;">
            <div class="card" style="width:100%;max-width:800px;padding:40px;">
                <div style="text-align:center;margin-bottom:32px;">
                    <div style="width:60px;height:60px;background:var(--primary);color:white;border-radius:16px;display:grid;place-items:center;margin:0 auto 16px;font-size:2rem;font-weight:800;">E</div>
                    <h1 style="color:var(--primary);margin-bottom:8px;">Create Account</h1>
                    <p style="color:var(--text-secondary);">Join EduGrant — fill in your comprehensive academic profile</p>
                </div>

                <form id="signup-form">
                    <!-- Personal Info -->
                    <h3 style="font-size:1rem;margin-bottom:16px;color:var(--primary);border-bottom:1px solid var(--border);padding-bottom:8px;">1. Personal Details</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:32px;">
                        <div class="form-group"><label>Full Name *</label><input type="text" name="name" placeholder="e.g. Anjali R." required></div>
                        <div class="form-group"><label>Register Number *</label><input type="text" name="regNo" placeholder="e.g. 2024CS001" required></div>
                        <div class="form-group"><label>Email Address *</label><input type="email" name="email" placeholder="email@example.com" required></div>
                        <div class="form-group"><label>Phone</label><input type="tel" name="phone" placeholder="9876543210"></div>
                        <div class="form-group"><label>Date of Birth *</label><input type="date" name="dob" required></div>
                        <div class="form-group"><label>Gender *</label>
                            <select name="gender" required><option value="">Select…</option><option value="Female">Female</option><option value="Male">Male</option><option value="Other">Other</option></select>
                        </div>
                        <div class="form-group"><label>Religion *</label>
                            <select name="religion" required>
                                <option value="">Select Religion…</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Muslim">Muslim</option>
                                <option value="Christian">Christian</option>
                                <option value="Sikh">Sikh</option>
                                <option value="Buddhist">Buddhist</option>
                                <option value="Jain">Jain</option>
                                <option value="Parsi">Parsi</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group"><label>State of Domicile *</label>
                            <input type="text" name="state_of_domicile" placeholder="e.g. Kerala" required>
                        </div>
                    </div>

                    <!-- Academic Info -->
                    <h3 style="font-size:1rem;margin-bottom:16px;color:var(--primary);border-bottom:1px solid var(--border);padding-bottom:8px;">2. Academic Information</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:32px;">
                        <div class="form-group"><label>Course Level *</label>
                            <select name="course_level" required><option value="">Select…</option><option value="UG">Undergraduate (UG)</option><option value="PG">Postgraduate (PG)</option><option value="Diploma">Diploma</option></select>
                        </div>
                        <div class="form-group"><label>Course Stream/Type *</label>
                            <select name="course_type" required><option value="">Select…</option><option value="Technical">Technical/Engineering</option><option value="Science">Pure Science</option><option value="Arts">Arts</option><option value="Commerce">Commerce</option><option value="Other">Other</option></select>
                        </div>
                        <div class="form-group"><label>Department *</label><input type="text" name="dept" placeholder="e.g. Computer Science" required></div>
                        <div class="form-group"><label>Year of Study *</label>
                            <select name="yearStudy" required><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option></select>
                        </div>
                        <div class="form-group"><label>Admission Type *</label>
                            <select name="admission_type" required><option value="">Select…</option><option value="Merit">Govt Merit Quota</option><option value="Management">Management Quota</option><option value="NRI">NRI Quota</option></select>
                        </div>
                        <div class="form-group"><label>12th Standard Marks % *</label>
                            <input type="number" step="0.01" min="0" max="100" name="marks_12" placeholder="e.g. 95.5" required>
                        </div>
                        <div class="form-group"><label>Current UG/PG CGPA *</label>
                            <input type="number" step="0.01" min="0" max="10" name="cgpa" placeholder="e.g. 8.1" required>
                        </div>
                    </div>

                    <!-- Financial & Eligibility Context -->
                    <h3 style="font-size:1rem;margin-bottom:16px;color:var(--primary);border-bottom:1px solid var(--border);padding-bottom:8px;">3. Concessions Setup</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:32px;">
                        <div class="form-group"><label>Caste Category *</label>
                            <select name="category" required><option value="">Select…</option><option value="General">General</option><option value="EWS">EWS</option><option value="OBC">OBC/OEC</option><option value="SC">SC</option><option value="ST">ST</option></select>
                        </div>
                        <div class="form-group"><label>Annual Family Income (₹) *</label>
                            <input type="number" name="income" placeholder="e.g. 180000" required>
                        </div>
                        <div class="form-group"><label>Disability Percentage (%)</label>
                            <input type="number" name="disability_percentage" placeholder="0 if none" value="0" min="0" max="100">
                        </div>
                        <div class="form-group"><label>Sports Quota Certification</label>
                            <select name="sports_quota"><option value="None">No certification</option><option value="State">State Level Player</option><option value="National">National Level</option><option value="International">International</option></select>
                        </div>
                        <div class="form-group"><label>Siblings Studying in Same College</label>
                            <input type="number" name="siblings_in_college" value="0" min="0" max="10">
                        </div>
                        <div class="form-group" style="display:flex;align-items:center;gap:12px;margin-top:20px;">
                            <input type="checkbox" name="tfw_seat" id="t-tfw" style="width:18px;height:18px;">
                            <label for="t-tfw" style="margin:0;cursor:pointer;">Admitted via TFW (Tuition Fee Waiver)</label>
                        </div>
                        <div class="form-group" style="display:flex;align-items:center;gap:12px;margin-top:20px;">
                            <input type="checkbox" name="financial_crisis" id="t-fin" style="width:18px;height:18px;">
                            <label for="t-fin" style="margin:0;cursor:pointer;">Experiencing extreme financial crisis</label>
                        </div>
                    </div>

                    <!-- Password -->
                    <h3 style="font-size:1rem;margin-bottom:16px;color:var(--primary);border-bottom:1px solid var(--border);padding-bottom:8px;">4. Set Password</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
                        <div class="form-group"><label>Password *</label><input type="password" name="password" placeholder="Min 6 characters" required></div>
                        <div class="form-group"><label>Confirm Password *</label><input type="password" name="confirm" placeholder="Re-enter password" required></div>
                    </div>

                    <div id="signup-error" style="display:none;background:#fef2f2;border:1px solid #fca5a5;color:#b91c1c;padding:12px 16px;border-radius:8px;font-size:0.85rem;font-weight:600;margin-bottom:16px;"></div>

                    <button id="signup-submit" type="submit" style="width:100%;background:var(--primary);color:white;padding:14px;font-weight:700;font-size:1rem;">Complete Registration</button>

                    <div style="text-align:center;margin-top:20px;font-size:0.9rem;color:var(--text-secondary);">
                        Already have an account? <a href="#login" style="color:var(--primary);font-weight:700;">Login here</a>
                    </div>
                </form>
            </div>
        </div>
    `;
}
