import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditJournal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [journalDetails, setJournalDetails] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        keywords: '',
        subject_area: '',
        journal_section: '',
        language: 'English',
        manuscript_file: null,
        supplementary_files: [],
    });
    const [subjectAreas, setSubjectAreas] = useState([]);
    const [journalSections, setJournalSections] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [fileChanged, setFileChanged] = useState(false);

    // Create axios instance with base URL
    const api = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_DJANGO_URL,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [journalRes, areasRes, sectionsRes] = await Promise.all([
                    api.get(`/journal/detail/${id}/`),
                    api.get('/journal/subject-areas/'),
                    api.get('/journal/journal-sections/')
                ]);

                setJournalDetails(journalRes.data);
                setSubjectAreas(areasRes.data);
                setJournalSections(sectionsRes.data);

                // Initialize form data with fetched journal details
                setFormData({
                    title: journalRes.data.title,
                    abstract: journalRes.data.abstract,
                    keywords: journalRes.data.keywords,
                    subject_area: journalRes.data.subject_area,
                    journal_section: journalRes.data.journal_section,
                    language: journalRes.data.language,
                    manuscript_file: null, // We'll handle this separately
                    supplementary_files: [],
                });
            } catch (err) {
                setError('Failed to load journal data');
                console.error(err);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, manuscript_file: e.target.files[0] }));
        setFileChanged(true);
    };

    const handleSupplementaryFiles = (e) => {
        setFormData(prev => ({ 
            ...prev, 
            supplementary_files: Array.from(e.target.files) 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (journalDetails.status !== 'submitted') {
            setError('Only journals in "submitted" status can be edited');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'supplementary_files') {
                value.forEach(file => data.append('supplementary_files', file));
            } else if (value !== null) {
                data.append(key, value);
            }
        });

        try {
            await api.patch(`/journal/update-before-review/${id}/`, data);
            alert('Journal updated successfully!');
            navigate(-1); // Go back to previous page
        } catch (err) {
            setError(err.response?.data?.error || 'Update failed');
            console.error('Update error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!journalDetails) {
        return <div className="container mt-4">Loading journal details...</div>;
    }

    if (journalDetails.status !== 'submitted') {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    This journal cannot be edited because its status is "{journalDetails.status}".
                    Only journals in "submitted" status can be edited.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h2 className="mb-0">Edit Journal Submission</h2>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        {/* Title */}
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Abstract */}
                        <div className="mb-3">
                            <label className="form-label">Abstract</label>
                            <textarea
                                className="form-control"
                                name="abstract"
                                rows="5"
                                value={formData.abstract}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        {/* Keywords */}
                        <div className="mb-3">
                            <label className="form-label">Keywords (comma separated)</label>
                            <input
                                type="text"
                                className="form-control"
                                name="keywords"
                                value={formData.keywords}
                                onChange={handleChange}
                                placeholder="quantum, encryption, security"
                                required
                            />
                        </div>

                        {/* Subject Area */}
                        <div className="mb-3">
                            <label className="form-label">Subject Area</label>
                            <select
                                className="form-select"
                                name="subject_area"
                                value={formData.subject_area}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a subject area</option>
                                {subjectAreas.map(area => (
                                    <option key={area.id} value={area.id}>{area.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Journal Section */}
                        <div className="mb-3">
                            <label className="form-label">Journal Section</label>
                            <select
                                className="form-select"
                                name="journal_section"
                                value={formData.journal_section}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a journal section</option>
                                {journalSections.map(section => (
                                    <option key={section.id} value={section.id}>{section.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Language */}
                        <div className="mb-3">
                            <label className="form-label">Language</label>
                            <select
                                className="form-select"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                required
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Manuscript File */}
                        <div className="mb-3">
                            <label className="form-label">
                                Manuscript File (PDF only) - Current: {journalDetails.manuscript_file.split('/').pop()}
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                name="manuscript_file"
                                onChange={handleFileChange}
                                accept=".pdf"
                            />
                            {!fileChanged && (
                                <div className="form-text">Leave empty to keep the current file</div>
                            )}
                        </div>

                        {/* Supplementary Files 
                        <div className="mb-3">
                            <label className="form-label">Supplementary Files (Optional)</label>
                            <input
                                type="file"
                                className="form-control"
                                name="supplementary_files"
                                onChange={handleSupplementaryFiles}
                                multiple
                            />
                            {journalDetails.supplementary_files && (
                                <div className="form-text">
                                    Current files: {journalDetails.supplementary_files.join(', ')}
                                </div>
                            )}
                        </div>*/}

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <button
                                type="button"
                                className="btn btn-secondary me-md-2"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Updating...
                                    </>
                                ) : 'Update Journal'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditJournal;