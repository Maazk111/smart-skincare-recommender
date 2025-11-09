import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
} from '@mui/material';
import {
  Spa as SpaIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import axios from 'axios';

const steps = ['Skin Information', 'Concerns & Sensitivity', 'Review & Submit'];

const skinTypes = ['Dry', 'Oily', 'Combination', 'Simple'];
const ageRanges = ['Under 18', 'Above 18'];
const skinConcerns = [
  'Rosacea',
  'Blemishes',
  'Hyperpigmentation',
  'Acne Breakouts',
  'Pimples',
  'Blackheads',
  'Uneven Skin Tone',
  'Dullness',
  'Dryness',
  'Other',
];
const sensitivityLevels = [
  'Mild Sensitivity',
  'Severe Sensitivity',
  'Moderate Sensitivity',
];
const allergyIssues = [
  'Contact Dermatitis',
  'Eczema',
  'Rosacea',
  'Hives',
];

const RecommendationForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    gender: '',
    ageRange: '',
    skinType: '',
    skinConcern: '',
    skinSensitivity: '',
    allergyIssue: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.gender || !formData.ageRange || !formData.skinType) {
        setError('Please fill in all required fields');
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.skinConcern || !formData.skinSensitivity) {
        setError('Please fill in all required fields');
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/users/recommendations', formData);
      console.log('Recommendation response:', response.data);
      setSuccess('Recommendation generated successfully!');
      
      setTimeout(() => {
        navigate('/history');
      }, 2000);
    } catch (error) {
      console.error('Recommendation error:', error);
      setError(error.response?.data?.message || 'Failed to generate recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.gender && formData.ageRange && formData.skinType;
      case 1:
        return formData.skinConcern && formData.skinSensitivity;
      default:
        return true;
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Gender</Typography>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant={formData.gender === 'Male' ? 'contained' : 'outlined'}
                  onClick={() => handleChange('gender', 'Male')}
                  sx={{ mr: 2, mb: 1 }}
                >
                  Male
                </Button>
                <Button
                  variant={formData.gender === 'Female' ? 'contained' : 'outlined'}
                  onClick={() => handleChange('gender', 'Female')}
                  sx={{ mb: 1 }}
                >
                  Female
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Age Range</Typography>
              <Box sx={{ mb: 2 }}>
                {ageRanges.map((range) => (
                  <Button
                    key={range}
                    variant={formData.ageRange === range ? 'contained' : 'outlined'}
                    onClick={() => handleChange('ageRange', range)}
                    sx={{ mr: 2, mb: 1 }}
                  >
                    {range}
                  </Button>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Skin Type</Typography>
              <Box sx={{ mb: 2 }}>
                {skinTypes.map((type) => (
                  <Button
                    key={type}
                    variant={formData.skinType === type ? 'contained' : 'outlined'}
                    onClick={() => handleChange('skinType', type)}
                    sx={{ mr: 2, mb: 1 }}
                  >
                    {type}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Primary Skin Concern</Typography>
              <Box sx={{ mb: 2 }}>
                {skinConcerns.map((concern) => (
                  <Button
                    key={concern}
                    variant={formData.skinConcern === concern ? 'contained' : 'outlined'}
                    onClick={() => handleChange('skinConcern', concern)}
                    sx={{ mr: 2, mb: 1 }}
                  >
                    {concern}
                  </Button>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Skin Sensitivity</Typography>
              <Box sx={{ mb: 2 }}>
                {sensitivityLevels.map((level) => (
                  <Button
                    key={level}
                    variant={formData.skinSensitivity === level ? 'contained' : 'outlined'}
                    onClick={() => handleChange('skinSensitivity', level)}
                    sx={{ mr: 2, mb: 1 }}
                  >
                    {level}
                  </Button>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Allergy Issues (Optional)</Typography>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant={formData.allergyIssue === '' ? 'contained' : 'outlined'}
                  onClick={() => handleChange('allergyIssue', '')}
                  sx={{ mr: 2, mb: 1 }}
                >
                  None
                </Button>
                {allergyIssues.map((issue) => (
                  <Button
                    key={issue}
                    variant={formData.allergyIssue === issue ? 'contained' : 'outlined'}
                    onClick={() => handleChange('allergyIssue', issue)}
                    sx={{ mr: 2, mb: 1 }}
                  >
                    {issue}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Review Your Information
            </Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formData.gender}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Age Range
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formData.ageRange}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Skin Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formData.skinType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Primary Concern
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formData.skinConcern}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Sensitivity Level
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formData.skinSensitivity}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Allergy Issues
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formData.allergyIssue || 'None'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Alert severity="info" sx={{ mb: 2 }}>
              Our AI will analyze your skin profile and provide personalized recommendations.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={12} 
        sx={{ 
          p: 5,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <SpaIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Get Personalized Skincare Recommendations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Answer a few questions about your skin to receive AI-powered recommendations
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Step Content */}
        <Box sx={{ mb: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
              >
                {loading ? 'Generating...' : 'Generate Recommendation'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid(activeStep)}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RecommendationForm;
