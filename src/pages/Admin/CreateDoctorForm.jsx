import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { useDoctors } from '../../context/DoctorsContext';

const specialties = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Orthopedic',
  'Neurologist',
  'Gynecologist',
  'Psychiatrist',
  'ENT Specialist',
  'Ophthalmologist',
];

const CreateDoctorForm = () => {
  const { createDoctor } = useDoctors();
  
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    hospital: '',
    experience: '',
    rating: '',
    consultation_fee: '',
    image: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Doctor name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.specialty) {
      newErrors.specialty = 'Specialty is required';
    }
    
    if (!formData.hospital.trim()) {
      newErrors.hospital = 'Hospital name is required';
    }
    
    if (formData.experience && (isNaN(formData.experience) || Number(formData.experience) < 0)) {
      newErrors.experience = 'Experience must be a positive number';
    }
    
    if (formData.rating && (isNaN(formData.rating) || Number(formData.rating) < 0 || Number(formData.rating) > 5)) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }
    
    if (formData.consultation_fee && (isNaN(formData.consultation_fee) || Number(formData.consultation_fee) < 0)) {
      newErrors.consultation_fee = 'Fee must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setApiError('');
    setSuccess('');
    
    try {
      const doctorData = {
        name: formData.name.trim(),
        specialty: formData.specialty,
        hospital: formData.hospital.trim(),
        experience: formData.experience ? Number(formData.experience) : 0,
        rating: formData.rating ? Number(formData.rating) : 4.5,
        consultation_fee: formData.consultation_fee ? Number(formData.consultation_fee) : 500,
        image: formData.image.trim() || null,
      };
      
      await createDoctor(doctorData);
      setSuccess(`Dr. ${formData.name} has been added successfully!`);
      
      setFormData({
        name: '',
        specialty: '',
        hospital: '',
        experience: '',
        rating: '',
        consultation_fee: '',
        image: '',
      });
    } catch (err) {
      setApiError(err.message || 'Failed to create doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      specialty: '',
      hospital: '',
      experience: '',
      rating: '',
      consultation_fee: '',
      image: '',
    });
    setErrors({});
    setApiError('');
    setSuccess('');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#1B3C74', fontWeight: 600 }}>
        Add New Doctor
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Fill in the details to add a new doctor to the system
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError('')}>
          {apiError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Doctor Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
              placeholder="Dr. John Smith"
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              error={!!errors.specialty}
              helperText={errors.specialty}
              disabled={loading}
              required
            >
              {specialties.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Hospital"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              error={!!errors.hospital}
              helperText={errors.hospital}
              disabled={loading}
              placeholder="Apollo Hospital"
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Experience (Years)"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleChange}
              error={!!errors.experience}
              helperText={errors.experience}
              disabled={loading}
              InputProps={{
                inputProps: { min: 0, max: 50 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Rating"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              error={!!errors.rating}
              helperText={errors.rating || 'Rating out of 5'}
              disabled={loading}
              InputProps={{
                inputProps: { min: 0, max: 5, step: 0.1 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Consultation Fee"
              name="consultation_fee"
              type="number"
              value={formData.consultation_fee}
              onChange={handleChange}
              error={!!errors.consultation_fee}
              helperText={errors.consultation_fee}
              disabled={loading}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                inputProps: { min: 0 },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Profile Image URL (Optional)"
              name="image"
              value={formData.image}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://example.com/doctor-image.jpg"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  minWidth: 150,
                  backgroundColor: '#2AA7FF',
                  '&:hover': { backgroundColor: '#1a97ef' },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Add Doctor'
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateDoctorForm;
