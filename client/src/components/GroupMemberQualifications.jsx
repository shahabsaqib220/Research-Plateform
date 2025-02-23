'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Grid,
  Card,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Snackbar,
  Alert,
  Dialog, DialogTitle, DialogContent, DialogActions 
} from "@mui/material";
import {
  SchoolOutlined,
  EngineeringOutlined,
  BadgeOutlined,
  CalendarMonth,
  AddCircle,
  Delete
} from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import WarningIcon from "@mui/icons-material/Warning";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { addDegree, removeDegree, updateDegree, resetDegrees } from '@/redux/slices/educationSlice';
import GroupMemberDashboardProfile from "./GroupMemberDashoardProfile";
import { degreesList, fieldsList, institutionsList } from '@/utils/educationalData'; 
import { useGroupMemberAuth } from '@/services/GroupMemberAuthContext';
import axiosInstance from '@/services/axiosInstance';

const EducationalBackground = () => {
  const { user, isAuthenticated } = useGroupMemberAuth();
  const [educationalData, setEducationalData] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [degreeToRemoveIndex, setDegreeToRemoveIndex] = useState(null);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const degreesData = useSelector((state) => state.education.degrees);
  const maxDegrees = useSelector((state) => state.education.maxDegrees);
  const [newDegree, setNewDegree] = useState({
    degree: '',
    field: '',
    institution: '',
    startDate: '',
    endDate: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false); // Separate state for success message

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/user-login'); 
    }
  }, [isAuthenticated, router]);

  const truncateText = (text) => {
    const words = text.split(" ");
    return words.length > 2 ? `${words.slice(0, 2).join(" ")}...` : text;
  };

  useEffect(() => {
    const fetchEducation = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await axiosInstance.get(`/member/group-member/education/${user.id}`);
        if (response.status === 200) {
          setEducationalData(response.data.groupMember.education);
        } else {
          setError("Failed to get the educational data");
        }
      } catch (err) {
        console.error("Error getting the educational data", err);
        setError("Error getting the information");
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [isAuthenticated, user.id]);

  useEffect(() => {
    const isValid =
      newDegree.degree.trim() !== '' &&
      newDegree.field.trim() !== '' &&
      newDegree.institution.trim() !== '' &&
      newDegree.startDate.trim() !== '' &&
      newDegree.endDate.trim() !== '' &&
      new Date(newDegree.startDate) <= new Date(newDegree.endDate);
  
    setIsFormValid(isValid);
  }, [newDegree]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDegree({ ...newDegree, [name]: value });
  
    if (name === 'startDate' || name === 'endDate') {
      const startDate = name === 'startDate' ? value : newDegree.startDate;
      const endDate = name === 'endDate' ? value : newDegree.endDate;
  
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        setIsFormValid(false);
        setError('End Date should be after Start Date');
        setSnackbarOpen(true); // Show error Snackbar
      } else {
        setIsFormValid(
          newDegree.degree.trim() !== '' &&
          newDegree.field.trim() !== '' &&
          newDegree.institution.trim() !== '' &&
          startDate.trim() !== '' &&
          endDate.trim() !== ''
        );
        setError('');
      }
    } else {
      setIsFormValid(
        newDegree.degree.trim() !== '' &&
        newDegree.field.trim() !== '' &&
        newDegree.institution.trim() !== '' &&
        newDegree.startDate.trim() !== '' &&
        newDegree.endDate.trim() !== ''
      );
    }
  };

  const handleAddDegree = () => {
    if (isFormValid) {
      dispatch(addDegree(newDegree));
      setNewDegree({
        degree: '',
        field: '',
        institution: '',
        startDate: '',
        endDate: '',
      });
      setSuccessSnackbarOpen(true); // Show success Snackbar
    } else {
      setSnackbarOpen(true); // Show error Snackbar if validation fails
    }
  };

  const handleRemoveDegree = (index) => {
    setDegreeToRemoveIndex(index);
    setOpenModal(true); // Open the modal
  };

  const handleConfirmDelete = async () => {
    if (degreeToRemoveIndex === null) return;
  
    try {
      const response = await axiosInstance.delete(`/member/group-member-remove/education`, {
        data: {
          groupMemberId: user.id, // Include the group member ID
          index: degreeToRemoveIndex, // Send the index to be removed
        },
      });
  
      if (response.status === 200) {
        setEducationalData(response.data.education); // Update state with the new education array
        console.log("Education entry deleted successfully");
      } else {
        setError("Failed to delete the degree");
      }
    } catch (error) {
      console.error("Error deleting education:", error);
      setError("Error deleting education");
    } finally {
      setOpenModal(false);
    }
  };

  const handleFinish = async () => {
    try {
      const payload = { education: degreesData };
      const response = await axiosInstance.put(`/member/group-member-education/${user.id}/education`, payload);
      if (response.status === 200) {
        setEducationalData(response.data.groupMember.education);
        dispatch(resetDegrees()); // Clear the Redux state
        setSuccessSnackbarOpen(true); // Show success Snackbar
        setError('');
      } else {
        setError("Failed to update the education");
        setSnackbarOpen(true); // Show error Snackbar
      }
    } catch (err) {
      console.error("Error updating educational background", err);
      setError('An error occurred while updating your educational background. Please try again.');
      setSnackbarOpen(true); // Show error Snackbar
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSuccessSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  const showForm = degreesData.length + educationalData.length < maxDegrees;

  return (
    <>
      <GroupMemberDashboardProfile />
      <div className="p-6">
         {/* Table for degrees fetched from backend */}
         {educationalData.length > 0 && (
          <div>
            <Typography variant="h6" gutterBottom>
              Degrees from Backend:
            </Typography>
            {educationalData.map((degree, index) => (
              <Card key={index} sx={{ mb: 2, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Box display="flex" alignItems="center">
                      <SchoolOutlined color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        Degree: {degree.degree}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box display="flex" alignItems="center">
                      <EngineeringOutlined color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        Field: {degree.field}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box display="flex" alignItems="center">
                      <BadgeOutlined color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        Institution: {degree.institution}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <CalendarMonth color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        Start Date: {degree.startDate}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <CalendarMonth color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        End Date: {degree.endDate}
                      </Typography>
                    </Box>
                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: { xs: "flex-end", md: "flex-end" } }}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleRemoveDegree(index)}
                        size="small"
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </div>
        )}
        <Typography variant="h6" gutterBottom>
          Educational Background
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          You can add up to {maxDegrees} degrees.
        </Typography>

        {/* Table for degrees stored in Redux state */}
        {degreesData.length > 0 && (
          <div>
            <Typography variant="h6" gutterBottom>
              Degrees to be added:
            </Typography>
            {degreesData.map((degree, index) => (
              <Card key={index} sx={{ mb: 2, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Box display="flex" alignItems="center">
                      <SchoolOutlined color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        Degree: {degree.degree}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box display="flex" alignItems="center">
                      <EngineeringOutlined color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        Field: {degree.field}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box display="flex" alignItems="center">
                      <BadgeOutlined color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        Institution: {degree.institution}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <CalendarMonth color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        Start Date: {degree.startDate}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <CalendarMonth color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        End Date: {degree.endDate}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </div>
        )}

        {/* Form to add a new degree */}
        {showForm && (
          <Card sx={{ mt: 2, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Degree</InputLabel>
                  <Select
                    name="degree"
                    value={newDegree.degree}
                    label="Degree"
                    onChange={handleInputChange}
                    renderValue={(selected) => truncateText(selected)} // Truncate when selected
                  >
                    {degreesList.map((item, index) => (
                      <MenuItem key={`${item}-${index}`} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Field</InputLabel>
                  <Select
                    name="field"
                    value={newDegree.field}
                    label="Field"
                    onChange={handleInputChange}
                    renderValue={(selected) => truncateText(selected)} // Truncate when selected
                  >
                    {fieldsList.map((item, index) => (
                      <MenuItem key={`${item}-${index}`} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Institution</InputLabel>
                  <Select
                    name="institution"
                    value={newDegree.institution}
                    label="Institution"
                    onChange={handleInputChange}
                    renderValue={(selected) =>
                      selected
                        ? selected.split(" ").slice(0, 3).join(" ") +
                          (selected.split(" ").length > 3 ? "..." : "")
                        : ""
                    }
                  >
                    {institutionsList.map((item, index) => (
                      <MenuItem key={`${item}-${index}`} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Start Date (YYYY-MM)"
                  type="month"
                  name="startDate"
                  value={newDegree.startDate}
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="End Date (YYYY-MM)"
                  type="month"
                  name="endDate"
                  value={newDegree.endDate}
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircle />}
                  onClick={handleAddDegree}
                  disabled={!isFormValid}
                  fullWidth
                >
                  Add Degree
                </Button>
              </Grid>
            </Grid>
          </Card>
        )}

     

        {degreesData.length > 0 && (
          <Button
            variant="contained"
            color="success"
            onClick={handleFinish}
            sx={{ mt: 2 }}
          >
            Finish
          </Button>
        )}

        {/* Success Snackbar */}
        <Snackbar
          open={successSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleSuccessSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position at bottom center on desktop
        >
          <Alert onClose={handleSuccessSnackbarClose} severity="success" sx={{ width: '100%' }}>
            Degree added successfully!
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position at top center on mobile
        >
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
             <WarningIcon color="error" /> 
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to remove this education entry? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ padding: "16px", justifyContent: "space-between" }}>
            <Button onClick={() => setOpenModal(false)} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} variant="contained" color="error">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default EducationalBackground;