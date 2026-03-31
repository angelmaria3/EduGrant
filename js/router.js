// js/router.js
import { store, initializeSession, clearSession } from './store.js';
import { supabase } from './supabaseClient.js';
import { signOut } from './services/authService.js';
import { showToast } from './utils.js';

import { LoginPage }    from './pages/Login.js';
import { SignupPage }   from './pages/Signup.js';

// Student Portal
import { StudentDashboard }   from './pages/student/Dashboard.js';
import { ScholarshipsPage }   from './pages/student/Scholarships.js';
import { ApplicationForm }    from './pages/student/ApplicationForm.js';
import { DocumentsPage }      from './pages/student/Documents.js';
import { StatusTrackerPage }  from './pages/student/StatusTracker.js';
import { FeeDetailsPage }     from './pages/student/FeeDetails.js';
import { ProfilePage }        from './pages/student/Profile.js';

// Office Staff Portal
import { StaffDashboard }     from './pages/office/Dashboard.js';
import { VerificationQueue }  from './pages/office/VerificationQueue.js';
import { OfficeDocuments }    from './pages/office/Documents.js';
import { StudentRecords }     from './pages/office/StudentRecords.js';
import { CGPAUpdates }        from './pages/office/CGPAUpdates.js';
import { OfficeApplications } from './pages/office/Applications.js';

// Admin Portal
import { AdminDashboard }         from './pages/admin/Dashboard.js';
import { AdminApplicationsPage }  from './pages/admin/Applications.js';
import { AdminReviewPanel }       from './pages/admin/ReviewPanel.js';
import { EligibilityManagementPage as EligibilityCriteria } from './pages/admin/Eligibility.js';
import { ReportsPage }            from './pages/admin/Reports.js';
import { StaffManagement }        from './pages/admin/Staff.js';
import { FeeManagement }          from './pages/admin/FeeManagement.js';

const routes = {
    'login':  LoginPage,
    'signup': SignupPage,

    // Student
    'student/dashboard':   StudentDashboard,
    'student/scholarships': ScholarshipsPage,
    'student/apply/:id':   ApplicationForm,
    'student/documents':   DocumentsPage,
    'student/applications': StatusTrackerPage,
    'student/fee-details': FeeDetailsPage,
    'student/profile':     ProfilePage,

    // Office Staff
    'staff/dashboard':    StaffDashboard,
    'staff/queue':        VerificationQueue,
    'staff/documents':    OfficeDocuments,
    'staff/students':     StudentRecords,
    'staff/cgpa':         CGPAUpdates,
    'staff/applications': OfficeApplications,

    // Admin
    'admin/dashboard':        AdminDashboard,
    'admin/applications':     AdminApplicationsPage,
    'admin/applications/:id': AdminReviewPanel,
    'admin/eligibility':      EligibilityCriteria,
    'admin/reports':          ReportsPage,
    'admin/staff':            StaffManagement,
    'admin/fees':             FeeManagement,
};

const publicRoutes = ['login', 'signup'];

export async function navigate() {
    const hash = window.location.hash.substring(1) || 'login';
    const root = document.getElementById('root');


    // Rehydrate session (cached after first call per user)
    const session = await initializeSession();

    const isPublic = publicRoutes.some(r => hash === r);

    // Not logged in → send to login
    if (!session && !isPublic) {
        window.location.hash = '#login';
        return;
    }

    // Already logged in on login/signup → redirect to portal
    if (session && isPublic) {
        const role = store.user.role;
        if (role === 'student')      window.location.hash = '#student/dashboard';
        else if (role === 'office_staff') window.location.hash = '#staff/dashboard';
        else                         window.location.hash = '#admin/dashboard';
        return;
    }

    // Route-guard: prevent wrong role accessing wrong portal
    if (session) {
        const role = store.user.role;
        if (hash.startsWith('student/') && role !== 'student') {
            window.location.hash = role === 'admin' ? '#admin/dashboard' : '#staff/dashboard';
            return;
        }
        if (hash.startsWith('staff/')   && role === 'student') { window.location.hash = '#student/dashboard'; return; }
        if (hash.startsWith('admin/')   && role !== 'admin')   { window.location.hash = '#student/dashboard'; return; }
    }

    // Match route (supports dynamic :param segments)
    let pageRenderer = LoginPage;
    let params = {};

    for (const route in routes) {
        const paramNames = [];
        const regexSrc = route.replace(/:([^\s/]+)/g, (_, name) => {
            paramNames.push(name);
            return '([^/]+)';
        });
        const match = hash.match(new RegExp('^' + regexSrc + '$'));
        if (match) {
            pageRenderer = routes[route];
            paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
            break;
        }
    }

    // Render page
    root.innerHTML = '';
    try {
        const content = await pageRenderer(params);
        if (typeof content === 'string') {
            root.innerHTML = content;
        } else if (content instanceof Node) {
            root.appendChild(content);
        }
    } catch (err) {
        console.error('Page render error:', err);
        root.innerHTML = `<div style="padding:40px;text-align:center;color:#C0392B;font-family:'Outfit';">
            <div style="font-size:2rem;margin-bottom:12px;">⚠️</div>
            <strong>Something went wrong.</strong><br>
            <small style="color:#888;">${err.message}</small>
        </div>`;
    }

    setupEventListeners();
}

function setupEventListeners() {
    // Logout button
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        clearSession();
        await signOut();
    });

    // Sidebar data-link navigation
    document.querySelectorAll('[data-link]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            window.location.hash = e.currentTarget.getAttribute('href');
        });
    });
}

window.addEventListener('hashchange', navigate);
// Single entry point on load
navigate();
