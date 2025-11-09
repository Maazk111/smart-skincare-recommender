import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  History as HistoryIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Spa as SpaIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from 'axios';

const UserHistory = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/recommendations');
      setRecommendations(response.data.recommendations || []);
      setError('');
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRecommendation(null);
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

  const getConcernColor = (concern) => {
    const colors = {
      'Rosacea': 'error',
      'Blemishes': 'warning',
      'Hyperpigmentation': 'info',
      'Aging': 'secondary',
      'Acne': 'error',
      'Scarring': 'warning',
      'Uneven Texture': 'info',
      'None': 'default',
    };
    return colors[concern] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HistoryIcon sx={{ fontSize: 30, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Your Skincare History
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your skincare journey and recommendations
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/recommendation')}
        >
          New Recommendation
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Refresh Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchRecommendations} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Recommendations List */}
      {recommendations.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <SpaIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No recommendations yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Get your first personalized skincare recommendation to start your journey
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate('/recommendation')}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {recommendations.map((recommendation, index) => (
            <Grid item xs={12} key={recommendation.id}>
              <Card>
                <CardContent>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              backgroundColor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <SpaIcon sx={{ fontSize: 25, color: 'white' }} />
                          </Box>
                        </Grid>
                        <Grid item xs>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {recommendation.skinType} Skin - {recommendation.skinConcern}
                            </Typography>
                            <Chip
                              label={recommendation.skinType}
                              size="small"
                              color={getSkinTypeColor(recommendation.skinType)}
                            />
                            <Chip
                              label={recommendation.skinConcern}
                              size="small"
                              color={getConcernColor(recommendation.skinConcern)}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PersonIcon fontSize="small" />
                              {recommendation.gender} • {recommendation.ageRange}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ScheduleIcon fontSize="small" />
                              {formatDate(recommendation.createdAt)}
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item>
                          <Tooltip title="View Details">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(recommendation);
                              }}
                              color="primary"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Skin Profile
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">Skin Type:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {recommendation.skinType}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">Sensitivity:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {recommendation.skinSensitivity}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">Allergy Issues:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {recommendation.allergyIssue || 'None'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            AI Recommendation
                          </Typography>
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            {recommendation.recommendedProduct || 'Recommendation will be generated...'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Recommendation Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpaIcon color="primary" />
            Recommendation Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedRecommendation && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Skin Profile
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Gender</Typography>
                    <Typography variant="body1">{selectedRecommendation.gender}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Age Range</Typography>
                    <Typography variant="body1">{selectedRecommendation.ageRange}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Skin Type</Typography>
                    <Chip
                      label={selectedRecommendation.skinType}
                      color={getSkinTypeColor(selectedRecommendation.skinType)}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Primary Concern</Typography>
                    <Chip
                      label={selectedRecommendation.skinConcern}
                      color={getConcernColor(selectedRecommendation.skinConcern)}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Sensitivity Level</Typography>
                    <Typography variant="body1">{selectedRecommendation.skinSensitivity}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Allergy Issues</Typography>
                    <Typography variant="body1">{selectedRecommendation.allergyIssue || 'None'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  AI Recommendation
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      {selectedRecommendation.recommendedProduct || 'Recommendation will be generated...'}
                    </Typography>
                  </CardContent>
                </Card>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">Generated on:</Typography>
                  <Typography variant="body2">
                    {formatDate(selectedRecommendation.createdAt)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserHistory;
