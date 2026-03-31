// js/pages/admin/Eligibility.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getAllScholarships, createScholarship, createEligibilityCriteria, deleteScholarship } from '../../services/scholarshipService.js';
import { showToast } from '../../utils.js';
import { navigate } from '../../router.js';

export async function EligibilityManagementPage() {
    if (store.user.role !== 'admin') { window.location.hash = '#admin/dashboard'; return ''; }

    const scholarships = await getAllScholarships().catch(() => []);
    const typeColor = { merit: '#1A3C6E', need: '#E67E22', category_based: '#8E44AD', fee_concession: '#27AE60', disability_based: '#6c7a89', gender_based: '#f1629d', religion_based: '#16a085' };

    const cards = scholarships.map(s => {
        const c = s.eligibility_criteria?.[0];
        
        let reqs = [];
        if (c) {
            if (c.min_cgpa > 0) reqs.push(`CGPA ≥ ${c.min_cgpa}`);
            if (c.max_income < 9999999) reqs.push(`Income ≤ ₹${c.max_income.toLocaleString()}`);
            if (c.eligible_category) reqs.push(`Category: ${c.eligible_category}`);
            if (c.min_marks_12 > 0) reqs.push(`12th: ≥ ${c.min_marks_12}%`);
            if (c.req_course_level) reqs.push(`Level: ${c.req_course_level}`);
            if (c.req_course_type) reqs.push(`Course: ${c.req_course_type}`);
            if (c.req_gender) reqs.push(`Gender: ${c.req_gender}`);
            if (c.min_disability > 0) reqs.push(`Disabled: ≥ ${c.min_disability}%`);
            if (c.req_religion) reqs.push(`Religion: ${c.req_religion.substring(0,25)}...`);
            if (c.req_state) reqs.push(`State: ${c.req_state}`);
            if (c.req_admission_type) reqs.push(`Adm: ${c.req_admission_type}`);
            if (c.req_tfw) reqs.push(`Required TFW Seat`);
            if (c.req_sports) reqs.push(`Sports: ${c.req_sports}`);
            if (c.min_siblings > 0) reqs.push(`Siblings Req`);
        }

        return `
        <div class="card" style="border-left:5px solid ${typeColor[s.type]||'var(--primary)'};">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
                <div>
                    <span style="background:${typeColor[s.type]||'var(--primary)'}20;color:${typeColor[s.type]||'var(--primary)'};padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:700;text-transform:uppercase;">${s.type?.replace('_',' ')}</span>
                    <h3 style="margin:8px 0 4px;">${s.scholarship_name}</h3>
                    <p style="color:var(--text-secondary);font-size:0.85rem;">${s.provider} · ${s.is_percentage ? `${s.amount}% Fee Concession` : `₹${Number(s.amount).toLocaleString()}/year`}</p>
                </div>
                <button class="del-btn" data-id="${s.scholarship_id}" style="background:var(--danger);color:white;padding:5px 10px;font-size:0.75rem;border-radius:6px;">🗑 Delete</button>
            </div>
            ${c && reqs.length > 0 ? `
            <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:0.78rem;padding:12px;background:var(--neutral-bg);border-radius:8px;">
                ${reqs.map(r => `<span style="background:white;padding:4px 8px;border-radius:4px;border:1px solid var(--border);">● ${r}</span>`).join('')}
            </div>` : '<p style="font-size:0.82rem;color:var(--warning);">⚠️ No eligibility criteria defined / Open to all</p>'}
        </div>`;
    }).join('');

    setTimeout(() => {
        const togglePct = document.getElementById('type-toggle');
        const amountLbl = document.getElementById('amount-label');
        if (togglePct) {
            togglePct.addEventListener('change', () => {
                if (togglePct.value === 'fee_concession') amountLbl.textContent = 'Concession % (0-100) *';
                else amountLbl.textContent = 'Amount (₹) *';
            });
        }

        document.querySelectorAll('.del-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Delete this scholarship completely?')) return;
                btn.disabled = true; btn.textContent = '…';
                try {
                    await deleteScholarship(btn.dataset.id);
                    showToast('Deleted.', 'success');
                    navigate();
                } catch (err) { showToast(err.message, 'error'); btn.disabled = false; }
            });
        });

        document.getElementById('create-form')?.addEventListener('submit', async e => {
            e.preventDefault();
            const fd  = new FormData(e.target);
            const btn = document.getElementById('create-btn');
            btn.disabled = true; btn.textContent = 'Creating…';
            try {
                const type = fd.get('type');
                const isPct = type === 'fee_concession';
                
                const sch = await createScholarship({
                    scholarship_name: fd.get('scholarship_name')?.trim() || '',
                    description:      fd.get('description')?.trim() || '',
                    amount:           parseFloat(fd.get('amount')) || 0,
                    is_percentage:    isPct,
                    provider:         fd.get('provider')?.trim() || '',
                    type:             type,
                    applicable_year:  parseInt(fd.get('applicable_year'))
                });
                await createEligibilityCriteria({
                    scholarship_id:       sch.scholarship_id,
                    min_cgpa:             parseFloat(fd.get('min_cgpa')) || 0,
                    max_income:           parseFloat(fd.get('max_income')) || 99999999,
                    eligible_category:    fd.get('eligible_category') || null,
                    min_marks_12:         parseFloat(fd.get('min_marks_12')) || 0,
                    req_course_level:     fd.get('req_course_level') || null,
                    req_course_type:      fd.get('req_course_type') || null,
                    req_gender:           fd.get('req_gender') || null,
                    min_disability:       parseInt(fd.get('min_disability')) || 0,
                    req_religion:         fd.get('req_religion') || null,
                    req_state:            fd.get('req_state') || null,
                    req_admission_type:   fd.get('req_admission_type') || null,
                    req_tfw:              fd.get('req_tfw') === 'on',
                    req_sports:           fd.get('req_sports') || null,
                    min_siblings:         parseInt(fd.get('min_siblings')) || 0,
                    req_crisis:           fd.get('req_crisis') === 'on'
                });
                showToast('Scheme generated with rules.', 'success');
                navigate();
            } catch (err) { showToast(err.message || 'Failed.', 'error'); }
            finally { btn.disabled = false; btn.textContent = '+ Create New Scheme'; }
        });
    }, 0);

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <h1 style="font-size:2rem;margin-bottom:8px;">Rules & Concessions Engine</h1>
                    <p style="color:var(--text-secondary);margin-bottom:32px;">Orchestrate dynamic scholarships and automated college-level fee waivers</p>

                    <div style="display:grid;grid-template-columns:2fr 1fr;gap:32px;align-items:start;">
                        <!-- Existing Array -->
                        <div style="display:flex;flex-direction:column;gap:16px;">
                            <h3 style="margin:0;">Active Schemes (${scholarships.length})</h3>
                            ${scholarships.length === 0 ? `<div class="card" style="text-align:center;padding:40px;color:var(--text-secondary);">No schemas created.</div>` : cards}
                        </div>

                        <!-- Generator Form -->
                        <div class="card" style="position:sticky;top:24px;">
                            <h3 style="margin-bottom:12px;color:var(--primary);">+ Scheme Generator</h3>
                            <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:20px;">Use comma-separation for multiple matches (e.g. SC,ST)</p>
                            <form id="create-form" style="display:flex;flex-direction:column;gap:12px;font-size:0.85rem;">
                                
                                <strong style="color:var(--primary);margin-top:4px;">1. Scheme Blueprint</strong>
                                <div class="form-group"><label>Name *</label><input name="scholarship_name" required></div>
                                <div class="form-group"><label>Provider *</label><input name="provider" required></div>
                                <div class="form-group"><label>Type *</label>
                                    <select name="type" id="type-toggle" required>
                                        <option value="merit">Merit / Academic</option>
                                        <option value="need">Need Based (Income)</option>
                                        <option value="category_based">Category Based</option>
                                        <option value="fee_concession">Fee Concession (Percentage)</option>
                                        <option value="gender_based">Gender Based</option>
                                        <option value="disability_based">Disability Based</option>
                                        <option value="religion_based">Religion Based</option>
                                    </select>
                                </div>
                                <div class="form-group"><label id="amount-label">Amount (₹) *</label><input type="number" name="amount" required></div>
                                <div class="form-group"><label>Applicable Year *</label><input type="number" name="applicable_year" value="${new Date().getFullYear()}" required></div>

                                <strong style="color:var(--primary);margin-top:16px;">2. Eligibility Matrix (Leave blank = Any)</strong>
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                                    <div class="form-group"><label>Max Income (₹)</label><input type="number" name="max_income" placeholder="e.g. 800000"></div>
                                    <div class="form-group"><label>Category List</label><input name="eligible_category" placeholder="e.g. SC,ST"></div>
                                    <div class="form-group"><label>Min CGPA</label><input type="number" step="0.1" name="min_cgpa" placeholder="0"></div>
                                    <div class="form-group"><label>Min 12th Marks(%)</label><input type="number" step="0.1" name="min_marks_12" placeholder="0"></div>
                                    
                                    <div class="form-group"><label>Course Level</label><input name="req_course_level" placeholder="UG,PG"></div>
                                    <div class="form-group"><label>Course Type</label><input name="req_course_type" placeholder="Technical"></div>
                                    <div class="form-group"><label>Gender</label><input name="req_gender" placeholder="Female"></div>
                                    <div class="form-group"><label>Min Disability %</label><input type="number" name="min_disability"></div>
                                    <div class="form-group" style="grid-column:span 2"><label>Religion Set</label><input name="req_religion" placeholder="Muslim,Christian,Sikh..."></div>
                                    <div class="form-group"><label>State (Domicile)</label><input name="req_state" placeholder="Kerala"></div>
                                    <div class="form-group"><label>Admission Type</label><input name="req_admission_type" placeholder="Merit"></div>
                                    <div class="form-group"><label>Sports Quota</label><input name="req_sports" placeholder="State,National"></div>
                                    <div class="form-group"><label>Min Siblings</label><input type="number" name="min_siblings"></div>
                                </div>

                                <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
                                    <label style="display:flex;align-items:center;gap:8px;"><input type="checkbox" name="req_tfw"> Requires TFW Seat</label>
                                    <label style="display:flex;align-items:center;gap:8px;"><input type="checkbox" name="req_crisis"> Requires Financial Crisis</label>
                                </div>

                                <button id="create-btn" type="submit" style="background:var(--primary);color:white;padding:12px;margin-top:16px;font-weight:700;">+ Generate Rule</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
