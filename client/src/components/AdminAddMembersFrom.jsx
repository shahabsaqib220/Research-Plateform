'use client';

import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { AuthContext } from "@/services/AuthContext";
import {
    Grid,
    Container,
    Typography,
    TextField,
    Button,
    InputAdornment,
    CircularProgress,
    Paper,
    Alert,
    Box,
    styled
} from '@mui/material';
import {
    Person,
    Email,
    Lock,
    LockReset,
    GroupAdd,
    CheckCircle,
    Cancel
} from '@mui/icons-material';
import axiosInstance from '@/services/axiosInstance';
import Footer from './Footer';

const GradientBox = styled(Box)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.common.white,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(6),
    borderRadius: '4px 0 0 4px'
}));

const AddGroupMember = () => {
    const router = useRouter();
    const { isLoggedIn, user } = useContext(AuthContext);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [validation, setValidation] = useState({
        emailValid: null,
        passwordValid: null,
        passwordsMatch: null,
        firstNameValid: null,
        lastNameValid: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [canAddMember, setCanAddMember] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    // Validation patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    useEffect(() => {
        if (!isLoggedIn || !user) {
            router.push("/user-login");
            return;
        }

        const checkUserPermission = async () => {
            try {
                const response = await axiosInstance.get(
                    `/check/research/research/check-permission/${user?._id}`
                );
                setCanAddMember(response.status === 200);
            } catch (error) {
                console.error('Permission check error:', error);
                setCanAddMember(false);
            }
        };

        checkUserPermission();
    }, [isLoggedIn, user?.id, router]);

    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                return emailRegex.test(value);
            case 'password':
                return passwordRegex.test(value);
            case 'confirmPassword':
                return value === form.password;
            case 'firstName':
            case 'lastName':
                return value.trim().length > 0;
            default:
                return true;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        const isValid = validateField(name, value);
        setValidation(prev => ({
            ...prev,
            [name + 'Valid']: isValid,
            ...(name === 'password' && { passwordsMatch: value === form.confirmPassword }),
            ...(name === 'confirmPassword' && { passwordsMatch: value === form.password })
        }));
    };

    useEffect(() => {
        setIsFormValid(
            validation.emailValid === true &&
            validation.passwordValid === true &&
            validation.passwordsMatch === true &&
            validation.firstNameValid === true &&
            validation.lastNameValid === true
        );
    }, [validation]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const formData = {
            ...form,
            addedBy: user._id
        };

        try {
            const response = await axiosInstance.post('/groupmember/group-member-add', formData);
            if (response.status === 201) {
                setSuccessMessage('Member added successfully!');
                setForm({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
                setValidation({
                    emailValid: null,
                    passwordValid: null,
                    passwordsMatch: null,
                    firstNameValid: null,
                    lastNameValid: null,
                });
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'Failed to add group member');
        } finally {
            setIsLoading(false);
        }
    };

    const ValidationIcon = ({ valid }) => (
        valid === true ? <CheckCircle color="success" /> :
            valid === false ? <Cancel color="error" /> : null
    );

    if (!isLoggedIn || !user) {
        return null;
    }

 

    return (
        <>
            <Container maxWidth="lg" sx={{ py: 4, ml: { lg: '288px' }, mt: 4 }}>
                <Typography variant="h5" gutterBottom sx={{
                    fontWeight: 100,
                    '& span': {
                        textDecoration: 'underline',
                        textDecorationColor: 'primary.main',
                        textUnderlineOffset: '0.3em'
                    }
                }}>
                    <GroupAdd sx={{ mr: 1, verticalAlign: 'bottom' }} />
                    Empower Your <span>Research Team</span>
                </Typography>

                <Paper elevation={3} sx={{ overflow: 'hidden' }}>
                    <Grid container>
                        <Grid item xs={12} md={5}>
                            <GradientBox>
                                <Typography variant="h5 " gutterBottom sx={{ fontWeight: 600 }}>
                                    Collaborative Excellence
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 3 }}>
                                    Build a world-class research team with secure, validated member onboarding.
                                    Ensure academic integrity while expanding your collaborative network.
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 500, mt: 4 }}>
                                    Requirements
                                </Typography>
                                <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                                    <li>Valid institutional email</li>
                                    <li>Strong password requirements</li>
                                    <li>Identity verification</li>
                                    <li>Secure credential storage</li>
                                </ul>
                            </GradientBox>
                        </Grid>

                        <Grid item xs={12} md={7} sx={{ p: 6 }}>
                            <form onSubmit={handleSubmit}>
                                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 4 }}>
                                    <ConnectWithoutContactIcon sx={{ fontSize: '2rem', color: 'primary.main' }} />
                                    <Typography variant="h6" fontWeight={600}>
                                        Add New Team Member
                                    </Typography>
                                </Box>

                                <Grid container spacing={3}>
                                    {/* First Name */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: <ValidationIcon valid={validation.firstNameValid} />
                                            }}
                                            error={validation.firstNameValid === false}
                                            helperText={validation.firstNameValid === false && 'Required field'}
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
                                    {/* Last Name */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: <ValidationIcon valid={validation.lastNameValid} />
                                            }}
                                            error={validation.lastNameValid === false}
                                            helperText={validation.lastNameValid === false && 'Required field'}
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

                                    {/* Email */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Institutional Email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: <ValidationIcon valid={validation.emailValid} />
                                            }}
                                            error={validation.emailValid === false}
                                            helperText={validation.emailValid === false && 'Invalid email format'}
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

                                    {/* Password */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            name="password"
                                            type="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: <ValidationIcon valid={validation.passwordValid} />
                                            }}
                                            error={validation.passwordValid === false}
                                            helperText="Minimum 8 characters with uppercase, lowercase, number, and special character"
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

                                    {/* Confirm Password */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            type="password"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockReset />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: <ValidationIcon valid={validation.passwordsMatch} />
                                            }}
                                            error={validation.passwordsMatch === false}
                                            helperText={validation.passwordsMatch === false && 'Passwords do not match'}
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

                                    {/* Messages */}
                                    <Grid item xs={12}>
                                        {errorMessage && (
                                            <Alert severity="error" sx={{ mb: 2 }}>
                                                {errorMessage}
                                            </Alert>
                                        )}
                                        {successMessage && (
                                            <Alert severity="success" sx={{ mb: 2 }}>
                                                {successMessage}
                                            </Alert>
                                        )}
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={!canAddMember || !isFormValid || isLoading}
                                            sx={{ mt: 3, borderRadius: '8px' }}
                                        >
                                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Add Member'}
                                        </Button>
                                       
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            <Footer />
        </>
    );
};

export default AddGroupMember;