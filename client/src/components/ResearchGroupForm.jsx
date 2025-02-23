'use client';

import React, { useState, useContext, useEffect } from "react";
import axiosInstance from "@/services/axiosInstance";
import { AuthContext } from "@/services/AuthContext";
import Footer from "./Footer";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import {
  CircularProgress,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Groups,
  Science,
  Article,
  Description,
  Public,
  School,
  LocationOn,
  Link,
  Info,
  Save, Edit,
  Margin
} from "@mui/icons-material";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { universities } from "../utils/universities";
import { cities } from "../utils/cities";
import { markAssetError } from "next/dist/client/route-loader";

const ResearchGroupForm = () => {
  const [formData, setFormData] = useState({
    researchName: "",
    researchFields: "",
    researchIntroduction: "",
    researchTheme: "",
    institution: "",
    location: "",
    socialMediaLinks: {
      linkedin: "",
     
      googleScholar: "",
    },
    groupDescription: {
      overview: "",
      mission: "",
      vision: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { isLoggedIn, user } = useContext(AuthContext);

  // Fetch research group information on component load
  useEffect(() => {
    const fetchResearchInfo = async () => {
      if (!isLoggedIn) return;
  
      setLoading(true);
      try {
        const response = await axiosInstance.get("/group/get-reseach-information");
        const data = response.data.research;
  
     
  
  
        setFormData({
          researchName: data.researchName,
          researchFields: data.researchFields.join(", "),
          researchIntroduction: data.researchIntroduction,
          researchTheme: data.researchTheme,
          institution: data.institution,
          location: data.location,
          socialMediaLinks: {
            linkedin: data.socialMediaLinks.linkedin,
          
            googleScholar: data.socialMediaLinks.googleScholar,
          },
          groupDescription: {
            overview: data.groupDescription.overview,
            mission: data.groupDescription.mission,
            vision: data.groupDescription.vision,
          },
        });
        setHasData(true);
      } catch (err) {
        console.error("Error fetching research information:", err);
        setError("Failed to fetch research information.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchResearchInfo();
  }, [isLoggedIn]);

  const truncateText = (text) => {
    const words = text.split(" ");
    return words.length > 2 ? `${words.slice(0, 2).join(" ")}...` : text;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };


  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      socialMediaLinks: {
        ...prevState.socialMediaLinks,
        [name]: value, // This will now correctly update to an empty string if cleared
      },
    }));
  };

  const handleGroupDescriptionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      groupDescription: {
        ...prevState.groupDescription,
        [name]: value,
      },
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "researchName",
      "researchFields",
      "researchIntroduction",
      "researchTheme",
      "institution",
      "location",
    ];
    const groupDescriptionFields = ["overview", "mission", "vision"];
    const socialMediaFields = ["linkedin", "googleScholar"];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill out the ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.`);
        return false;
      }
    }

    for (const field of groupDescriptionFields) {
      if (!formData.groupDescription[field]) {
        setError(`Please fill out the group description ${field}.`);
        return false;
      }
    }

    for (const field of socialMediaFields) {
      if (!formData.socialMediaLinks[field]) {
        setError(`Please fill out the ${field.replace(/([A-Z])/g, " $1").toLowerCase()} URL.`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!isLoggedIn) {
      setError("You must be logged in to save information.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.put("/group/reseach-information", formData);
      console.log("Response:", response.data);

      setSuccess("Information saved successfully.");
      setIsEditing(false);
      setHasData(true);
    } catch (err) {
      console.error("Error saving information:", err);
      setError("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccess(null);
    setError(null);
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <>
      <Box sx={{ p: 2, ml: { lg: '288px' }, mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: 'text.primary' }}>
          <Groups sx={{ verticalAlign: 'middle', mr: 1, fontSize: '2rem' }} />
          Research{" "}
          <span style={{ textDecoration: 'underline', textDecorationColor: '#3f51b5', textUnderlineOffset: '0.3em' }}>
            Group Information
          </span>
        </Typography>

        {!hasData && (
        <Box display="flex" alignItems="center" sx={{ mb: 4, gap: 1 }}>
        <Info sx={{ color: 'info.main', fontSize: '1.5rem' }} />
        <Typography 
          variant="body1" 
          color="text.primary" 
          sx={{ fontWeight: 400, fontSize: { xs: '0.95rem', sm: '1rem' } }}
        >
          Add your <Typography component="span" color="primary.main" fontWeight="bold">research group</Typography> information.
        </Typography>
      </Box>
      
        )}

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary', fontWeight: 'bold' }}>
                <Science sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem', }} />
                Research Group Name
              </Typography>
              <TextField
  fullWidth
  name="researchName"
  value={formData.researchName}
  onChange={handleInputChange}
  disabled={!isEditing}
  placeholder="Enter Research Name"
  variant="outlined"
  error={!formData.researchName && isEditing}
  helperText={!formData.researchName && isEditing ? "This field is required." : ""}
  sx={{ 
    borderRadius: '10px', 
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px', 
      '& fieldset': { borderColor: 'grey.400' },
      '&:hover fieldset': { borderColor: 'primary.main' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
    },
    '& .MuiInputBase-input': {
      padding: '12px 14px',
    }
  }}
/>

            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary', fontWeight: 'bold' }}>
                <Article sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
                Research Group Fields
              </Typography>
              <TextField
                fullWidth
                name="researchFields"
                value={formData.researchFields}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter up to 5 fields, separated by commas"
                variant="outlined"
                helperText="Example: AI, Machine Learning, Data Science, Robotics, NLP"

                error={!formData.researchFields && isEditing}
                sx={{ 
                  borderRadius: '10px', 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px', 
                    '& fieldset': { borderColor: 'grey.400' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                  '& .MuiInputBase-input': {
                    padding: '12px 14px',
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary', fontWeight: 'bold' }}>
                <Description sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
                Research Group Introduction
              </Typography>
              <TextField
                fullWidth
                name="researchIntroduction"
                value={formData.researchIntroduction}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter Research Introduction"
                variant="outlined"
                multiline
                rows={4}
                error={!formData.researchIntroduction && isEditing}
                helperText={!formData.researchIntroduction && isEditing ? "This field is required." : ""}
                sx={{ 
                  borderRadius: '10px', 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px', 
                    '& fieldset': { borderColor: 'grey.400' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                  '& .MuiInputBase-input': {
                    padding: '12px 14px',
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary', fontWeight: 'bold' }}>
                <Public sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
                Research Group Theme
              </Typography>
              <TextField
                fullWidth
                name="researchTheme"
                value={formData.researchTheme}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter Research Theme"
                variant="outlined"
                multiline
                rows={4}
                error={!formData.researchTheme && isEditing}
                helperText={!formData.researchTheme && isEditing ? "This field is required." : ""}
                sx={{ 
                  borderRadius: '10px', 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px', 
                    '& fieldset': { borderColor: 'grey.400' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                  '& .MuiInputBase-input': {
                    padding: '12px 14px',
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
  <Typography variant="subtitle1" sx={{   color: 'text.primary', fontWeight: 'bold' }}>
    <School sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
    Institution
  </Typography>
  <FormControl fullWidth>
  
  <Select
  
    value={formData.institution}
    onChange={handleInputChange}
    disabled={!isEditing}
    variant="outlined"
    error={!formData.institution && isEditing}
    renderValue={(selected) => truncateText(selected)} // Truncate only in input field
    sx={{ 
      borderRadius: '10px', 
      '& .MuiOutlinedInput-root': {
        borderRadius: '10px', 
        '& fieldset': { borderColor: 'grey.400' },
        '&:hover fieldset': { borderColor: 'primary.main' },
        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
      },
      '& .MuiInputBase-input': {
        padding: '12px 14px',
      }
    }}
  >
    {universities.map((university) => (
      <MenuItem key={university} value={university}>
        {university} {/* Show full text inside dropdown */}
      </MenuItem>
    ))}
  </Select>
</FormControl>

</Grid>

<Grid item xs={12} md={6}>
  <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
    <LocationOn sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
    Location
  </Typography>
  <FormControl fullWidth>
   
    <Select
      
      value={formData.location}
      onChange={handleInputChange}
      disabled={!isEditing}
      variant="outlined"
      error={!formData.location && isEditing}
      renderValue={(selected) => truncateText(selected)} // Truncate only in input field
      sx={{ 
        borderRadius: '10px', 
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px', 
          '& fieldset': { borderColor: 'grey.400' },
          '&:hover fieldset': { borderColor: 'primary.main' },
          '&.Mui-focused fieldset': { borderColor: 'primary.main' },
        },
        '& .MuiInputBase-input': {
          padding: '12px 14px',
        }
      }}
    >
      {cities.map((city) => (
        <MenuItem key={city} value={city}>
          {city} {/* Show full text inside dropdown */}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary', fontWeight: 'bold' }}>
                <Link sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
                Social Media Links
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    LinkedIn URL
                  </Typography>
                  <TextField
                    fullWidth
                    name="linkedin"
                    value={formData.socialMediaLinks.linkedin}
                    onChange={handleSocialMediaChange}
                    disabled={!isEditing}
                    placeholder="LinkedIn URL"
                    variant="outlined"
                    error={!formData.socialMediaLinks.linkedin && isEditing}
                    helperText={!formData.socialMediaLinks.linkedin && isEditing ? "This field is required." : ""}
                    sx={{ 
                      borderRadius: '10px', 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px', 
                        '& fieldset': { borderColor: 'grey.400' },
                        '&:hover fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px 14px',
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Google Scholar URL
                  </Typography>
                  <TextField
                    fullWidth
                    name="googleScholar"
                    value={formData.socialMediaLinks.googleScholar}
                    onChange={handleSocialMediaChange}
                    disabled={!isEditing}
                    placeholder="Google Scholar URL"
                    variant="outlined"
                    error={!formData.socialMediaLinks.googleScholar && isEditing}
                    helperText={!formData.socialMediaLinks.googleScholar && isEditing ? "This field is required." : ""}
                    sx={{ 
                      borderRadius: '10px', 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px', 
                        '& fieldset': { borderColor: 'grey.400' },
                        '&:hover fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px 14px',
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary', fontWeight: 'bold' }}>
                <Description sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
                Group Description
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Overview
                  </Typography>
                  <TextField
                    fullWidth
                    name="overview"
                    value={formData.groupDescription.overview}
                    onChange={handleGroupDescriptionChange}
                    disabled={!isEditing}
                    placeholder="Overview"
                    variant="outlined"
                    multiline
                    rows={2}
                    error={!formData.groupDescription.overview && isEditing}
                    helperText={!formData.groupDescription.overview && isEditing ? "This field is required." : ""}
                    sx={{ 
                      borderRadius: '10px', 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px', 
                        '& fieldset': { borderColor: 'grey.400' },
                        '&:hover fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px 14px',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Mission
                  </Typography>
                  <TextField
                    fullWidth
                    name="mission"
                    value={formData.groupDescription.mission}
                    onChange={handleGroupDescriptionChange}
                    disabled={!isEditing}
                    placeholder="Mission"
                    variant="outlined"
                    multiline
                    rows={2}
                    error={!formData.groupDescription.mission && isEditing}
                    helperText={!formData.groupDescription.mission && isEditing ? "This field is required." : ""}
                    sx={{ 
                      borderRadius: '10px', 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px', 
                        '& fieldset': { borderColor: 'grey.400' },
                        '&:hover fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px 14px',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Vision
                  </Typography>
                  <TextField
                    fullWidth
                    name="vision"
                    value={formData.groupDescription.vision}
                    onChange={handleGroupDescriptionChange}
                    disabled={!isEditing}
                    placeholder="Vision"
                    variant="outlined"
                    multiline
                    rows={2}
                    error={!formData.groupDescription.vision && isEditing}
                    helperText={!formData.groupDescription.vision && isEditing ? "This field is required." : ""}
                    sx={{ 
                      borderRadius: '10px', 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px', 
                        '& fieldset': { borderColor: 'grey.400' },
                        '&:hover fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px 14px',
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
  <Button
    variant="contained"
    disabled={!isEditing || loading}
    onClick={handleSave}
    sx={{ 
      textTransform: 'none', 
      fontWeight: 'bold', 
      borderRadius: '10px', 
      px: 3, 
      py: 1.2, 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1 
    }}
  >
    {loading ? <CircularProgress size={20} color="inherit" /> : <TaskAltIcon fontSize="small" />}
    Save
  </Button>
  
  <Button
    variant="outlined"
    onClick={handleEdit}
    disabled={isEditing || loading}
    sx={{ 
      textTransform: 'none', 
      fontWeight: 'bold', 
      borderRadius: '10px', 
      px: 3, 
      py: 1.2, 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1 
    }}
  >
    <PublishedWithChangesIcon fontSize="small" />
    Edit
  </Button>
</Box>
        </Paper>
      </Box>

      <Snackbar open={!!error || !!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {error || success}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default ResearchGroupForm;