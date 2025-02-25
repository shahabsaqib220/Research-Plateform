'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  Modal,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Upload,
  Save,
  Add,
  Delete,
  Person,
  Title,
  Description,
  Label,
  Article,
  FormatQuote,
  Image,
  Gavel,
  Copyright,
  ThumbUp,
  Link,
  Code,
  School,
  Public,
  Edit,
} from '@mui/icons-material';

const PersonalPublicationForm = ({ onSave, onClose }) => {
  const [authorInfo, setAuthorInfo] = useState({
    fullName: '',
    affiliation: '',
    email: '',
    contact: '',
  });
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [researchContent, setResearchContent] = useState({
    introduction: '',
    literatureReview: '',
    methodology: '',
    resultsDiscussion: '',
    conclusion: '',
  });
  const [citations, setCitations] = useState('');
  const [figuresTables, setFiguresTables] = useState([]);
  const [ethicalStatements, setEthicalStatements] = useState('');
  const [licensingInfo, setLicensingInfo] = useState('');
  const [acknowledgments, setAcknowledgments] = useState('');
  const [file, setFile] = useState(null);
  const [doi, setDoi] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [researchGateLink, setResearchGateLink] = useState('');
  const [additionalLinks, setAdditionalLinks] = useState([]);
  const [currentLink, setCurrentLink] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Handle adding a keyword
  const handleAddKeyword = () => {
    if (currentKeyword.trim() && keywords.length < 5) {
      if (keywords.includes(currentKeyword.trim())) {
        setSnackbarMessage('Keyword must be unique.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  // Handle removing a keyword
  const handleRemoveKeyword = (index) => {
    const updatedKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(updatedKeywords);
  };

  // Handle adding a link
  const handleAddLink = () => {
    if (currentLink.trim()) {
      if (additionalLinks.includes(currentLink.trim())) {
        setSnackbarMessage('Link must be unique.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      setAdditionalLinks([...additionalLinks, currentLink.trim()]);
      setCurrentLink('');
    }
  };

  // Handle removing a link
  const handleRemoveLink = (index) => {
    const updatedLinks = additionalLinks.filter((_, i) => i !== index);
    setAdditionalLinks(updatedLinks);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (
      !authorInfo.fullName ||
      !title ||
      !abstract ||
      keywords.length === 0 ||
      !researchContent.introduction ||
      !researchContent.literatureReview ||
      !researchContent.methodology ||
      !researchContent.resultsDiscussion ||
      !researchContent.conclusion ||
      !citations ||
      !ethicalStatements ||
      !licensingInfo ||
      !acknowledgments ||
      !file
    ) {
      setSnackbarMessage('Please fill out all required fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Prepare publication data
    const publicationData = {
      authorInfo,
      title,
      abstract,
      keywords,
      researchContent,
      citations,
      figuresTables,
      ethicalStatements,
      licensingInfo,
      acknowledgments,
      file,
      doi,
      githubRepo,
      researchGateLink,
      additionalLinks,
    };

    // Pass data to parent component
    onSave(publicationData);

    // Close the modal
    onClose();
  };

  // Handle closing the Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ color: '#2c3e50', mb: 3 }}>
        Add Personal Publication
      </Typography>

      {/* Author Information */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Person sx={{ mr: 1, color: '#3498db' }} />
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
            Author Information
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={authorInfo.fullName}
              onChange={(e) => setAuthorInfo({ ...authorInfo, fullName: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Affiliation"
              value={authorInfo.affiliation}
              onChange={(e) => setAuthorInfo({ ...authorInfo, affiliation: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={authorInfo.email}
              onChange={(e) => setAuthorInfo({ ...authorInfo, email: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Information"
              value={authorInfo.contact}
              onChange={(e) => setAuthorInfo({ ...authorInfo, contact: e.target.value })}
              required
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Title & Abstract */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Title sx={{ mr: 1, color: '#3498db' }} />
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
            Title & Abstract
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="Abstract"
          multiline
          rows={4}
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required
        />
      </Paper>

      {/* Keywords */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Label sx={{ mr: 1, color: '#3498db' }} />
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
            Keywords
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Add Keyword"
            value={currentKeyword}
            onChange={(e) => setCurrentKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
          />
          <IconButton onClick={handleAddKeyword} disabled={keywords.length >= 5 || !currentKeyword.trim()}>
            <Add />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {keywords.map((keyword, index) => (
            <Chip
              key={index}
              label={keyword}
              onDelete={() => handleRemoveKeyword(index)}
              deleteIcon={<Delete />}
              sx={{ mb: 1, backgroundColor: '#e3f2fd', color: '#1976d2' }}
            />
          ))}
        </Box>
      </Paper>

      {/* Research Content */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Article sx={{ mr: 1, color: '#3498db' }} />
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
            Research Content
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Introduction"
          multiline
          rows={4}
          value={researchContent.introduction}
          onChange={(e) => setResearchContent({ ...researchContent, introduction: e.target.value })}
          required
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="Literature Review"
          multiline
          rows={4}
          value={researchContent.literatureReview}
          onChange={(e) => setResearchContent({ ...researchContent, literatureReview: e.target.value })}
          required
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="Methodology"
          multiline
          rows={4}
          value={researchContent.methodology}
          onChange={(e) => setResearchContent({ ...researchContent, methodology: e.target.value })}
          required
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="Results & Discussion"
          multiline
          rows={4}
          value={researchContent.resultsDiscussion}
          onChange={(e) => setResearchContent({ ...researchContent, resultsDiscussion: e.target.value })}
          required
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="Conclusion & Future Work"
          multiline
          rows={4}
          value={researchContent.conclusion}
          onChange={(e) => setResearchContent({ ...researchContent, conclusion: e.target.value })}
          required
        />
      </Paper>

      {/* Citations & References */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FormatQuote sx={{ mr: 1, color: '#3498db' }} />
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
            Citations & References
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Citations"
          multiline
          rows={4}
          value={citations}
          onChange={(e) => setCitations(e.target.value)}
          required
        />
      </Paper>

      {/* Figures, Tables & Appendices */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Image sx={{ mr: 1, color: '#3498db' }} />
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
            Figures, Tables & Appendices
          </Typography>
        </Box>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="contained" component="span" startIcon={<Upload />}>
            Upload File
          </Button>
        </label>
        {file && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Uploaded File: {file.name}
          </Typography>
        )}
      </Paper>

      {/* Compliance & Ethical Statements */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Gavel sx={{ mr: 1, color: '#3498db' }} />
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
            Compliance & Ethical Statements
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Ethical Statements"
          multiline
          rows={4}
          value={ethicalStatements}
          onChange={(e) => setEthicalStatements(e.target.value)}
          required
        />
      </Paper>

      {/* Licensing & Copyright Information */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Copyright sx={{ mr: 1, color: '#3498db' }} />
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
            Licensing & Copyright Information
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Licensing Information"
          value={licensingInfo}
          onChange={(e) => setLicensingInfo(e.target.value)}
          required
        />
      </Paper>

      {/* Acknowledgments */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ThumbUp sx={{ mr: 1, color: '#3498db' }} />
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
            Acknowledgments
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Acknowledgments"
          multiline
          rows={4}
          value={acknowledgments}
          onChange={(e) => setAcknowledgments(e.target.value)}
          required
        />
      </Paper>

      {/* Additional Links */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Link sx={{ mr: 1, color: '#3498db' }} />
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
            Additional Links
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="DOI (Digital Object Identifier)"
          value={doi}
          onChange={(e) => setDoi(e.target.value)}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="GitHub Repository"
          value={githubRepo}
          onChange={(e) => setGithubRepo(e.target.value)}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="ResearchGate Link"
          value={researchGateLink}
          onChange={(e) => setResearchGateLink(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Add Additional Link"
            value={currentLink}
            onChange={(e) => setCurrentLink(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
          />
          <IconButton onClick={handleAddLink} disabled={!currentLink.trim()}>
            <Add />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {additionalLinks.map((link, index) => (
            <Chip
              key={index}
              label={link}
              onDelete={() => handleRemoveLink(index)}
              deleteIcon={<Delete />}
              sx={{ mb: 1, backgroundColor: '#e3f2fd', color: '#1976d2' }}
            />
          ))}
        </Box>
      </Paper>

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={handleSubmit}
          size="large"
          sx={{ borderRadius: 2, boxShadow: 2 }}
        >
          Save Publication
        </Button>
      </Box>

      {/* Snackbar for Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const PersonalPublications = () => {
  const [publications, setPublications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Handle opening the modal
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Handle saving a publication
  const handleSavePublication = (publicationData) => {
    if (publications.length < 5) {
      setPublications([...publications, publicationData]);
    } else {
      alert('You can only add up to 5 publications.');
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{ color: '#2c3e50', mb: 4 }}>
        Personal Publications
      </Typography>

      {/* Add Publication Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleOpenModal}
        disabled={publications.length >= 5}
        sx={{ mb: 4 }}
      >
        Add a Personal Publication
      </Button>

      {/* Publication List */}
      <List>
        {publications.map((publication, index) => (
          <ListItem key={index} sx={{ mb: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 2 }}>
            <ListItemText
              primary={publication.title}
              secondary={`By ${publication.authorInfo.fullName}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit">
                <Edit />
              </IconButton>
              <IconButton edge="end" aria-label="delete">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Modal for Adding Publications */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '800px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 3,
            overflowY: 'auto',
            maxHeight: '90vh',
          }}
        >
          <PersonalPublicationForm onSave={handleSavePublication} onClose={handleCloseModal} />
        </Box>
      </Modal>
    </Box>
  );
};

export default PersonalPublications;