import React, { useState } from 'react';
import { Table, Alert, Badge, Form, Row, Col, Button, Card } from 'react-bootstrap';
import { 
  FaInfoCircle, 
  FaEye, 
  FaSearch, 
  FaFilter, 
  FaRedo, 
  FaEdit,
  FaCrown,        // Chief Editor
  FaUserShield,   // Area Editor
  FaUserTie,      // Associate Editor
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const JournalsByAuthor = ({ authorArticles }) => {
  const navigate = useNavigate();
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectAreaFilter, setSubjectAreaFilter] = useState('all');
  const [journalSectionFilter, setJournalSectionFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Format date to MM-DD format
  const formatDate = (dateString) => {
    if (!dateString) return '~';
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  // Status options
  const statusOptions = [
    'all', 
    'submitted', 
    'under_review', 
    'revisions_requested', 
    'accepted', 
    'rejected',
    'review_done',
    'assigned_to_area_editor',
    'assigned_to_associate_editor'
  ];

  // Extract unique values for filters
  const subjectAreas = [...new Set(authorArticles?.map(article => 
    article.subject_area_name ? article.subject_area_name : 'General'
  ))];
  const journalSections = [...new Set(authorArticles?.map(article => 
    article.journal_section_name ? article.journal_section_name : 'General'
  ))];

  // Filter articles based on search and filters
  const filteredArticles = authorArticles?.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.id.toString().includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'all' || article.status === statusFilter;
    
    const matchesSubjectArea = 
      subjectAreaFilter === 'all' || 
      (article.subject_area_name && article.subject_area_name.toString() === subjectAreaFilter);
    
    const matchesJournalSection = 
      journalSectionFilter === 'all' || 
      (article.journal_section_name && article.journal_section_name.toString() === journalSectionFilter);
    
    return matchesSearch && matchesStatus && matchesSubjectArea && matchesJournalSection;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSubjectAreaFilter('all');
    setJournalSectionFilter('all');
  };

  // Count articles by status for summary cards
  const statusCounts = authorArticles?.reduce((acc, article) => {
    acc[article.status] = (acc[article.status] || 0) + 1;
    return acc;
  }, {});

  // Get status display text
  const getStatusDisplay = (status) => {
    const statusMap = {
      submitted: 'Submitted',
      under_review: 'Under Review',
      revisions_requested: 'Revisions Requested',
      accepted: 'Accepted',
      rejected: 'Rejected',
      review_done: 'Review Done',
      assigned_to_area_editor: 'Assigned to Area Editor',
      assigned_to_associate_editor: 'Assigned to Associate Editor'
    };
    return statusMap[status] || status;
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const badgeMap = {
      submitted: 'info',
      under_review: 'warning',
      revisions_requested: 'primary',
      accepted: 'success',
      rejected: 'danger',
      review_done: 'secondary',
      assigned_to_area_editor: 'dark',
      assigned_to_associate_editor: 'light text-dark'
    };
    return badgeMap[status] || 'secondary';
  };

  // Handle recommendation icon clicks
  const handleRecommendationClick = (articleId, type) => {
    navigate(`/recommendations/${articleId}/${type}`);
  };

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-md-12">
          <Alert variant="info">
            <FaInfoCircle /> View your submitted journal articles. You can track their status and view details.
          </Alert>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-3">
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Articles</Card.Title>
              <Card.Text className="display-6">
                {authorArticles?.length || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Subject Areas</Card.Title>
              <Card.Text>
                {subjectAreas.slice(0, 3).join(', ')}
                {subjectAreas.length > 3 && ` +${subjectAreas.length - 3} more`}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Journal Sections</Card.Title>
              <Card.Text>
                {journalSections.slice(0, 3).join(', ')}
                {journalSections.length > 3 && ` +${journalSections.length - 3} more`}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </div>

      {/* Search and Filter Controls */}
      <div className="row mb-3">
        <div className="col-md-12">
          <Form>
            <Row className="align-items-end">
              <Col md={6}>
                <Form.Group controlId="searchTerm">
                  <Form.Label>Search</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      placeholder="Search by ID or title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline-secondary">
                      <FaSearch />
                    </Button>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="text-end">
                <Button 
                  variant="outline-primary"
                  onClick={() => setShowFilters(!showFilters)}
                  className="me-2"
                >
                  <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={resetFilters}
                >
                  <FaRedo /> Reset Filters
                </Button>
              </Col>
            </Row>

            {showFilters && (
              <Row className="mt-3">
                <Col md={4}>
                  <Form.Group controlId="statusFilter">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>
                          {getStatusDisplay(option)}
                          {statusCounts && option !== 'all' ? ` (${statusCounts[option] || 0})` : ''}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="subjectAreaFilter">
                    <Form.Label>Subject Area</Form.Label>
                    <Form.Select
                      value={subjectAreaFilter}
                      onChange={(e) => setSubjectAreaFilter(e.target.value)}
                    >
                      <option value="all">All Subject Areas</option>
                      {subjectAreas.map(area => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="journalSectionFilter">
                    <Form.Label>Journal Section</Form.Label>
                    <Form.Select
                      value={journalSectionFilter}
                      onChange={(e) => setJournalSectionFilter(e.target.value)}
                    >
                      <option value="all">All Journal Sections</option>
                      {journalSections.map(section => (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Form>
        </div>
      </div>

      {/* Articles Table */}
      <div className="row">
        <div className="col-md-12">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>MM-DD Submitted</th>
                <th>Section</th>
                <th>Title</th>
                <th>Subject Area</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles && filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr key={article.id}>
                    <td>{article.id}</td>
                    <td>{formatDate(article.submission_date)}</td>
                    <td>
                      <Badge bg="secondary" className="text-wrap">
                        {article.journal_section_name || 'General'}
                      </Badge>
                    </td>
                    <td>{article.title}</td>
                    <td>
                      <Badge bg="info" className="text-wrap">
                        {article.subject_area_name || 'General'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusBadge(article.status)}>
                        {getStatusDisplay(article.status)}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1 align-items-center">
                        <Link 
                          to={`/view-journal/${article.id}`} 
                          className="btn btn-sm btn-primary"
                          title="View Details"
                        >
                          <FaEye className="me-1" /> View
                        </Link>
                        
                        {article.status === 'submitted' && (
                          <Link 
                            to={`/edit-journal/${article.id}`} 
                            className="btn btn-sm btn-warning"
                            title="Edit Article"
                          >
                            <FaEdit className="me-1" /> Edit
                          </Link>
                        )}

                        {/* Enhanced Recommendation Indicators */}
                        <div className="d-flex gap-1 ms-1">
                          <Button 
                            variant={article.chief_editor_recommendation ? "warning" : "outline-warning"} 
                            size="sm"
                            className="d-flex align-items-center"
                            title={article.chief_editor_recommendation ? 
                              "View Chief Editor Recommendation" : 
                              "Chief Editor Recommendation"}
                            onClick={() => handleRecommendationClick(article.id, 'chief-editor')}
                          >
                            <FaCrown className="me-1" /> Chief
                          </Button>
                          <Button 
                            variant={article.area_editor_recommendation ? "success" : "outline-success"} 
                            size="sm"
                            className="d-flex align-items-center"
                            title={article.area_editor_recommendation ? 
                              "View Area Editor Recommendation" : 
                              "Area Editor Recommendation"}
                            onClick={() => handleRecommendationClick(article.id, 'area-editor')}
                          >
                            <FaUserShield className="me-1" /> Area
                          </Button>
                          <Button 
                            variant={article.associate_editor_recommendation ? "info" : "outline-info"} 
                            size="sm"
                            className="d-flex align-items-center"
                            title={article.associate_editor_recommendation ? 
                              "View Associate Editor Recommendation" : 
                              "Associate Editor Recommendation"}
                            onClick={() => handleRecommendationClick(article.id, 'associate-editor')}
                          >
                            <FaUserTie className="me-1" /> Assoc
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    {authorArticles?.length === 0 
                      ? 'You have no submitted articles yet.' 
                      : 'No articles match your search criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default JournalsByAuthor;