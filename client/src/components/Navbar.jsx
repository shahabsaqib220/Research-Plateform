'use client'
import React, { useState, useEffect, useContext, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/services/AuthContext';
import { useGroupMemberAuth } from '@/services/GroupMemberAuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import axiosInstance from '@/services/axiosInstance';

const Navbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const {
    isAuthenticated: isGroupMemberAuthenticated,
    user: groupMemberUser,
    memberLogout: groupMemberLogout,
  } = useGroupMemberAuth();

  const activeUser = useMemo(() => {
    if (isLoggedIn) return { user: user, isHeadUser: true };
    if (isGroupMemberAuthenticated) return { user: groupMemberUser, isHeadUser: false };
    return null;
  }, [isLoggedIn, user, isGroupMemberAuthenticated, groupMemberUser]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!activeUser) {
        setImageUrl(null);
        return;
      }

      try {
        let response;
        if (activeUser.isHeadUser) {
          // Fetch profile image for head user
          if (!activeUser.user.profileImageUrl) {
            setImageUrl(null);
            return;
          }
          response = await axiosInstance.get(
            `/login/profileImage/${activeUser.user.profileImageUrl}`,
            { responseType: 'blob' }
          );
        } else {
          // Fetch profile image for group member
          if (!activeUser.user.profileImage) {
            setImageUrl(null);
            return;
          }
          response = await axiosInstance.get(
            `/member/profile-image/${activeUser.user.profileImage}`,
            { responseType: 'blob' }
          );
        }

        if (response.status === 200 && response.data) {
          setImageUrl(URL.createObjectURL(response.data));
        } else {
          setImageUrl(null);
        }
      } catch (error) {
        setImageUrl(null);
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, [activeUser]);

  const handleLogout = () => {
    isLoggedIn ? logout() : groupMemberLogout();
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderMenuItems = () => (
    <>
      {/* {['Home', 'About', 'Services', 'Contact'].map((item) => (
        <Button
          key={item}
          component={Link}
          href={`/${item.toLowerCase()}`}
          sx={{
            color: 'text.primary',
            textTransform: 'capitalize',
            fontWeight: 560,
            borderRadius: 2,
            mx: 2,
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2,
            },
          }}
        >
          {item}
        </Button>
      ))} */}
      {activeUser && (
        <>
      <Button
  component={Link}
  href={activeUser?.isHeadUser ? "/userDashboard" : "/group-member-dashboard"}
  sx={{
    color: 'primary.main',
    textTransform: 'capitalize',
    fontWeight: 600,
    mx: 1,
  }}
>
  Dashboard
</Button>

          <Button
            onClick={handleLogout}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              textTransform: 'capitalize',
              fontWeight: 600,
              borderRadius: 20,
              px: 3,
              mx: 1,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Logout
          </Button>
        </>
      )}
      {!activeUser && (
        <>
          <Button
            component={Link}
            href="/user-login"
            sx={{
              color: 'primary.main',
              textTransform: 'capitalize',
              fontWeight: 600,
              mx: 1,
            }}
          >
            Log In
          </Button>
          <Button
            component={Link}
            href="/user-sign-up-registeration"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              textTransform: 'capitalize',
              fontWeight: 600,
              borderRadius: 20,
              px: 3,
              mx: 1,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Sign Up
          </Button>
        </>
      )}
    </>
  );

  const renderMobileMenuItems = () => (
    <List>
      {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
        <ListItem key={item} disablePadding>
          <ListItemButton
            component={Link}
            href={`/${item.toLowerCase()}`}
            onClick={toggleMobileMenu}
          >
            <ListItemIcon>
              {index === 0 && <HomeIcon sx={{ color: 'primary.main' }} />}
              {index === 1 && <InfoIcon sx={{ color: 'primary.main' }} />}
              {index === 2 && <BuildIcon sx={{ color: 'primary.main' }} />}
              {index === 3 && <ContactMailIcon sx={{ color: 'primary.main' }} />}
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItemButton>
        </ListItem>
      ))}
      {activeUser && (
        <>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/dashboard" onClick={toggleMobileMenu}>
              <ListItemIcon>
                <DashboardIcon sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </>
      )}
      {!activeUser && (
        <>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/user-login" onClick={toggleMobileMenu}>
              <ListItemIcon>
                <LoginIcon sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText primary="Log In" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/signup" onClick={toggleMobileMenu}>
              <ListItemIcon>
                <HowToRegIcon sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItemButton>
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.default', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            flexGrow: 1,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          MyLogo
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
          {renderMenuItems()}
          {activeUser && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              {imageUrl ? (
                <Avatar src={imageUrl} alt="User Profile" />
              ) : (
                <Avatar>
                  <AccountCircleIcon />
                </Avatar>
              )}
              <Typography sx={{ ml: 1, fontWeight: 500, color: '#000' }}>
                {`${activeUser.user.firstName}`}
              </Typography>
            </Box>
          )}
        </Box>
        <IconButton
          sx={{ display: { sm: 'none' } }}
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <Drawer anchor="top" open={isMobileMenuOpen} onClose={toggleMobileMenu}>
        {renderMobileMenuItems()}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;