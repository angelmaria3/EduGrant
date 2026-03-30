// js/store.js
// Simulated global state and data

export const store = {
    user: {
        role: null, // 'student', 'staff', or 'admin'
        name: '',
        registerNumber: '',
        data: null
    },
    scholarships: [
        {
            id: 1,
            name: 'State Merit Scholarship',
            provider: 'Government of Kerala',
            amount: 25000,
            type: 'Merit-based',
            applicableYear: '2025-26',
            description: 'Financial assistance for meritorious students with high CGPA.',
            criteria: { minCgpa: 7.5, maxIncome: 250000, category: 'ALL' }
        },
        {
            id: 2,
            name: 'SC/ST Fee Concession',
            provider: 'Institution Fund',
            amount: 15000,
            type: 'Category-based',
            applicableYear: '2025-26',
            description: 'Full fee concession for students belonging to SC/ST categories.',
            criteria: { minCgpa: 5.0, maxIncome: 100000, category: 'SC/ST' }
        }
    ],
    applications: [
        {
            id: 101,
            scholarshipId: 1,
            scholarshipName: 'State Merit Scholarship',
            studentName: 'Anjali R.',
            regNo: '2021CS001',
            date: '2024-03-12',
            status: 'Pending',
            type: 'Internal', // Or 'External'
            docs: ['Income Certificate', 'Marksheet']
        }
    ],
    documents: [
        { id: 1, name: 'Income Certificate', status: 'Verified', date: '2024-03-01' },
        { id: 2, name: 'Marksheet (Sem 4)', status: 'Pending', date: '2024-03-10' }
    ],
    fees: {
        total: 58000,
        paid: 32000,
        pending: 26000,
        status: 'Partially Paid',
        history: [
            { id: 1, date: '2023-08-15', amount: 20000, description: 'Admission Fee' },
            { id: 2, date: '2024-01-10', amount: 12000, description: 'Sem 5 Tuition Fee' }
        ]
    },
    staff: [
        { id: 1, name: 'Rekha Suresh', role: 'Office Staff', verifications: 8 },
        { id: 2, name: 'Vinod Menon', role: 'Office Staff', verifications: 3 }
    ]
};

// Mock student data for testing
export const mockStudent = {
    name: 'Anjali R.',
    registerNumber: '2021CS001',
    dob: '2003-05-15',
    gender: 'Female',
    department: 'CSE',
    email: 'anjali.r@example.edu',
    phone: '9876543210',
    category: 'OBC',
    yearStudy: 3,
    annualIncome: 180000,
    semesterWiseCgpa: [
        { sem: 1, gpa: 8.2 },
        { sem: 2, gpa: 8.5 },
        { sem: 3, gpa: 8.8 },
        { sem: 4, gpa: 8.4 },
        { sem: 5, gpa: null } // Current
    ],
    cgpa: 8.48, // Aggregated
    financialDetails: {
        monthlyIncome: 15000,
        dependents: 4,
        bankName: 'SBI',
        accountNo: '3124XXXXX67'
    }
};

export function login(role) {
    store.user.role = role;
    if (role === 'student') {
        store.user.name = mockStudent.name;
        store.user.registerNumber = mockStudent.registerNumber;
        store.user.data = { ...mockStudent };
    } else if (role === 'staff') {
        store.user.name = 'Rekha Suresh';
        store.user.registerNumber = 'STAFF-001';
        store.user.data = store.staff[0];
    } else {
        store.user.name = 'Prof. P. Kumar';
        store.user.registerNumber = 'ADMIN-001';
        store.user.data = null;
    }
    localStorage.setItem('user_role', role);
}

export function signup(studentData) {
    store.user.role = 'student';
    store.user.name = studentData.name;
    store.user.registerNumber = studentData.registerNumber;
    store.user.data = { ...mockStudent, ...studentData };
    localStorage.setItem('user_role', 'student');
    return true;
}

export function updateStudentProfile(newData) {
    if (store.user.role === 'student') {
        store.user.data = { ...store.user.data, ...newData };
        store.user.name = store.user.data.name;
        return true;
    }
    return false;
}

export function logout() {
    store.user.role = null;
    localStorage.removeItem('user_role');
    window.location.hash = '#login';
}

export function getStatusColor(status) {
    switch(status?.toLowerCase()) {
        case 'approved': case 'verified': return '#27AE60';
        case 'rejected': return '#C0392B';
        case 'pending': return '#F39C12';
        case 'under review': case 'in review': return '#1A3C6E';
        case 'docs pending': return '#E67E22';
        default: return '#5F6368';
    }
}
