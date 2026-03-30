// js/pages/student/Documents.js
import { store } from '../../store.js';
import { Sidebar } from '../../components/Sidebar.js';
import { Header } from '../../components/Header.js';

export async function DocumentsPage() {
    // Simulated document list if empty
    if (store.documents.length === 0) {
        store.documents = [
            { id: 1, type: 'Income Certificate', file: 'income_cert.pdf', status: 'Verified', appId: 'APP-001' },
            { id: 2, type: 'Caste Certificate', file: 'caste_cert.pdf', status: 'Pending', appId: 'APP-001' }
        ];
    }

    setTimeout(() => {
        const uploadBtn = document.getElementById('upload-doc-btn');
        uploadBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            const type = document.getElementById('doc-type').value;
            const file = document.getElementById('doc-file').files[0];
            
            if (type && file) {
                store.documents.push({
                    id: Date.now(),
                    type: type,
                    file: file.name,
                    status: 'Pending',
                    appId: document.getElementById('app-filter').value
                });
                alert('Document uploaded successfully!');
                window.location.hash = '#student/documents'; // Refresh
            } else {
                alert('Please select document type and file.');
            }
        });
    }, 0);

    const applications = store.applications;

    return `
        <div class="flex" style="min-height: 100vh;">
            ${Sidebar()}
            <main class="main-content">
                ${Header()}
                <div class="page-container">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
                        <div>
                            <h1 style="margin-bottom: 4px;">My Documents</h1>
                            <p style="color: var(--text-secondary);">Manage supporting documents for your applications</p>
                        </div>
                        <div style="display: flex; gap: 12px; align-items: center;">
                            <span style="font-size: 0.85rem; font-weight: 600;">Filter by App:</span>
                            <select id="app-filter" style="width: 200px;">
                                <option value="ALL">All Applications</option>
                                ${applications.map(app => `<option value="${app.id}">${app.id} - ${app.scholarshipName}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-md);">
                        <!-- Document List -->
                        <div class="card">
                            <h3 style="font-size: 1.1rem; margin-bottom: var(--space-md);">Uploaded Documents</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="text-align: left; border-bottom: 1px solid var(--border);">
                                        <th style="padding: 12px 8px; font-weight: 600; font-size: 0.85rem; color: var(--text-secondary);">Document Type</th>
                                        <th style="padding: 12px 8px; font-weight: 600; font-size: 0.85rem; color: var(--text-secondary);">File</th>
                                        <th style="padding: 12px 8px; font-weight: 600; font-size: 0.85rem; color: var(--text-secondary);">Status</th>
                                    </tr>
                                </thead>
                                <tbody id="doc-table-body">
                                    ${store.documents.map(doc => `
                                        <tr style="border-bottom: 1px solid var(--border);">
                                            <td style="padding: 12px 8px; font-weight: 600;">${doc.type}</td>
                                            <td style="padding: 12px 8px; font-size: 0.85rem; color: var(--primary-light);">
                                                <span style="cursor: pointer; text-decoration: underline;">${doc.file}</span>
                                            </td>
                                            <td style="padding: 12px 8px;">
                                                <span style="background: ${doc.status === 'Verified' ? 'var(--success)' : 'var(--warning)'}20; color: ${doc.status === 'Verified' ? 'var(--success)' : 'var(--warning)'}; padding: 4px 10px; border-radius: var(--radius-pill); font-size: 0.75rem; font-weight: 700;">
                                                    ${doc.status}
                                                </span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <!-- Upload Widget -->
                        <div class="card">
                            <h3 style="font-size: 1.1rem; margin-bottom: var(--space-md);">Upload New Document</h3>
                            <form style="display: flex; flex-direction: column; gap: var(--space-md);">
                                <div class="form-group">
                                    <label>Document Type</label>
                                    <select id="doc-type">
                                        <option value="">Select Type</option>
                                        <option>Income Certificate</option>
                                        <option>Caste / Category Certificate</option>
                                        <option>Academic Marksheet</option>
                                        <option>Bonafide Certificate</option>
                                        <option>Fee Receipt</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>File (PDF, JPG, PNG ≤ 5MB)</label>
                                    <div style="border: 2px dashed var(--border); border-radius: 8px; padding: var(--space-md); text-align: center; position: relative; cursor: pointer;">
                                        <input type="file" id="doc-file" style="position: absolute; inset: 0; opacity: 0; cursor: pointer;">
                                        <div style="font-size: 1.5rem; margin-bottom: 8px;">📁</div>
                                        <div style="font-size: 0.85rem; color: var(--text-secondary);">Click or drag to upload</div>
                                    </div>
                                </div>
                                <button id="upload-doc-btn" style="background: var(--primary); color: white; padding: 12px;">Upload Document</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
