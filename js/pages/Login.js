// js/pages/Login.js
import { signIn } from '../services/authService.js';
import { showToast } from '../utils.js';

export function LoginPage() {
    setTimeout(() => {
        const form    = document.getElementById('login-form');
        const emailEl = document.getElementById('login-email');
        const passEl  = document.getElementById('login-password');
        const btnEl   = document.getElementById('login-submit');
        const errEl   = document.getElementById('login-error');

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            errEl.style.display = 'none';
            btnEl.disabled      = true;
            btnEl.textContent   = 'Signing in…';

            try {
                const { user } = await signIn(emailEl.value.trim(), passEl.value);
                showToast('Welcome back!', 'success');
                // router will handle redirect via hashchange + initializeSession
                window.location.hash = '#student/dashboard'; // temporary; router re-routes by role
            } catch (err) {
                errEl.textContent    = err.message || 'Invalid credentials. Please try again.';
                errEl.style.display  = 'block';
            } finally {
                btnEl.disabled     = false;
                btnEl.textContent  = 'Sign In';
            }
        });
    }, 0);

    return `
        <div style="width:100%;display:flex;align-items:center;justify-content:center;background:#fafafa;min-height:100vh;padding:24px;">
            <div class="card" style="width:100%;max-width:440px;padding:48px;text-align:center;border:1px solid var(--border);box-shadow:0 20px 50px rgba(0,0,0,0.05);">

                <div style="margin-bottom:40px;">
                    <div style="width:72px;height:72px;background:var(--primary);color:white;border-radius:20px;display:grid;place-items:center;margin:0 auto 20px;font-size:2.5rem;font-weight:800;font-family:'Outfit';box-shadow:0 10px 20px rgba(91,13,27,0.2);">E</div>
                    <h1 style="font-size:1.75rem;font-family:'Outfit';margin:0;letter-spacing:-0.5px;">EduGrant Portal</h1>
                    <p style="color:var(--text-secondary);font-size:0.9rem;margin-top:4px;">Scholarship &amp; Eligibility Management</p>
                </div>

                <form id="login-form" style="text-align:left;display:flex;flex-direction:column;gap:20px;">
                    <div class="form-group">
                        <label>Email Address</label>
                        <input id="login-email" type="email" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <label>Password</label>
                            <a href="#" style="font-size:0.8rem;font-weight:700;">Forgot?</a>
                        </div>
                        <input id="login-password" type="password" placeholder="••••••••" required>
                    </div>

                    <div id="login-error" style="display:none;background:#fef2f2;border:1px solid #fca5a5;color:#b91c1c;padding:10px 14px;border-radius:8px;font-size:0.85rem;font-weight:600;"></div>

                    <button id="login-submit" type="submit" style="background:var(--primary);color:white;padding:14px;font-weight:700;width:100%;margin-top:8px;">Sign In</button>

                    New student? <a href="#signup" style="color:var(--primary);font-weight:700;">Create Account</a>
                </div>
            </div>
        </div>
    `;
}
