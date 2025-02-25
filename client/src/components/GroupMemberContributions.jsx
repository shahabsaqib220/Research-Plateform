'use client';
import React, { useState, useEffect } from 'react';
import { useGroupMemberAuth } from '@/services/GroupMemberAuthContext';
import { useRouter } from 'next/navigation';
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
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
  CircularProgress,
} from '@mui/material';
import { School, Work, Group, Close, Check, Add, Edit } from '@mui/icons-material';
import axiosInstance from '@/services/axiosInstance';
import { designations, roles } from '@/utils/designationsAndRoles';
import GroupMemberDashboardProfile from './GroupMemberDashoardProfile';

const MemberProfileForm = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useGroupMemberAuth();
  const [designation, setDesignation] = useState('');
  const [researchInterests, setResearchInterests] = useState([]);
  const [currentInterest, setCurrentInterest] = useState('');
  const [role, setRole] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // 'error' or 'success'
  const [profileData, setProfileData] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch profile data on component load
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/user-login');
      return;
    }

    fetchProfileData();
  }, [isAuthenticated, user, router]);

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(`/groupmember/research/group-member/get/contribution/${user.id}`);
      console.log('Fetched Profile Data:', response.data);

      if (response.data && response.data.groupMemberContribution) {
        const { designation, researchInterests, role } = response.data.groupMemberContribution;
        setProfileData(response.data.groupMemberContribution);
        setDesignation(designation);
        setResearchInterests(researchInterests);
        setRole(role);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setSnackbarMessage('Failed to fetch profile data.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handle adding a research interest
  const handleAddInterest = () => {
    if (currentInterest.trim() && researchInterests.length < 5) {
      if (researchInterests.includes(currentInterest.trim())) {
        setSnackbarMessage('The interest must be unique.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
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
    setLoading(true);
    const profileData = {
      designation,
      researchInterests,
      role,
      groupMemberId: user.id,
    };

    try {
      const response = await axiosInstance.post('/groupmember/research/group-member/create/contribution', profileData);
      if (response.data) {
        setProfileData(response.data.groupMemberContribution);
        setSnackbarMessage('Profile added successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchProfileData(); // Fetch latest data
      }
    } catch (error) {
      console.error('Error saving profile data:', error);
      setSnackbarMessage('Failed to add profile.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the edit modal
  const handleEditModalOpen = async () => {
    setEditModalOpen(true);
    await fetchProfileData(); // Fetch latest data before opening the modal
  };

  // Handle closing the edit modal
  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  // Handle updating profile data
  const handleUpdateProfile = async () => {
    if (researchInterests.length === 0) {
      setSnackbarMessage('Research Interest is Required.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
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
        setProfileData(response.data.groupMemberContribution);
        setSnackbarMessage('Profile updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchProfileData(); // Fetch latest data
        handleEditModalClose();
      }
    } catch (error) {
      console.error('Error updating profile data:', error);
      setSnackbarMessage('Failed to update profile.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle closing the Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <GroupMemberDashboardProfile />
      <Box>
        {/* Typography with Icon at the Top */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 8 }}>
          <Add sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h1" fontWeight="bold">
            {profileData ? 'Your Contributions in Group' : 'Add your Group Contributions'}
          </Typography>
        </Box>
        <Box sx={{ mt: 4, p: 3, borderRadius: '15px', background: '#FFFF', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
          {profileData ? (
            // Display profile details in a table
            <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', borderBottom: 'none' }}>
                      <School sx={{ fontSize: 20, mr: 2, color: 'primary.main' }} />
                      <Typography variant="body2">
                        Your Designation in this Group: <strong>{profileData.designation}</strong>
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', borderBottom: 'none' }}>
                      <Group sx={{ fontSize: 20, mr: 2, color: 'primary.main' }} />
                      <Typography variant="body2">
                        Your Role in this Group: <strong>{profileData.role}</strong>
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', borderBottom: 'none' }}>
                      <Work sx={{ fontSize: 20, mr: 2, color: 'primary.main' }} />
                      <Typography variant="body2">
                        Your Research Interests related to this Group:
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ borderBottom: 'none' }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 6 }}>
                        {profileData.researchInterests.map((interest, index) => (
                          <Chip
                            key={index}
                            label={interest}
                            size="small"
                            sx={{ mb: 1, backgroundColor: '#e3f2fd', color: '#1976d2' }} // Light blue background
                          />
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                onClick={handleEditModalOpen}
                sx={{ mt: 3 }}
                style={{ textTransform: 'none', borderRadius: '20px' }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Edit Profile'}
              </Button>
            </TableContainer>
          ) : (
            // Display form in a table
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
                      size="small"
                      sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }} // Light blue background
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
                  disabled={!designation || researchInterests.length === 0 || !role || loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Add to your profile'}
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Edit Modal */}
        <Modal open={editModalOpen} onClose={handleEditModalClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '80%', md: '600px' },
              maxWidth: '100%',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              overflowY: 'auto',
              maxHeight: '90vh',
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
                      sx={{ mb: 1, backgroundColor: '#e3f2fd', color: '#1976d2' }} // Light blue background
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
                  style={{ textTransform: 'none', borderRadius: '20px' }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update Profile'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>

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
    </>
  );
};

export default MemberProfileForm;