import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Skeleton,
  Typography,
  styled,
  Divider,
} from '@mui/material';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import { useGroupMemberAuth } from '@/services/GroupMemberAuthContext';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import axiosInstance from '@/services/axiosInstance';
import {
  FaCamera,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaFolderOpen,
  FaUser,
  FaInfoCircle,
} from 'react-icons/fa';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import GradingIcon from '@mui/icons-material/Grading';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import Footer from './Footer'; // Import the Footer component
import PhoneNumberInput from "@/components/GroupMemberPhoneNumber"

const ProfileContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  overflow: 'visible',
  padding: theme.spacing(4),
  marginTop: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
}));

const CoverPhoto = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 120,
  backgroundColor: theme.palette.primary.light,
  borderTopLeftRadius: theme.shape.borderRadius * 2,
  borderTopRightRadius: theme.shape.borderRadius * 2,
}));

const GroupMemberDashboardProfile = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useGroupMemberAuth();

  // const [lastFetchedImage, setLastFetchedImage] = useState(null); // ✅ Track last fetched image REMOVED - NOT USED

  const [imageFile, setImageFile] = useState(null);
  const [profileFetched, setProfileFetched] = useState(false);
  const [groupInfoFetched, setGroupInfoFetched] = useState(false);
  const [headContactFetched, setHeadContactFetched] = useState(false);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [groupInfo, setGroupInfo] = useState(null);
  const [phoneNumberAdded, setPhoneNumberAdded] = useState(false);
  const [groupHeadContact, setGroupHeadContact] = useState(null);
  const [contactLoading, setContactLoading] = useState(true);
  const [isFileValid, setIsFileValid] = useState(false); // State to track file validation

  useEffect(() => {
    if (!user || !isAuthenticated) {
      router.push('/user-login');
      return;
    }

    if (user?.profileImage && !profileFetched) {
      fetchProfileImage(user.profileImage);
      setProfileFetched(true);
    } else {
      setLoading(false);
    }

    if (user?.addedBy && !groupInfoFetched) {
      fetchGroupInfo();
      setGroupInfoFetched(true);
    }

    if (user?.addedBy && !headContactFetched) {
      fetchGroupHeadContact();
      setHeadContactFetched(true);
    }
  }, [user, isAuthenticated]);

  const fetchProfileImage = async (profileImage) => {
    if (!profileImage) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/member/profile-image/${profileImage}`, {
        responseType: 'blob',
      });

      setPreview(URL.createObjectURL(response.data));
    } catch (error) {
      console.error('Error fetching profile image:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchGroupHeadContact = async () => {
    try {
      setContactLoading(true);
      const response = await axiosInstance.get(`/member/group-head-contact/${user.addedBy}`);
      setGroupHeadContact(response.data);
    } catch (error) {
      console.error('Error fetching group head contact:', error);
    } finally {
      setContactLoading(false);
    }
  };

  const fetchGroupInfo = async () => {
    try {
      const response = await axiosInstance.get(`/member/group-info/${user.addedBy}`);
      setGroupInfo(response.data.group);
    } catch (error) {
      console.error('Error fetching group info:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      handleSnackbar('Please select an image file.', 'error');
      setIsFileValid(false);
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      handleSnackbar('Please select an image file up to 3MB only.', 'error');
      setIsFileValid(false);
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setIsFileValid(true); // Enable upload button
  };

  const handleUpload = async () => {
    if (!imageFile) {
      handleSnackbar('Please select an image to upload.', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await axiosInstance.post(
        `/member/member-upload-profile-image/${user?.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.fileId) {
        handleSnackbar('Profile image updated successfully!', 'success');
        // Optimistically update the user's profileImage
        if (user) {
          user.profileImage = response.data.fileId;
        }
      } else {
        handleSnackbar('Failed to update profile image.', 'error');
      }
    } catch (error) {
      console.error('Image upload failed:', error); // Added console error
      handleSnackbar('Image upload failed, please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };



  const handleSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Box>
              
        <Grid container spacing={4}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <ProfileContainer>
              <CoverPhoto />
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mt: 8,
                }}
              >
                {loading ? (
                  <Skeleton variant="circular" width={160} height={160} />
                ) : (
                  <Avatar
                    src={preview || '/default-avatar.png'} // Use a placeholder if no preview
                    sx={{ width: 160, height: 160, border: '4px solid white', boxShadow: 3 }}
                  />
                )}

                <Box mt={2}>
                  <Typography
                    variant="h6"
                    fontWeight="400"
                    color="black"
                    letterSpacing={0.3}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Roboto, sans-serif',
                      fontSize: { xs: '1.2rem', sm: '1.5rem' },
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#00796b',
                        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                    gutterBottom
                    >
                    {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
                  </Typography>
                </Box>
              </Box>
              <Box mt={2} px={2}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  type="file"
                  onChange={handleFileChange}
                  />
                <label htmlFor="raised-button-file">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<FaCamera />}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Change Photo'}
                  </Button>
                </label>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleUpload}
                  disabled={!isFileValid || uploading}
                  startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <FaCheckCircle />}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </Box>
          
            </ProfileContainer>
          </Grid>
          {/* Group Information Card */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                boxShadow: 4,
                border: 'none',
                background: 'linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)',
                borderRadius: 3,
                overflow: 'visible',
                position: 'relative',
                minHeight: 400,
              }}
              >
              <CardContent sx={{ p: 4 }}>
                 {!phoneNumberAdded && (
                  <PhoneNumberInput
                    onSuccess={() => setPhoneNumberAdded(true)}
                  />
                )}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                    padding: 1,
                    borderRadius: 3,
                    boxShadow: 3,
                    border: '1px solid lightblue',
                    backgroundColor: '#4a90e2',
                  }}
                  >
                  <ViewTimelineIcon size={20} style={{ marginRight: 16, color: 'white' }} />
                  <Typography variant="subtitle4" component="div" fontWeight="500" color="white">
                    Research Group Details
                  </Typography>
                </Box>
                {groupInfo ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FolderCopyIcon style={{ marginRight: 12, color: '#262650', flexShrink: 0 }} />
                        <div>
                          <Typography variant="subtitle2" color="textSecondary">
                            Research Name
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {groupInfo.researchName}
                          </Typography>
                        </div>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <GradingIcon style={{ marginRight: 12, color: '#262650', flexShrink: 0 }} />
                        <div>
                          <Typography variant="subtitle2" color="textSecondary">
                            Research Fields
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {Array.isArray(groupInfo.researchFields) && groupInfo.researchFields.length > 0
                              ? groupInfo.researchFields.join(', ')
                              : 'No research fields available'}
                          </Typography>
                        </div>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ChromeReaderModeIcon style={{ marginRight: 12, color: '#262650', flexShrink: 0 }} />
                        <div>
                          <Typography variant="subtitle2" color="textSecondary">
                            Main Theme
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {groupInfo.researchTheme}
                          </Typography>
                        </div>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <LibraryBooksIcon
                          style={{ marginRight: 12, color: '#262650', flexShrink: 0, marginTop: 4 }}
                        />
                        <div>
                          <Typography variant="subtitle2" color="textSecondary">
                            Introduction
                          </Typography>
                          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            {groupInfo.researchIntroduction}
                          </Typography>
                        </div>
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: 'error.light',
                      borderRadius: 2,
                      boxShadow: 1,
                    }}
                  >
                    <FaExclamationTriangle style={{ marginRight: 8, flexShrink: 0 }} />
                    <Typography variant="body2">No group information available</Typography>
                  </Paper>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                    padding: 1,
                    borderRadius: 3,
                    boxShadow: 3,
                    border: '1px solid lightblue',
                    backgroundColor: '#4a90e2',
                    marginTop: 3,
                  }}
                >
                  <ContactMailIcon size={20} style={{ marginRight: 16, color: 'white' }} />
                  <Typography variant="subtitle1" component="div" fontWeight="500" color="white">
                    Group Head Contacts
                  </Typography>
                </Box>

                {contactLoading ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Skeleton variant="text" width="60%" height={30} />
                      <Skeleton variant="text" width="80%" height={20} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Skeleton variant="text" width="60%" height={30} />
                      <Skeleton variant="text" width="80%" height={20} />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <MarkEmailReadIcon style={{ marginRight: 12, color: '#262650', flexShrink: 0 }} />
                        <div>
                          <Typography variant="subtitle2" color="textSecondary">
                            Email
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {groupHeadContact?.email || 'No email available'}
                          </Typography>
                        </div>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ContactPhoneIcon style={{ marginRight: 12, color: '#262650', flexShrink: 0 }} />
                        <div>
                          <Typography variant="subtitle2" color="textSecondary">
                            Phone
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {groupHeadContact?.phone || 'No phone available'}
                          </Typography>
                        </div>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar} // ✅  Wire up the onClose event
          message={snackbar.message}
          severity={snackbar.severity}
        />
    
      </Box>
    </>
  );
};

export default GroupMemberDashboardProfile;

