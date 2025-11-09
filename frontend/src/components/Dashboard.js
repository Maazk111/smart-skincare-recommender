import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Spa as SpaIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRecommendations: 0,
    recentRecommendations: [],
    loading: true,
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const [recommendationsResponse] = await Promise.all([
        axios.get('/users/recommendations'),
      ]);

      const recommendations = recommendationsResponse.data.recommendations || [];
      setStats({
        totalRecommendations: recommendations.length,
        recentRecommendations: recommendations.slice(0, 3),
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const getGreeting = () => {
    return 'Greetings';
  };

  const getSkinTypeColor = (skinType) => {
    const colors = {
      'Dry': 'error',
      'Oily': 'warning',
      'Combination': 'info',
      'Simple': 'success',
    };
    return colors[skinType] || 'default';
  };

  if (stats.loading || !user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Paper
        elevation={8}
        sx={{
          p: 5,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
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
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container alignItems="center" spacing={3}>
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                {getGreeting()}, {user.name || 'User'}! 👋
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, mb: 2, fontWeight: 'medium' }}>
                Welcome back to your personalized skincare journey
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8 }}>
                Discover the perfect skincare routine tailored just for you
              </Typography>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Chip
                  label={user.role}
                  color={user.role === 'ADMIN' ? 'secondary' : 'default'}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 'medium',
                  }}
                />
                {user.role === 'ADMIN' && (
                  <Button
                    variant="outlined"
                    startIcon={<AdminIcon />}
                    onClick={() => navigate('/admin')}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Admin Panel
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Get New Recommendation - Full Width */}
      <Paper
        elevation={8}
        sx={{
          p: 5,
          mb: 4,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            zIndex: 1,
          },
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
          },
        }}
        onClick={() => navigate('/recommendation')}
      >
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <AddIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Get New Recommendation
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 2, fontWeight: 'medium' }}>
            Answer a few questions and get personalized skincare recommendations
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Discover products tailored to your unique skin needs
          </Typography>
        </Box>
      </Paper>

      {/* View History - Full Width */}
      <Paper
        elevation={8}
        sx={{
          p: 5,
          mb: 4,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            zIndex: 1,
          },
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
          },
        }}
        onClick={() => navigate('/history')}
      >
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <HistoryIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            View History
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 2, fontWeight: 'medium' }}>
            Check your previous recommendations and track your skincare journey
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Review past recommendations and see your progress
          </Typography>
        </Box>
      </Paper>

      {/* Statistics and Recent Activity */}
      <Grid container spacing={3}>
        {/* Statistics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Your Statistics
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, backgroundColor: 'primary.light', borderRadius: 2 }}>
                <TrendingUpIcon sx={{ color: 'primary.main', mr: 2, fontSize: 30 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {stats.totalRecommendations}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Recommendations
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScheduleIcon color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Member since
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Account Type
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.role}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Recommendations */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Recent Recommendations
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {stats.recentRecommendations.length > 0 ? (
                <List>
                  {stats.recentRecommendations.map((rec, index) => (
                    <React.Fragment key={rec.id}>
                      <ListItem
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          backgroundColor: index % 2 === 0 ? 'grey.50' : 'transparent',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            cursor: 'pointer',
                          },
                        }}
                        onClick={() => navigate(`/recommendation/${rec.id}`)}
                      >
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              backgroundColor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <SpaIcon sx={{ color: 'white', fontSize: 20 }} />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {rec.skinType} Skin - {rec.skinConcern}
                              </Typography>
                              <Chip
                                label={rec.skinType}
                                size="small"
                                color={getSkinTypeColor(rec.skinType)}
                                sx={{ fontSize: '0.75rem' }}
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {new Date(rec.createdAt).toLocaleDateString()} • {rec.gender} • {rec.ageRange}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < stats.recentRecommendations.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <SpaIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                  </Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No recommendations yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Get your first personalized skincare recommendation
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/recommendation')}
                    sx={{ borderRadius: 3, px: 4 }}
                  >
                    Get Started
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
