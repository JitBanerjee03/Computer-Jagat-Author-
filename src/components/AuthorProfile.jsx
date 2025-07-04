import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AuthorProfile = ({ author }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  console.log(author);
  // Initialize form with author data
  useEffect(() => {
    if (author) {
      reset({
        phone_number: author.phone_number || '',
        institution: author.institution || '',
        department: author.department || '',
        position_title: author.position_title || '',
        country: author.country || '',
        city: author.city || '',
        address: author.address || '',
        orcid_id: author.orcid_id || '',
        research_interests: author.research_interests || '',
        google_scholar_profile: author.google_scholar_profile || '',
        personal_website: author.personal_website || '',
        biography: author.biography || '',
        languages_spoken: author.languages_spoken || '',
        reviewer_interest: author.reviewer_interest || false,
        corresponding_author: author.corresponding_author || false
      });
      setPreviewImage(author.profile_picture || '/default-profile.png');
      setIsLoading(false);
    }
  }, [author, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_DJANGO_URL}/author/update/${author.id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      setIsEditing(false);
      // Add success notification here if needed
    } catch (error) {
      console.error('Error updating profile:', error);
      // Add error notification here if needed
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="card shadow">
          <div className="card-body text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Author Profile</h3>
            <button 
              className={`btn ${isEditing ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 text-center mb-4">
                  <div className="position-relative">
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="img-thumbnail mb-2" 
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <input
                      type="file"
                      id="profilePicture"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label 
                      htmlFor="profilePicture" 
                      className="btn btn-sm btn-outline-primary position-absolute bottom-0 start-50 translate-middle-x"
                    >
                      Change
                    </label>
                  </div>
                </div>

                <div className="col-md-9">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        {...register('phone_number')}
                        defaultValue={author.phone_number || ''}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <h5 className="mb-3">Affiliation</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Institution*</label>
                  <input
                    type="text"
                    className={`form-control ${errors.institution ? 'is-invalid' : ''}`}
                    {...register('institution', { required: 'Institution is required' })}
                    defaultValue={author.institution || ''}
                  />
                  {errors.institution && <div className="invalid-feedback">{errors.institution.message}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register('department')}
                    defaultValue={author.department || ''}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Position/Title</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register('position_title')}
                    defaultValue={author.position_title || ''}
                  />
                </div>
              </div>

              <h5 className="mb-3">Address</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Country*</label>
                  <input
                    type="text"
                    className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                    {...register('country', { required: 'Country is required' })}
                    defaultValue={author.country || ''}
                  />
                  {errors.country && <div className="invalid-feedback">{errors.country.message}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register('city')}
                    defaultValue={author.city || ''}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    {...register('address')}
                    defaultValue={author.address || ''}
                  ></textarea>
                </div>
              </div>

              <h5 className="mb-3">Academic Information</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">ORCID ID</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register('orcid_id')}
                    defaultValue={author.orcid_id || ''}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Google Scholar Profile</label>
                  <input
                    type="url"
                    className="form-control"
                    {...register('google_scholar_profile')}
                    defaultValue={author.google_scholar_profile || ''}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Personal Website</label>
                  <input
                    type="url"
                    className="form-control"
                    {...register('personal_website')}
                    defaultValue={author.personal_website || ''}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Research Interests</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    {...register('research_interests')}
                    defaultValue={author.research_interests || ''}
                  ></textarea>
                </div>
              </div>

              <h5 className="mb-3">Other Information</h5>
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <label className="form-label">Biography</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    {...register('biography')}
                    defaultValue={author.biography || ''}
                  ></textarea>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Languages Spoken</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="English, French, etc."
                    {...register('languages_spoken')}
                    defaultValue={author.languages_spoken || ''}
                  />
                </div>
              </div>

              <h5 className="mb-3">Role Options</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="reviewerInterest"
                      {...register('reviewer_interest')}
                      defaultChecked={author.reviewer_interest || false}
                    />
                    <label className="form-check-label" htmlFor="reviewerInterest">
                      Interested in being a reviewer
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="correspondingAuthor"
                      {...register('corresponding_author')}
                      defaultChecked={author.corresponding_author || false}
                    />
                    <label className="form-check-label" htmlFor="correspondingAuthor">
                      Corresponding Author
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer bg-light">
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary px-4">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 text-center mb-4">
                <img 
                  src={author.profile_picture || '/default-profile.png'} 
                  alt="Profile" 
                  className="img-thumbnail" 
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>

              <div className="col-md-9">
                {author.position_title && <p className="text-muted mb-1">{author.position_title}</p>}
                {author.institution && <p className="text-muted mb-1">{author.institution}</p>}
                {author.department && <p className="text-muted mb-1">{author.department}</p>}

                <ul className="list-unstyled mt-3">
                  {author.phone_number && (
                    <li className="mb-1">
                      <i className="bi bi-telephone me-2"></i>
                      {author.phone_number}
                    </li>
                  )}
                  {author.orcid_id && (
                    <li className="mb-1">
                      <i className="bi bi-person-badge me-2"></i>
                      ORCID: {author.orcid_id}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <hr />

            <div className="row">
              <div className="col-md-6 mb-4">
                <h5>Address</h5>
                <address>
                  {author.address && <>{author.address}<br /></>}
                  {author.city && <>{author.city}, </>}
                  {author.country}
                </address>
              </div>
              <div className="col-md-6 mb-4">
                <h5>Academic Profiles</h5>
                <ul className="list-unstyled">
                  {author.google_scholar_profile && (
                    <li>
                      <a href={author.google_scholar_profile} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-google me-2"></i>Google Scholar
                      </a>
                    </li>
                  )}
                  {author.personal_website && (
                    <li>
                      <a href={author.personal_website} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-globe me-2"></i>Personal Website
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {author.research_interests && (
              <div className="mb-4">
                <h5>Research Interests</h5>
                <p>{author.research_interests}</p>
              </div>
            )}

            {author.biography && (
              <div className="mb-4">
                <h5>Biography</h5>
                <p>{author.biography}</p>
              </div>
            )}

            <div className="row">
              {author.languages_spoken && (
                <div className="col-md-6 mb-4">
                  <h5>Languages Spoken</h5>
                  <p>{author.languages_spoken}</p>
                </div>
              )}
              <div className="col-md-6 mb-4">
                <h5>Roles</h5>
                <ul className="list-unstyled">
                  {author.reviewer_interest && (
                    <li><span className="badge bg-info">Reviewer</span></li>
                  )}
                  {author.corresponding_author && (
                    <li><span className="badge bg-primary">Corresponding Author</span></li>
                  )}
                </ul>
              </div>
            </div>

            <div className="text-muted small">
              Member since: {new Date(author.date_joined).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile;