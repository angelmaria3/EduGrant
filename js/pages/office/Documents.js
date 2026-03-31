// js/pages/office/Documents.js
import { store, getStatusColor } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header }  from '../../components/Header.js';
import { getAllDocuments, getSignedUrl } from '../../services/documentService.js';
import { showToast } from '../../utils.js';

export async function OfficeDocuments() {
    if (!['office_staff','admin'].includes(store.user.role)) { window.location.hash = '#login'; return ''; }

    const docs = await getAllDocuments().catch(() => []);

    setTimeout(() => {
        document.querySelectorAll('.view-signed').forEach(btn => {
            btn.addEventListener('click', async () => {
                btn.textContent = '…';
                try {
                    const url = await getSignedUrl(btn.dataset.path);
                    if (url) window.open(url, '_blank');
                    else showToast('No URL generated.', 'error');
                } catch { showToast('Error.', 'error'); }
                finally { btn.textContent = '👁 View'; }
            });
        });
    }, 0);

    // Group by student
    const studentGroups = {};
    docs.forEach(doc => {
        const student = doc.application?.student;
        if (!student) return;
        if (!studentGroups[student.student_id]) {
            studentGroups[student.student_id] = {
                student: student,
                docs: []
            };
        }
        studentGroups[student.student_id].docs.push(doc);
    });

    const groupsHtml = Object.values(studentGroups).length === 0
        ? `<div class="card" style="text-align:center;padding:48px;color:var(--text-secondary);">
                <div style="font-size:2.5rem;margin-bottom:12px;">📭</div>
                No documents found in the system!
           </div>`
        : Object.values(studentGroups).map(group => `
            <div class="card" style="margin-bottom:24px;border-top:4px solid var(--primary);">
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:16px;margin-bottom:16px;">
                    <div>
                        <h3 style="margin:0;font-size:1.2rem;font-family:'Outfit';">${group.student.name}</h3>
                        <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px;">${group.student.register_number} • ${group.student.department}</div>
                    </div>
                    <div style="background:var(--primary-light);padding:5px 12px;border-radius:12px;font-size:0.8rem;color:var(--primary);font-weight:700;">
                        ${group.docs.length} Document(s)
                    </div>
                </div>
                
                <table style="width:100%;border-collapse:collapse;">
                    <thead><tr style="background:rgba(91,13,27,0.03);">
                        <th style="padding:10px 12px;text-align:left;font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;">Document Type</th>
                        <th style="padding:10px 12px;text-align:left;font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;">Scholarship</th>
                        <th style="padding:10px 12px;text-align:left;font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;">Status</th>
                        <th style="padding:10px 12px;text-align:left;font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;">Date</th>
                        <th style="padding:10px 12px;text-align:right;font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;">File</th>
                    </tr></thead>
                    <tbody>
                        ${group.docs.map(d => `
                            <tr style="border-bottom:1px solid var(--border-light);transition:background 0.2s;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='transparent'">
                                <td style="padding:12px;font-weight:600;font-size:0.88rem;">${d.document_type}</td>
                                <td style="padding:12px;font-size:0.85rem;color:var(--text-secondary);">${d.application?.scholarship?.scholarship_name || 'N/A'}</td>
                                <td style="padding:12px;">
                                    <span class="badge" style="background:${getStatusColor(d.verification_status)}20;color:${getStatusColor(d.verification_status)};">${d.verification_status}</span>
                                </td>
                                <td style="padding:12px;font-size:0.8rem;color:var(--text-secondary);">${new Date(d.uploaded_at).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</td>
                                <td style="padding:12px;text-align:right;">
                                    <button class="view-signed" data-path="${d.document_path}" style="background:var(--primary);color:white;padding:5px 12px;border-radius:6px;font-size:0.75rem;">👁 View</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `).join('');

    return `
        <div class="flex" style="min-height:100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <h1 style="font-size:2rem;margin-bottom:8px;font-family:'Outfit';">Document History</h1>
                    <p style="color:var(--text-secondary);margin-bottom:32px;">Overview of all documents uploaded by students across all applications</p>
                    
                    ${groupsHtml}
                </div>
            </main>
        </div>
    `;
}
