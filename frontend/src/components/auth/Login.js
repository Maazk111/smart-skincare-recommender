import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  AdminPanelSettings,
  Person,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'USER', // Default to USER
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setFormData({
        ...formData,
        role: newRole,
      });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Get the user data from the login response
      const userData = result.user;
      
      // Navigate based on actual user role from the server
      if (userData && userData.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setResetLoading(true);
    setError('');
    
    // Simulate password reset (in real app, this would call your backend)
    setTimeout(() => {
      setResetSuccess('Password reset link sent to your email! Check your inbox.');
      setResetLoading(false);
      setTimeout(() => {
        setForgotPasswordMode(false);
        setResetEmail('');
        setResetSuccess('');
      }, 3000);
    }, 2000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* Left Side - Welcome */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={12}
            sx={{
              p: 5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 4,
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                zIndex: 1,
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <LoginIcon sx={{ fontSize: 50, color: 'white' }} />
              </Box>
              
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Welcome Back
              </Typography>
              
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                Sign in to your SkincareAI account
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: 'rgba(255,255,255,0.8)' }} />
                  <Typography variant="body1">Access Your Dashboard</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: 'rgba(255,255,255,0.8)' }} />
                  <Typography variant="body1">Get New Recommendations</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: 'rgba(255,255,255,0.8)' }} />
                  <Typography variant="body1">Track Your Progress</Typography>
                </Box>
                {formData.role === 'ADMIN' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: 'rgba(255,255,255,0.8)' }} />
                    <Typography variant="body1">Manage Users & System</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right Side - Login Form */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={8}
            sx={{
              p: 5,
              borderRadius: 4,
              boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
              background: 'white',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Sign In
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Choose your account type and enter your credentials
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                {error}
              </Alert>
            )}

            {resetSuccess && (
              <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
                {resetSuccess}
              </Alert>
            )}

            {/* Role Selection */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
                Select Account Type
              </Typography>
              <ToggleButtonGroup
                value={formData.role}
                exclusive
                onChange={handleRoleChange}
                aria-label="account type"
                sx={{
                  '& .MuiToggleButton-root': {
                    border: '2px solid #e0e0e0',
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      borderColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                    },
                  },
                }}
              >
                <ToggleButton value="USER" aria-label="user">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      User
                    </Typography>
                  </Box>
                </ToggleButton>
                <ToggleButton value="ADMIN" aria-label="admin">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminPanelSettings />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Admin
                    </Typography>
                  </Box>
                </ToggleButton>
              </ToggleButtonGroup>
              
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={formData.role === 'ADMIN' ? 'Admin Access' : 'User Access'}
                  color={formData.role === 'ADMIN' ? 'error' : 'primary'}
                  variant="outlined"
                  icon={formData.role === 'ADMIN' ? <AdminPanelSettings /> : <Person />}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Forgot Password Form */}
            {forgotPasswordMode ? (
              <Box component="form" onSubmit={handleForgotPassword} sx={{ width: '100%' }}>
                <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: '#333' }}>
                  Reset Your Password
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
                  Enter your email address and we'll send you a link to reset your password.
                </Typography>
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="reset-email"
                  label="Email Address"
                  name="resetEmail"
                  autoComplete="email"
                  autoFocus
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={resetLoading}
                  size="large"
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {resetLoading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => setForgotPasswordMode(false)}
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Back to Sign In
                  </Link>
                </Box>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  size="large"
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    background: formData.role === 'ADMIN' 
                      ? 'linear-gradient(135deg, #d63031 0%, #e17055 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: formData.role === 'ADMIN'
                        ? 'linear-gradient(135deg, #c23616 0%, #d63031 100%)'
                        : 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: formData.role === 'ADMIN'
                        ? '0 8px 25px rgba(214, 48, 49, 0.4)'
                        : '0 8px 25px rgba(102, 126, 234, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {formData.role === 'ADMIN' ? <AdminPanelSettings /> : <Person />}
                      Sign In as {formData.role}
                    </Box>
                  )}
                </Button>

                {/* Forgot Password Link */}
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => setForgotPasswordMode(true)}
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot your password?
                  </Link>
                </Box>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                      component={RouterLink}
                      to="/register"
                      variant="body2"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Sign up here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
