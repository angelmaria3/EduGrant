// js/pages/admin/Reports.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function ReportsPage() {
    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                        <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto;">Select your filters above and click 'Generate Report' to view the extracted data here.</p>
                    </div>

                    <div style="margin-top: var(--space-lg); display: flex; justify-content: flex-end; gap: 12px;">
                        <button style="background: var(--neutral-bg); border: 1px solid var(--border); padding: 10px 20px; color: var(--text-secondary); cursor: not-allowed;" disabled>Download CSV</button>
                        <button style="background: var(--neutral-bg); border: 1px solid var(--border); padding: 10px 20px; color: var(--text-secondary); cursor: not-allowed;" disabled>Print PDF</button>
                    </div>
                </div>
            </main>
        </div>
    `;
}
