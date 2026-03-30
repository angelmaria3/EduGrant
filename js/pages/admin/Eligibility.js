// js/pages/admin/Eligibility.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function EligibilityManagementPage() {
    const criteria = [
        { id: 'C-001', scholarship: 'Merit Scholarship', minCgpa: 7.5, maxIncome: 250000, category: 'ALL' },
        { id: 'C-002', scholarship: 'SC/ST Concession', minCgpa: 5.0, maxIncome: 100000, category: 'SC' }
    ];

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
                        <div>
                            <h1 style="margin-bottom: 4px;">Eligibility Criteria</h1>
                            <p style="color: var(--text-secondary);">Define rules and requirements for scholarship matching</p>
                        </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 340px; gap: 32px;">
                        
                        <!-- Main Editor -->
                        <div style="display: flex; flex-direction: column; gap: 24px;">
                            <div class="card">
                                <h3 style="margin-bottom: 24px; font-family: 'Outfit'; border-bottom: 1px solid var(--border); padding-bottom: 12px;">Criteria Configuration</h3>
                                <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 24px;">
                                    <div class="form-group">
                                        <label>Target Scholarship</label>
                                        <select>
                                            ${store.scholarships.map(s => `<option>${s.name}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Academic Year</label>
                                        <select>
                                            <option>2024-25</option>
                                            <option>2025-26</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Minimum Required CGPA</label>
                                        <input type="number" step="0.1" value="7.5">
                                    </div>
                                    <div class="form-group">
                                        <label>Maximum Annual Income (₹)</label>
                                        <input type="number" value="250000">
                                    </div>
                                    <div class="form-group">
                                        <label>Applicable Categories</label>
                                        <div style="display: flex; gap: 8px; margin-top: 8px;">
                                            <label style="display: flex; align-items: center; gap: 6px; font-weight: 500;">
                                                <input type="checkbox" checked style="width: auto;"> General
                                            </label>
                                            <label style="display: flex; align-items: center; gap: 6px; font-weight: 500;">
                                                <input type="checkbox" checked style="width: auto;"> OBC
                                            </label>
                                            <label style="display: flex; align-items: center; gap: 6px; font-weight: 500;">
                                                <input type="checkbox" checked style="width: auto;"> SC/ST
                                            </label>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Eligible Year of Study</label>
                                        <select>
                                            <option>All Years</option>
                                            <option>First Year Only</option>
                                            <option>Final Year Only</option>
                                        </select>
                                    </div>
                                </div>
                                <div style="margin-top: 32px; display: flex; justify-content: flex-end; gap: 12px;">
                                    <button style="background: white; border: 1px solid var(--border); padding: 10px 24px;">Discard</button>
                                    <button style="background: var(--primary-admin); color: white; padding: 10px 32px; font-weight: 700;">Update Rules</button>
                                </div>
                            </div>

                            <div class="card" style="background: rgba(91, 13, 27, 0.02); border: 1px dashed var(--primary-admin);">
                                <h4 style="margin-bottom: 8px; color: var(--primary-admin);">⚠️ Warning: Rule Impact</h4>
                                <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                                    Changing CGPA or Income limits will immediately affect currently pending applications and scholarship visibility for ~140 students.
                                </p>
                            </div>
                        </div>

                        <!-- History Sidebar -->
                        <div class="card">
                            <h4 style="margin-bottom: 20px; font-family: 'Outfit';">Modification Log</h4>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                <div style="font-size: 0.8rem; border-left: 2px solid var(--primary-admin); padding-left: 12px;">
                                    <div style="font-weight: 700;">CGPA adjusted: 7.0 → 7.5</div>
                                    <div style="color: var(--text-secondary);">By Admin | 12 May 2024</div>
                                </div>
                                <div style="font-size: 0.8rem; border-left: 2px solid var(--border); padding-left: 12px;">
                                    <div style="font-weight: 700;">Income limit updated</div>
                                    <div style="color: var(--text-secondary);">By Admin | 10 Jan 2024</div>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </main>
        </div>
    `;
}
