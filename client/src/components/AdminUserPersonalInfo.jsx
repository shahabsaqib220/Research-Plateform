'use client';

import React, { useState, useEffect, useContext } from 'react';
import { 
  Grid,
  Paper,
  Typography,
  Skeleton,
  Alert,
  Box,
  Avatar,
  useTheme,
  Stack,
  Divider
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  BadgeOutlined,
  AccountCircle
} from '@mui/icons-material';
import { AuthContext } from '@/services/AuthContext';
import Footer from './Footer';
import axiosInstance from '@/services/axiosInstance';

const InfoCard = () => {
  const theme = useTheme();
  const { isLoggedIn, user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/login/userinfo');
        setUserInfo(response.data.user);
      } catch (err) {
        setError('Failed to fetch user information');
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && user) {
      fetchUserInfo();
    }
  }, [isLoggedIn, user]);

  const InfoTile = ({ icon, label, value }) => (
    <Paper elevation={0} sx={{
      p: 3,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 2,
      height: '100%',
      transition: '0.3s',
      '&:hover': {
        boxShadow: theme.shadows[2],
        borderColor: theme.palette.primary.main
      }
    }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ 
          bgcolor: 'primary.main', 
          width: 40, 
          height: 40,
          borderRadius: 1.5
        }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {value || '—'}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <>
      <Box sx={{ 
        p: 3, 
        ml: { lg: '288px' }, 
        mt: 4,
        maxWidth: 1200
      }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <AccountCircle sx={{ 
            fontSize: 32,
            color: 'primary.main'
          }} />
          <Typography variant="h5" fontWeight={700}>
            Personal Profile
          </Typography>
        </Stack>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} md={6} key={item}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Skeleton variant="rectangular" width={40} height={40} />
                    <Box sx={{ width: '100%' }}>
                      <Skeleton variant="text" width="30%" height={24} />
                      <Skeleton variant="text" width="60%" height={32} />
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InfoTile
                icon={<Person fontSize="small" />}
                label="First Name"
                value={userInfo?.firstName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoTile
                icon={<Person fontSize="small" />}
                label="Last Name"
                value={userInfo?.lastName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoTile
                icon={<Email fontSize="small" />}
                label="Email Address"
                value={userInfo?.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoTile
                icon={<Phone fontSize="small" />}
                label="Phone Number"
                value={userInfo?.phone}
              />
            </Grid>
          </Grid>
        )}

       
      </Box>
      <Footer />
    </>
  );
};

export default InfoCard;