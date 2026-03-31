// js/services/eligibilityEngine.js
// Pure client-side eligibility check — synchronizes exactly with get_eligible_scholarships in schema.sql

export function checkEligibility(student, criteria) {
    if (!student || !criteria) {
        return { eligible: false, reasons: ['Profile data missing'] };
    }

    const reasons = [];

    // Basic Match
    if (student.cgpa < criteria.min_cgpa) reasons.push(`CGPA ${student.cgpa} is below minimum ${criteria.min_cgpa}`);
    if (student.annual_income > criteria.max_income) reasons.push(`Income ₹${Number(student.annual_income).toLocaleString()} exceeds max ₹${Number(criteria.max_income).toLocaleString()}`);
    if (criteria.year_of_study && criteria.year_of_study !== student.year_study) reasons.push(`Requires Year ${criteria.year_of_study}`);
    if (criteria.min_marks_12 > 0 && student.marks_12 < criteria.min_marks_12) reasons.push(`12th marks ${student.marks_12}% is below requirement ${criteria.min_marks_12}%`);
    if (criteria.min_disability > 0 && student.disability_percentage < criteria.min_disability) reasons.push(`Disability ${student.disability_percentage}% is below requirement ${criteria.min_disability}%`);
    if (criteria.min_siblings > 0 && student.siblings_in_college < criteria.min_siblings) reasons.push(`Requires at least ${criteria.min_siblings} siblings in college`);

    // Flag Match
    if (criteria.req_tfw && !student.tfw_seat) reasons.push(`Requires TFW (Tuition Fee Waiver) Seat`);
    if (criteria.req_crisis && !student.financial_crisis) reasons.push(`Requires officially marked financial crisis status`);

    // String "IN" Match Helpers
    const stringMatch = (req, act, label) => {
        if (!req) return;
        const reqList = req.toLowerCase().split(',').map(s=>s.trim());
        const actual = (act || '').toLowerCase().trim();
        let match = false;
        for (const item of reqList) {
             if (actual.includes(item)) { match = true; break; }
        }
        if (!match) reasons.push(`Your ${label} (${act}) does not match: ${req}`);
    };

    stringMatch(criteria.req_gender, student.gender, 'Gender');
    stringMatch(criteria.req_state, student.state_of_domicile, 'State of Domicile');
    stringMatch(criteria.eligible_category, student.category, 'Category');
    stringMatch(criteria.req_course_level, student.course_level, 'Course Level');
    stringMatch(criteria.req_course_type, student.course_type, 'Course Type');
    stringMatch(criteria.req_religion, student.religion, 'Religion');
    stringMatch(criteria.req_admission_type, student.admission_type, 'Admission Type');
    stringMatch(criteria.req_sports, student.sports_quota, 'Sports Quota');

    return { eligible: reasons.length === 0, reasons };
}

// Ensure critical profile fields are filled out before evaluating schemes
export function checkProfileComplete(student) {
    if (!student) return false;
    return (
        student.name && student.register_number &&
        student.cgpa > 0 &&
        student.annual_income > 0 &&
        student.category &&
        student.course_level && student.course_type &&
        student.marks_12 > 0
    );
}
