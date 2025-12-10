// src/components/BookAppointment/BookAppointment.jsx
import React, { useState } from 'react';
import { bookingsApi } from '../../services/api';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Avatar,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format, addDays, isSameDay } from 'date-fns';

// Sample time slots data
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 17; hour++) {
    if (hour === 12) continue; // Lunch break
    slots.push(`${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`);
    if (hour !== 17) slots.push(`${hour}:30 ${hour < 12 ? 'AM' : 'PM'}`);
  }
  return slots;
};

const steps = ['Select Date & Time', 'Your Information', 'Confirm Details'];

const BookAppointment = ({ open, onClose, doctor }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('video');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    notes: ''
  });
  
  const timeSlots = generateTimeSlots();
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      const bookingData = {
        doctor_id: doctor?.id,
        patient_first_name: formData.firstName,
        patient_last_name: formData.lastName,
        patient_email: formData.email,
        patient_phone: formData.phone,
        appointment_type: appointmentType,
        reason: formData.reason,
        notes: formData.notes,
        booking_date: format(appointmentDate, 'yyyy-MM-dd'),
        booking_time: appointmentTime
      };

      const response = await bookingsApi.create(bookingData);
      
      if (response.data.status === 'CONFIRMED') {
        localStorage.setItem('userEmail', formData.email);
        handleNext();
      } else {
        alert('Booking failed: ' + (response.data.error || 'Please try again'));
      }
    } catch (error) {
      console.error('Booking error:', error);
      if (error.response?.status === 409) {
        alert('This slot is no longer available. Please select another time.');
      } else {
        alert('Failed to book appointment. Please try again.');
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setActiveStep(0);
    setAppointmentDate(new Date());
    setAppointmentTime('');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      reason: '',
      notes: ''
    });
    onClose();
  };

  const renderDateSelection = () => {
    const nextDays = [];
    for (let i = 0; i < 5; i++) {
      const date = addDays(new Date(), i);
      const day = date.getDay();
      if (day !== 0 && day !== 6) { // Skip weekends
        nextDays.push(date);
      }
    }

    return (
      <>
        <Typography variant="h6" gutterBottom>
          Select Appointment Date
        </Typography>
        
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {nextDays.map((date, index) => (
            <Paper
              key={index}
              elevation={0}
              onClick={() => setAppointmentDate(date)}
              sx={{
                p: 2,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: isSameDay(date, appointmentDate) ? 'primary.main' : 'divider',
                bgcolor: isSameDay(date, appointmentDate) ? 'rgba(42, 167, 255, 0.08)' : 'background.paper',
                borderRadius: 2,
                minWidth: 100,
                textAlign: 'center',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(42, 167, 255, 0.04)',
                }
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {format(date, 'EEE')}
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                {format(date, 'd')}
              </Typography>
              <Typography variant="body2">
                {format(date, 'MMM')}
              </Typography>
            </Paper>
          ))}
        </Box>
                
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Select Appointment Time
        </Typography>
        
        <Grid container spacing={1} sx={{ mb: 3 }}>
          {timeSlots.map((time, index) => (
            <Grid item key={index}>
              <Button
                variant={appointmentTime === time ? "contained" : "outlined"}
                onClick={() => setAppointmentTime(time)}
                startIcon={<AccessTimeIcon />}
                sx={{ m: 0.5 }}
              >
                {time}
              </Button>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Appointment Type
        </Typography>
        
        <RadioGroup
          row
          name="appointmentType"
          value={appointmentType}
          onChange={(e) => setAppointmentType(e.target.value)}
        >
          <FormControlLabel
            value="video"
            control={<Radio color="primary" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VideoCallIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography>Video Consultation</Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="inPerson"
            control={<Radio color="primary" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography>In-Person Visit</Typography>
              </Box>
            }
          />
        </RadioGroup>
      </>
    );
  };

  const renderPatientForm = () => {
    return (
      <>
        <Typography variant="h6" gutterBottom>
          Your Information
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleFormChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleFormChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Reason for Visit</InputLabel>
              <Select
                name="reason"
                value={formData.reason}
                label="Reason for Visit"
                onChange={handleFormChange}
              >
                <MenuItem value="Consultation">General Consultation</MenuItem>
                <MenuItem value="Followup">Follow-up Appointment</MenuItem>
                <MenuItem value="NewSymptoms">New Symptoms</MenuItem>
                <MenuItem value="AnnualCheckup">Annual Checkup</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes"
              name="notes"
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleFormChange}
              margin="normal"
            />
          </Grid>
        </Grid>
      </>
    );
  };

  const renderConfirmation = () => {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        
        <Typography variant="h5" gutterBottom>
          Appointment Confirmed!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Your appointment has been successfully scheduled. We've sent a confirmation email with all the details.
        </Typography>
        
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src={doctor?.image} 
                sx={{ width: 60, height: 60, mr: 2 }} 
              />
              <Box>
                <Typography variant="h6">{doctor?.name}</Typography>
                <Typography variant="body2" color="text.secondary">{doctor?.specialty}</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarMonthIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography>
                  {appointmentDate ? format(appointmentDate, 'EEEE, MMMM d, yyyy') : ''}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography>{appointmentTime}</Typography>
              </Box>
              
              <Chip 
                icon={appointmentType === 'video' ? <VideoCallIcon /> : <PersonIcon />} 
                label={appointmentType === 'video' ? 'Video Consultation' : 'In-Person Visit'} 
                color="primary" 
                variant="outlined" 
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Typography variant="body2" paragraph>
          You can view and manage all your appointments in the "My Bookings" section.
        </Typography>
        
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{ mt: 2 }}
        >
          Done
        </Button>
      </Box>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={activeStep === 2 ? handleClose : null} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        <Typography variant="h5">
          {activeStep === 2 ? 'Appointment Confirmed' : 'Book Appointment'}
        </Typography>
        {activeStep !== 2 && doctor && (
          <Typography variant="subtitle1">
            with {doctor.name} • {doctor.specialty}
          </Typography>
        )}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, mt: 2 }}>
        {activeStep < 2 && (
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
        
        {activeStep === 0 && renderDateSelection()}
        {activeStep === 1 && renderPatientForm()}
        {activeStep === 2 && renderConfirmation()}
      </DialogContent>
      
      {activeStep < 2 && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={activeStep === 0 ? handleNext : handleSubmit}
            variant="contained"
            disabled={activeStep === 0 && (!appointmentDate || !appointmentTime)}
          >
            {activeStep === 0 ? 'Next' : 'Confirm Appointment'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default BookAppointment;