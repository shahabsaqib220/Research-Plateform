import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Avatar, IconButton, Skeleton, Typography, Grid, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axiosInstance from '../../services/axiosInstance';
import { AuthContext } from '../../services/AuthContext';

const ProfileCoverImage = () => {
  const router = useRouter();
  const { isLoggedIn, user } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadEnabledProfile, setUploadEnabledProfile] = useState(false);
  const [uploadEnabledCover, setUploadEnabledCover] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/user-login');
    }
  }, [isLoggedIn, router]);

  // Fetch cover image on component mount (only if logged in)
  useEffect(() => {
    if (!isLoggedIn || !user?.coverImageUrl) {
      setIsLoading(false);
      return;
    }

    const fetchCoverImage = async () => {
      try {
        const fileId = user.coverImageUrl.split('/').pop();
        const response = await axiosInstance.get(`/login/uploads/${fileId}`, {
          responseType: 'blob', // Fetch the image as a blob
        });

        if (response.status === 200) {
          const imageUrl = URL.createObjectURL(response.data); // Create a URL for the blob
          setCoverImage(imageUrl);
        } else {
          setCoverImage(null);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setCoverImage(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoverImage();
  }, [isLoggedIn, user]);

  // Fetch profile image on component mount (only if logged in)
  useEffect(() => {
    if (!isLoggedIn || !user?.profileImageUrl) {
      setIsLoading(false);
      return;
    }

    const fetchProfileImage = async () => {
      try {
        const fileId = user.profileImageUrl.split('/').pop();
        const response = await axiosInstance.get(`/login/profileImage/${fileId}`, {
          responseType: 'blob', // Fetch the image as a blob
        });

        if (response.status === 200) {
          const imageUrl = URL.createObjectURL(response.data); // Create a URL for the blob
          setProfileImage(imageUrl);
        } else {
          setProfileImage(null);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setProfileImage(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileImage();
  }, [isLoggedIn, user]);

  const handleCoverImageUpload = async () => {
    if (!coverImageFile) {
      setError('Please select a cover image to upload.');
      return;
    }

    setIsUploadingCover(true);
    setUploadEnabledCover(false);

    const formData = new FormData();
    formData.append('coverImage', coverImageFile);

    try {
      const response = await axiosInstance.put(
        `/login/users/${user._id}/cover-image`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.status === 200) {
        setCoverImage(URL.createObjectURL(coverImageFile)); // Update the cover image preview
        setSuccessMessage('Cover image uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.error || 'Failed to upload cover image');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Error uploading cover image');
      setTimeout(() => setError(''), 3000);
      console.error('Upload error:', error);
    } finally {
      setIsUploadingCover(false);
      setUploadEnabledCover(false);
    }
  };

  const handleProfileImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile?.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      setTimeout(() => setError(''), 3000);
      setUploadEnabledProfile(false);
      return;
    }

    if (selectedFile.size > 3 * 1024 * 1024) {
      // 3 MB limit
      setError('Image size must be less than 3 MB.');
      setTimeout(() => setError(''), 3000);
      setUploadEnabledProfile(false);
      return;
    }

    // Set the actual file for uploading
    setProfileImageFile(selectedFile);
    // Preview image
    setProfileImage(URL.createObjectURL(selectedFile));
    setUploadEnabledProfile(true); // Enable upload button
  };

  // Handle profile image upload
  const handleProfileImageUpload = async () => {
    if (!profileImageFile) {
      setError('Please select an image to upload.');
      return;
    }

    setIsUploadingProfile(true);
    setUploadEnabledProfile(false);

    const formData = new FormData();
    formData.append('profileImage', profileImageFile); // Use the actual file object

    try {
      const response = await axiosInstance.post('/login/uploadProfileImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Profile image uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.error || 'Failed to upload image');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Error uploading image');
      setTimeout(() => setError(''), 3000);
      console.error('Upload error:', error);
    } finally {
      setIsUploadingProfile(false);
      setUploadEnabledProfile(false); // Disable upload button after upload
    }
  };

  const handleCoverImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile?.type.startsWith('image/')) {
      setError('Please select a valid image file for the cover.');
      setTimeout(() => setError(''), 3000);
      setUploadEnabledCover(false);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Cover image size must be less than 5 MB.');
      setTimeout(() => setError(''), 3000);
      setUploadEnabledCover(false);
      return;
    }

    setCoverImageFile(selectedFile);
    setCoverImage(URL.createObjectURL(selectedFile));
    setUploadEnabledCover(true);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: '800px', margin: 'auto', textAlign: 'center', mb: 4 }}>
      {/* Cover Image Section */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '150px', sm: '200px' },
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt="Cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Typography variant="body1" color="textSecondary">
            Add your cover image
          </Typography>
        )}

        {/* Cover Image Buttons */}
        <Box sx={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: 1 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="cover-image-upload"
            type="file"
            onChange={handleCoverImageChange}
            disabled={isUploadingCover}
          />
          <label htmlFor="cover-image-upload">
            <IconButton color="primary" component="span" disabled={isUploadingCover}>
              <PhotoCamera />
            </IconButton>
          </label>
         

          <Button
            color="primary"
            disabled={!uploadEnabledCover || isUploadingCover}
            onClick={handleCoverImageUpload}
            sx={{ minWidth: 'auto', padding: 1 }}
          >
            {isUploadingCover ? (
              <CircularProgress size={20} color="primary" />
            ) : (
              <CloudUploadIcon fontSize="small" sx={{ color: 'blue' }} />
            )}
          </Button>
        </Box>
      </Box>

      {/* Profile Image Section */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '100px', sm: '150px' },
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '80px', sm: '100px' },
          height: { xs: '80px', sm: '100px' },
          borderRadius: '50%',
          border: '4px solid blue',
          overflow: 'hidden',
          backgroundColor: '#f0f0f0',
        }}
      >
        {isLoading ? (
          <Skeleton variant="circular" width="100%" height="100%" />
        ) : profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Avatar sx={{ width: '100%', height: '100%' }} />
        )}
      </Box>

      {/* Profile Image Buttons */}
      <Box sx={{ mt: { xs: 10, sm: 12 }, textAlign: 'center' }}>
  <Grid container spacing={2} justifyContent="center">
    <Grid item>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="profile-image-upload"
        type="file"
        onChange={handleProfileImageChange}
        disabled={isUploadingProfile}
      />
      <label htmlFor="profile-image-upload">
        <IconButton
          component="span"
          sx={{
            bgcolor: 'blue',
            color: 'white',
            '&:hover': { bgcolor: 'darkblue' },
            width: 40,
            height: 40,
          }}
          disabled={isUploadingProfile}
        >
          <PhotoCamera sx={{ fontSize: 24 }} />
        </IconButton>
      </label>
    </Grid>
    <Grid item>
      <IconButton
        disabled={!uploadEnabledProfile || isUploadingProfile}
        onClick={handleProfileImageUpload}
        sx={{
          bgcolor: 'blue',
          color: 'white',
          '&:hover': { bgcolor: 'darkblue' },
          width: 40,
          height: 40,
        }}
      >
        {isUploadingProfile ? (
          <CircularProgress size={24} sx={{ color: 'blue' }} />
        ) : (
          <CloudUploadIcon sx={{ fontSize: 24 }} />
        )}
      </IconButton>
    </Grid>
  </Grid>
  
  {/* User Name Typography */}
  <Typography 
    variant="h6" 
    sx={{ mt: 2, textAlign: 'center', fontWeight: 'semibold', color: 'black' }}
  >
    {user.firstName} {user.lastName}
  </Typography>
</Box>

              

      {/* Error and Success Messages */}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {successMessage && (
        <Typography color="success" sx={{ mt: 2 }}>
          {successMessage}
        </Typography>
      )}
    </Box>
  );
};

export default ProfileCoverImage;