'use client';
import React, { useState, useEffect } from 'react';
import { useGroupMemberAuth } from '@/services/GroupMemberAuthContext';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Grid,
  Typography,
  Select,
  FormControl,
  InputLabel,
  Button,
  Snackbar,
  Alert,
  Modal,
} from '@mui/material';
import { School, Work, Group, Close, Check, Add, Edit } from '@mui/icons-material';
import axiosInstance from '@/services/axiosInstance';

// Import data from the external file
import { designations, roles } from '@/utils/designationsAndRoles';

const MemberProfileForm = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useGroupMemberAuth();
  const [designation, setDesignation] = useState('');
  const [researchInterests, setResearchInterests] = useState([]);
  const [currentInterest, setCurrentInterest] = useState('');
  const [role, setRole] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null); // State to store fetched profile data
  const [editModalOpen, setEditModalOpen] = useState(false); // State for edit modal

  // Fetch profile data on component load
  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!isAuthenticated || !user) {
      router.push('/user-login');
      return; // Stop further execution
    }

    // Fetch profile data if user is authenticated
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get(`/groupmember/research/group-member/get/contribution/${user.id}`);
        console.log('Fetched Profile Data:', response.data); // Debugging

        if (response.data && response.data.groupMemberContribution) {
          const { designation, researchInterests, role } = response.data.groupMemberContribution;
          setProfileData(response.data.groupMemberContribution); // Set the nested object
          setDesignation(designation);
          setResearchInterests(researchInterests);
          setRole(role);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, user, router]);

  // Handle adding a research interest
  const handleAddInterest = () => {
    if (currentInterest.trim() && researchInterests.length < 5) {
      if (researchInterests.includes(currentInterest.trim())) {
        setSnackbarOpen(true); // Show Snackbar for duplicate interest
        return;
      }
      setResearchInterests([...researchInterests, currentInterest.trim()]);
      setCurrentInterest('');
    }
  };

  // Handle removing a research interest
  const handleRemoveInterest = (index) => {
    const updatedInterests = researchInterests.filter((_, i) => i !== index);
    setResearchInterests(updatedInterests);
  };

  // Handle adding data to profile
  const handleAddToProfile = async () => {
    const profileData = {
      designation,
      researchInterests,
      role,
      groupMemberId: user.id,
    };

    try {
      const response = await axiosInstance.post('/groupmember/research/group-member/create/contribution', profileData);
      if (response.data) {
        setProfileData(response.data.groupMemberContribution); // Update state with new profile data
      }
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  };

  // Handle opening the edit modal
  const handleEditModalOpen = () => {
    setEditModalOpen(true);
  };

  // Handle closing the edit modal
  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  // Handle updating profile data
  const handleUpdateProfile = async () => {
    const updatedProfileData = {
      designation,
      researchInterests,
      role,
    };

    try {
      const response = await axiosInstance.put(
        `/groupmember/research/group-member/update/contribution/${user.id}`,
        updatedProfileData
      );
      if (response.data) {
        setProfileData(response.data.groupMemberContribution); // Update state with new profile data
        handleEditModalClose(); // Close the modal
      }
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
  };

  // Handle closing the Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '800px', margin: 'auto' }}>
      {/* Typography with Icon at the Top */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Add sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" component="h1" fontWeight="bold">
          {profileData ? 'Your Profile Details' : 'Add your Member Profile Details'}
        </Typography>
      </Box>

      {profileData ? (
        // Display profile details
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <School sx={{ fontSize: 24, mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">
              Your Designation in this Group: <strong>{profileData.designation}</strong>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Group sx={{ fontSize: 24, mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">
              Your Role in this Group: <strong>{profileData.role}</strong>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Work sx={{ fontSize: 24, mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">
              Your Research Interests related to this Group:
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 6 }}>
            {profileData.researchInterests.map((interest, index) => (
              <Chip key={index} label={interest} sx={{ mb: 1 }} />
            ))}
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            onClick={handleEditModalOpen}
            sx={{ mt: 3 }}
            style={{textTransform: 'none', borderRadius: '20px'}}
          >
            Edit Profile
          </Button>
        </Box>
      ) : (
        // Display form
        <Grid container spacing={3}>
          {/* Designation Dropdown */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="designation-label">Designation</InputLabel>
              <Select
                labelId="designation-label"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                label="Designation"
                
                startAdornment={<School sx={{ mr: 1 }} />}
              >
                {designations.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Role in Group Dropdown */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Role in Group</InputLabel>
              <Select
                labelId="role-label"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Role in Group"
                startAdornment={<Group sx={{ mr: 1 }} />}
              >
                {roles.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Research Interests Input */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Research Interests"
              value={currentInterest}
              onChange={(e) => setCurrentInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
              InputProps={{
                startAdornment: <Work sx={{ mr: 1 }} />,
                endAdornment: (
                  <IconButton onClick={handleAddInterest} disabled={researchInterests.length >= 5 || !currentInterest.trim()}>
                    <Check />
                  </IconButton>
                ),
              }}
              helperText={
                researchInterests.length >= 5
                  ? 'Maximum 5 interests allowed.'
                  : 'Press Enter or click the icon to add an interest.'
              }
            />
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {researchInterests.map((interest, index) => (
                <Chip
                  key={index}
                  label={interest}
                  onDelete={() => handleRemoveInterest(index)}
                  deleteIcon={<Close />}
                />
              ))}
            </Box>
          </Grid>

          {/* Add to Profile Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<Add />}
              onClick={handleAddToProfile}
              disabled={!designation || researchInterests.length === 0 || !role}
            >
              Add to your profile
            </Button>
          </Grid>
        </Grid>
      )}

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={handleEditModalClose}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: { xs: '90%', sm: '80%', md: '600px' }, // Responsive width
      maxWidth: '100%', // Ensure it doesn't overflow on small screens
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
      borderRadius: 2,
      overflowY: 'auto', // Enable scrolling for small screens
      maxHeight: '90vh', // Limit height to prevent overflow
    }}
  >
    <Typography variant="h6" component="h2" mb={3} sx={{ fontWeight: 'bold' }}>
      Edit Profile
    </Typography>
    <Grid container spacing={3}>
      {/* Designation Dropdown */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="edit-designation-label">Designation</InputLabel>
          <Select
            labelId="edit-designation-label"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            label="Designation"
            startAdornment={<School sx={{ mr: 1 }} />}
            sx={{ width: '100%' }}
          >
            {designations.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Role in Group Dropdown */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="edit-role-label">Role in Group</InputLabel>
          <Select
            labelId="edit-role-label"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Role in Group"
            startAdornment={<Group sx={{ mr: 1 }} />}
            sx={{ width: '100%' }}
          >
            {roles.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Research Interests Input */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Research Interests"
          value={currentInterest}
          onChange={(e) => setCurrentInterest(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
          InputProps={{
            startAdornment: <Work sx={{ mr: 1 }} />,
            endAdornment: (
              <IconButton onClick={handleAddInterest} disabled={researchInterests.length >= 5 || !currentInterest.trim()}>
                <Check />
              </IconButton>
            ),
          }}
          helperText={
            researchInterests.length >= 5
              ? 'Maximum 5 interests allowed.'
              : 'Press Enter or click the icon to add an interest.'
          }
        />
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {researchInterests.map((interest, index) => (
            <Chip
              key={index}
              label={interest}
              onDelete={() => handleRemoveInterest(index)}
              deleteIcon={<Close />}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      </Grid>

      {/* Update Profile Button */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpdateProfile}
          sx={{ mt: 2 }}
          style={{textTransform: 'none', borderRadius: '20px'}}
        >
          Update Profile
        </Button>
      </Grid>
    </Grid>
  </Box>
</Modal>

      {/* Snackbar for Duplicate Interests */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          The interest must be unique.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MemberProfileForm;