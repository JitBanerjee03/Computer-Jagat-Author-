import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { contextProviderDeclare } from "../store/ContextProvider";

const PostJournal = ({ authorId }) => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    subject_area: '',
    journal_section: '',
    language: 'English',
    manuscript_file: null,
    supplementary_files: [],
    co_authors: [],
    status: 'submitted'
  });

  const [subjectAreas, setSubjectAreas] = useState([]);
  const [journalSections, setJournalSections] = useState([]);
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const getContextProvider=useContext(contextProviderDeclare);
  const {author,handleAcceptedJournals}=getContextProvider;

  // Create axios instance with base URL
  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_DJANGO_URL,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [areasRes, sectionsRes, authorsRes] = await Promise.all([
          api.get('/journal/subject-areas/'),
          api.get('/journal/journal-sections/'),
          api.get('/author/all/')
        ]);
        setSubjectAreas(areasRes.data);
        setJournalSections(sectionsRes.data);
        setAvailableAuthors(authorsRes.data);
      } catch (err) {
        setError('Failed to load form options');
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, manuscript_file: e.target.files[0] }));
  };

  const handleSupplementaryFiles = (e) => {
    setFormData(prev => ({ 
      ...prev, 
      supplementary_files: Array.from(e.target.files) 
    }));
  };

  const handleCoAuthorsChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, co_authors: options }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'supplementary_files') {
        value.forEach(file => data.append('supplementary_files', file));
      } else if (key === 'co_authors') {
        value.forEach(author => data.append('co_authors', author));
      } else if (value !== null) {
        data.append(key, value);
      }
    });

    try {
      await api.post(`/journal/submit-journal/${author.id}/`, data);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
      console.error('Submission error:', err);
    } finally {
      handleAcceptedJournals();
      alert('Journal Submitetd Successfuly');
      setIsSubmitting(false);    
    }
  };

  return (
            <div className="container mt-4">
                <div className="card shadow">
                    <div className="card-header bg-primary text-white">
                    <h2 className="mb-0">Journal Submission</h2>
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
                        <label className="form-label">Manuscript File (PDF only)</label>
                        <input
                            type="file"
                            className="form-control"
                            name="manuscript_file"
                            onChange={handleFileChange}
                            accept=".pdf"
                            required
                        />
                        </div>

                        {/* Supplementary Files */}
                        {/*<div className="mb-3">
                        <label className="form-label">Supplementary Files (Optional)</label>
                        <input
                            type="file"
                            className="form-control"
                            name="supplementary_files"
                            onChange={handleSupplementaryFiles}
                            multiple
                        />
                        </div>*/}

                        {/* Co-authors */}
                        {/*<div className="mb-3">
                        <label className="form-label">Co-authors (Optional)</label>
                        <select
                            multiple
                            className="form-select"
                            name="co_authors"
                            value={formData.co_authors}
                            onChange={handleCoAuthorsChange}
                            size="3"
                        >
                            {availableAuthors.map(author => (
                            <option key={author.id} value={author.id}>
                                {author.first_name} {author.last_name} ({author.email})
                            </option>
                            ))}
                        </select>
                        <small className="text-muted">Hold Ctrl/Cmd to select multiple</small>
                        </div>*/}

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Submitting...
                            </>
                            ) : 'Submit Journal'}
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
  );
};

export default PostJournal;