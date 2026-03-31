// js/components/Sidebar.js
import { store } from '../store.js';
import { signOut } from '../services/authService.js';

export function Sidebar() {
    const role = store.user.role;
    const user = store.user;
    
    // Choose primary color based on role
    const sidebarColor = role === 'admin' ? 'var(--primary-admin)' : 
                         role === 'office_staff' ? 'var(--primary-staff)' : 
                         'var(--primary-student)';

    // Build menu array depending on actual Supabase role
    let menuItems = [];
    if (role === 'student') {
        menuItems = [
            { label: 'Dashboard', icon: '🏠', hash: 'student/dashboard' },
            { label: 'Scholarships', icon: '🎓', hash: 'student/scholarships' },
            { label: 'My Applications', icon: '📋', hash: 'student/applications' },
            { label: 'My Documents', icon: '📁', hash: 'student/documents' },
            { label: 'Fee Details', icon: '💳', hash: 'student/fee-details' },
            { label: 'My Profile', icon: '👤', hash: 'student/profile' }
        ];
    } else if (role === 'office_staff') {
        menuItems = [
            { label: 'Staff Dashboard', icon: '🏠', hash: 'staff/dashboard' },
            { label: 'Verification Queue', icon: '⚖️', hash: 'staff/queue' },
            { label: 'Documents', icon: '📁', hash: 'staff/documents' },
            { label: 'CGPA Updates', icon: '📝', hash: 'staff/cgpa' },
            { label: 'Student Records', icon: '👩‍🎓', hash: 'staff/students' },
            { label: 'Applications', icon: '📋', hash: 'staff/applications' }
        ];
    } else if (role === 'admin') {
        menuItems = [
            { label: 'Admin Dashboard', icon: '📊', hash: 'admin/dashboard' },
            { label: 'Review Panel', icon: '⚖️', hash: 'admin/review' },
            { label: 'All Applications', icon: '📋', hash: 'admin/applications' },
            { label: 'Eligibility Builder', icon: '✅', hash: 'admin/eligibility' },
            { label: 'Staff & Roles', icon: '👥', hash: 'admin/staff' },
            { label: 'Reports', icon: '📈', hash: 'admin/reports' }
        ];
    }

    const currentHash = window.location.hash.substring(1);

    setTimeout(() => {
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn?.addEventListener('click', async () => {
             logoutBtn.disabled = true;
             logoutBtn.innerHTML = 'Signing out...';
             await signOut();
        });
    }, 0);

    return `
        <aside class="sidebar" style="background: ${sidebarColor};">
            <div class="logo" style="margin-bottom: 40px; display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 36px; height: 36px; background: white; color: ${sidebarColor}; border-radius: 10px; display: grid; place-items: center; font-weight: 900; font-size: 1.4rem;">E</div>
                    <span style="font-weight: 800; font-size: 1.5rem; letter-spacing: -0.5px; font-family: 'Outfit';">EduGrant</span>
                </div>
                <span style="font-size: 0.7rem; color: rgba(255,255,255,0.6); font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                    ${role === 'office_staff' ? 'Office Staff Portal' : role === 'admin' ? 'Administration Portal' : 'Student Portal'}
                </span>
            </div>

            <nav class="sidebar-nav" style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
                ${menuItems.map(item => `
                    <a href="#${item.hash}" class="nav-item ${currentHash === item.hash ? 'active' : ''}">
                        <span style="font-size: 1.2rem;">${item.icon}</span>
                        <span style="font-weight: 500;">${item.label}</span>
                    </a>
                `).join('')}
            </nav>

            <div class="mini-profile" style="margin-top: auto; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 40px; height: 40px; border-radius: 12px; background: ${role === 'admin' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)'}; display: grid; place-items: center; font-weight: 700; color: ${role === 'admin' ? 'var(--primary-admin)' : 'white'};">
                        ${(user.name || 'U').charAt(0)}
                    </div>
                    <div style="flex: 1; overflow: hidden;">
                        <div style="font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${user.name || 'User'}</div>
                        <div style="font-size: 0.75rem; color: rgba(255,255,255,0.6);">${user.data?.register_number || user.role}</div>
                    </div>
                </div>
                <button id="logout-btn" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; color: #ffab91; background: rgba(255,255,255,0.05); border-radius: 12px; font-size: 0.85rem; border: none; cursor: pointer;">
                    <span>🚪</span>
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    `;
}
