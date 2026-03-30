// js/pages/Login.js
import { store, login } from '../store.js';

export function LoginPage() {
    setTimeout(() => {
        const studentBtn = document.getElementById('login-student');
        const staffBtn = document.getElementById('login-staff');
        const adminBtn = document.getElementById('login-admin');

        studentBtn?.addEventListener('click', () => { login('student'); window.location.hash = '#student/dashboard'; });
        staffBtn?.addEventListener('click', () => { login('staff'); window.location.hash = '#staff/dashboard'; });
        adminBtn?.addEventListener('click', () => { login('admin'); window.location.hash = '#admin/dashboard'; });

        const loginForm = document.getElementById('login-form');
        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            login('student');
            window.location.hash = '#student/dashboard';
        });
    }, 0);

    return `
        <div style="width: 100%; display: flex; align-items: center; justify-content: center; background: #fafafa; min-height: 100vh; padding: 24px;">
            <div class="card" style="width: 100%; max-width: 440px; padding: 48px; text-align: center; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.05);">
                <div style="margin-bottom: 40px;">
                    <div style="width: 72px; height: 72px; background: var(--primary); color: white; border-radius: 20px; display: grid; place-items: center; margin: 0 auto 20px; font-size: 2.5rem; font-weight: 800; font-family: 'Outfit'; box-shadow: 0 10px 20px rgba(91, 13, 27, 0.2);">E</div>
                    <h1 style="font-size: 1.75rem; font-family: 'Outfit'; margin: 0; letter-spacing: -0.5px;">EduGrant Portal</h1>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">Scholarship & Eligibility Management</p>
                </div>

                <form id="login-form" style="text-align: left; display: flex; flex-direction: column; gap: 20px;">
                    <div class="form-group">
                        <label>Email / Register Number</label>
                        <input type="text" placeholder="Enter your ID" required>
                    </div>
                    <div class="form-group">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <label>Password</label>
                            <a href="#" style="font-size: 0.8rem; font-weight: 700;">Forgot?</a>
                        </div>
                        <input type="password" placeholder="••••••••" required>
                    </div>
                    <button type="submit" style="background: var(--primary); color: white; padding: 14px; font-weight: 700; width: 100%; margin-top: 8px;">Sign In</button>
                </form>

                <div style="margin: 32px 0; position: relative;">
                    <hr style="border: none; border-top: 1px solid var(--border);">
                    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 0 16px; color: var(--text-secondary); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Quick Login</span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button id="login-student" style="background: white; border: 1px solid var(--border); padding: 12px; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;"><span>🎓</span> Student</button>
                        <button id="login-admin" style="background: white; border: 1px solid var(--border); padding: 12px; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;"><span>🛡️</span> Admin</button>
                    </div>
                    <button id="login-staff" style="width: 100%; background: white; border: 1px solid var(--border); padding: 12px; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;"><span>💼</span> Office Staff</button>
                </div>

                <div style="margin-top: 32px; font-size: 0.9rem; color: var(--text-secondary);">
                    New student? <a href="#signup" style="color: var(--primary); font-weight: 700;">Create Account</a>
                </div>
            </div>
        </div>
    `;
}

