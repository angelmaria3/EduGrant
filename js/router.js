// js/router.js
import { store, login, logout } from './store.js';
import { LoginPage } from './pages/Login.js';
import { SignupPage } from './pages/Signup.js';

// Student Portal Imports
import { StudentDashboard } from './pages/student/Dashboard.js';
import { ScholarshipsPage } from './pages/student/Scholarships.js';
import { ApplicationForm } from './pages/student/ApplicationForm.js';
import { DocumentsPage } from './pages/student/Documents.js';
import { StatusTrackerPage } from './pages/student/StatusTracker.js';
import { FeeDetailsPage } from './pages/student/FeeDetails.js';
import { ProfilePage } from './pages/student/Profile.js';

// Office Staff Portal Imports
import { StaffDashboard } from './pages/office/Dashboard.js';
import { VerificationQueue } from './pages/office/VerificationQueue.js';
import { OfficeDocuments } from './pages/office/Documents.js';
import { StudentRecords } from './pages/office/StudentRecords.js';
import { CGPAUpdates } from './pages/office/CGPAUpdates.js';
import { OfficeApplications } from './pages/office/Applications.js';

// Admin Portal Imports
import { AdminDashboard } from './pages/admin/Dashboard.js';
import { AdminApplicationsPage } from './pages/admin/Applications.js';
import { AdminReviewPanel } from './pages/admin/ReviewPanel.js';
import { EligibilityManagementPage as EligibilityCriteria } from './pages/admin/Eligibility.js';
import { ReportsPage } from './pages/admin/Reports.js';
import { StaffManagement } from './pages/admin/Staff.js';

const routes = {
    'login': LoginPage,
    'signup': SignupPage,
    
    // Student Routes
    'student/dashboard': StudentDashboard,
    'student/scholarships': ScholarshipsPage,
    'student/apply/:id': ApplicationForm,
    'student/documents': DocumentsPage,
    'student/applications': StatusTrackerPage,
    'student/fee-details': FeeDetailsPage,
    'student/profile': ProfilePage,
    
    // Staff Routes
    'staff/dashboard': StaffDashboard,
    'staff/queue': VerificationQueue,
    'staff/documents': OfficeDocuments,
    'staff/students': StudentRecords,
    'staff/cgpa': CGPAUpdates,
    'staff/applications': OfficeApplications,

    // Admin Routes
    'admin/dashboard': AdminDashboard,
    'admin/applications': AdminApplicationsPage,
    'admin/applications/:id': AdminReviewPanel,
    'admin/eligibility': EligibilityCriteria,
    'admin/reports': ReportsPage,
    'admin/staff': StaffManagement,
};

export async function navigate() {
    const hash = window.location.hash.substring(1) || 'login';
    const root = document.getElementById('root');
    
    // Auth Guard & Store Rehydration
    const savedRole = localStorage.getItem('user_role');
    const publicRoutes = ['login', 'signup'];
    
    // Re-initialize store if needed (handle page refresh)
    if (savedRole && !store.user.role) {
        login(savedRole);
    }

    if (!publicRoutes.includes(hash) && !savedRole) {
        window.location.hash = '#login';
        return;
    }

    // Role-based redirect if on login/signup but already logged in
    if (publicRoutes.includes(hash) && savedRole) {
        if (savedRole === 'student') window.location.hash = '#student/dashboard';
        else if (savedRole === 'staff') window.location.hash = '#staff/dashboard';
        else window.location.hash = '#admin/dashboard';
        return;
    }

    // Find route (support for dynamic :id)
    let pageRenderer = null;
    let params = {};

    for (const route in routes) {
        const paramNames = [];
        const routeRegexSource = route.replace(/:([^\s/]+)/g, (match, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';
        });
        const routeRegex = new RegExp('^' + routeRegexSource + '$');
        const match = hash.match(routeRegex);
        
        if (match) {
            pageRenderer = routes[route];
            paramNames.forEach((name, index) => {
                params[name] = match[index + 1];
            });
            break;
        }
    }

    if (!pageRenderer) {
        pageRenderer = LoginPage;
    }
    
    if (pageRenderer) {
        root.innerHTML = '';
        const content = await pageRenderer(params);
        if (typeof content === 'string') {
            root.innerHTML = content;
        } else {
            root.appendChild(content);
        }
        setupEventListeners();
    }
}

function setupEventListeners() {
    document.querySelectorAll('[data-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = e.target.getAttribute('href');
        });
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

window.addEventListener('hashchange', navigate);
window.addEventListener('load', navigate);

// Initial call to ensure render even if script loads after DOMContentLoaded
navigate();

