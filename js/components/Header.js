// js/components/Header.js
import { store } from '../store.js';

export function Header() {
    const role = store.user.role;
    const hashParts = (window.location.hash.substring(1) || 'dashboard').split('/');
    let rawTitle = hashParts.pop();
    if (rawTitle.length === 36 && rawTitle.split('-').length === 5) {
        rawTitle = hashParts.pop() || 'Details';
    }
    const pageTitle = rawTitle.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

    return `
        <header class="header">
            <div class="header-left">
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 2px;">${role.toUpperCase()} PORTAL</div>
                <h2 style="margin: 0; font-size: 1.25rem; font-family: 'Outfit'; color: var(--text-primary);">
                    ${pageTitle}
                </h2>
            </div>
            
            <div class="header-right" style="margin-left: auto; display: flex; align-items: center; gap: 16px;">
                ${role === 'admin' ? `
                    <button style="background: rgba(91, 13, 27, 0.05); color: var(--primary-student); padding: 8px 16px; font-size: 0.85rem; border: 1px dashed var(--primary-student);">
                        + New Scheme
                    </button>
                ` : ''}
                

            </div>
        </header>
    `;
}
