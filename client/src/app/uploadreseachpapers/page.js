'use client';
import React, { useState } from 'react';
import { addFormData, removeFormData, selectFormData } from '@/redux/slices/formDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Typography, Paper, InputLabel, FormHelperText, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

const MUIFormWithImage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    file: null,
    tags: [],
    keywords: [],
    journals: [],
    publicationLinks: [],
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState({});
  const submittedData = useSelector(selectFormData);
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
      setFileName(files[0].name);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddTag = (name, value) => {
    if (formData[name].length < 5 && value.trim() !== '') {
      setFormData({ ...formData, [name]: [...formData[name], value.trim()] });
    }
  };

  const handleDeleteTag = (name, tagToDelete) => {
    setFormData({
      ...formData,
      [name]: formData[name].filter((tag) => tag !== tagToDelete),
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.file) newErrors.file = 'File is required.';
    if (formData.tags.length === 0) newErrors.tags = 'At least one tag is required.';
    if (formData.keywords.length === 0) newErrors.keywords = 'At least one keyword is required.';
    if (!formData.startDate) newErrors.startDate = 'Start date is required.';
    if (!formData.endDate) newErrors.endDate = 'End date is required.';
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date cannot be earlier than start date.';
    }
    if (formData.journals.length === 0) newErrors.journals = 'At least one journal is required.';
    if (formData.publicationLinks.length === 0) newErrors.publicationLink = 'At least one publication link is required.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (submittedData.length >= 3) {
      alert('You can only submit the form up to 3 times.');
      return;
    }
    const newEntry = { ...formData, id: Date.now(), fileName }; // Include fileName in the new entry
    dispatch(addFormData(newEntry));
    setFormData({
      file: null,
      tags: [],
      keywords: [],
      journals: [],
      publicationLinks: [],
      startDate: '',
      endDate: '',
    });
    setFileName('');
  };

  const handleDeleteRow = (id) => {
    dispatch(removeFormData(id));
  };

  const handleNext = () => {
    console.log('Submitted Data:', submittedData);
    router.push("/phoneNumber");
    alert('Process finished!');
  };

  return (
    <>
      <Navbar />
      <Box sx={{ padding: '2rem' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Upload Your Previous Research Papers
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <img
              src="https://img.freepik.com/free-vector/copywriting-social-media-post-content-marketing-internet-commercial-cartoon-character-writing-text-advertising-promotional-strategy-concept-illustration_335657-2066.jpg"
              alt="Form Illustration"
              style={{
                width: '100%',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: '2rem' }}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ marginBottom: '1rem' }}>
                  <InputLabel
                    htmlFor="file-upload"
                    sx={{
                      display: 'inline-block',
                      backgroundColor: 'primary.main',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    {fileName || 'Choose File'}
                  </InputLabel>
                  <input
                    type="file"
                    name="file"
                    id="file-upload"
                    accept=".png,.jpg,.jpeg,.pdf,.docx,.pptx"
                    onChange={handleChange}
                    hidden
                  />
                  {errors.file && (
                    <FormHelperText error>{errors.file}</FormHelperText>
                  )}
                </Box>
                <Box sx={{ marginBottom: '1rem' }}>
                  <TextField
                    label="Tags"
                    variant="outlined"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag('tags', e.target.value);
                        e.target.value = '';
                      }
                    }}
                    error={!!errors.tags}
                    helperText={errors.tags}
                    fullWidth
                  />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleDeleteTag('tags', tag)}
                        sx={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ marginBottom: '1rem' }}>
                  <TextField
                    label="Keywords"
                    variant="outlined"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag('keywords', e.target.value);
                        e.target.value = '';
                      }
                    }}
                    error={!!errors.keywords}
                    helperText={errors.keywords}
                    fullWidth
                  />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {formData.keywords.map((keyword) => (
                      <Chip
                        key={keyword}
                        label={keyword}
                        onDelete={() => handleDeleteTag('keywords', keyword)}
                        sx={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ marginBottom: '1rem' }}>
                  <TextField
                    label="Journals"
                    variant="outlined"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag('journals', e.target.value);
                        e.target.value = '';
                      }
                    }}
                    error={!!errors.journals}
                    helperText={errors.journals}
                    fullWidth
                  />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {formData.journals.map((journal) => (
                      <Chip
                        key={journal}
                        label={journal}
                        onDelete={() => handleDeleteTag('journals', journal)}
                        sx={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ marginBottom: '1rem' }}>
                  <TextField
                    label="Publication Links"
                    variant="outlined"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag('publicationLinks', e.target.value);
                        e.target.value = '';
                      }
                    }}
                    error={!!errors.publicationLink}
                    helperText={errors.publicationLink}
                    fullWidth
                  />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {formData.publicationLinks.map((link) => (
                      <Chip
                        key={link}
                        label={link}
                        onDelete={() => handleDeleteTag('publicationLinks', link)}
                        sx={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                      />
                    ))}
                  </Box>
                </Box>
                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ marginTop: '1rem' }}
                />
                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ marginTop: '1rem' }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ marginTop: '1.5rem', width: '100%' }}
                >
                  Submit
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
        {submittedData.length > 0 && (
          <Box sx={{ marginTop: '2rem' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Keywords</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Journals</TableCell>
                    <TableCell>Publication Links</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submittedData.map((data) => (
                    <TableRow key={data.id}>
                      <TableCell>{data.fileName}</TableCell>
                      <TableCell>{data.tags.join(', ')}</TableCell>
                      <TableCell>{data.keywords.join(', ')}</TableCell>
                      <TableCell>{data.startDate}</TableCell>
                      <TableCell>{data.endDate}</TableCell>
                      <TableCell>{data.journals.join(', ')}</TableCell>
                      <TableCell>{data.publicationLinks.join(', ')}</TableCell>
                      <TableCell>
                        <Button variant="outlined" color="secondary" onClick={() => handleDeleteRow(data.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained" color="success" onClick={handleNext} sx={{ marginTop: "1rem" }}>
              Next
            </Button>
          </Box>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default MUIFormWithImage;