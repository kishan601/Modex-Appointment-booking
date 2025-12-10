// src/MyBookings/MyBookings.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  Paper,
  CircularProgress
} from '@mui/material';
import NavBar from '../components/NavBar/NavBar';
import PageHeader from '../components/PageHeader/PageHeader';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CancelIcon from '@mui/icons-material/Cancel';
import { bookingsApi } from '../services/api';
import { format } from 'date-fns';

import Doctor from '../assets/Doctor.png';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      fetchBookings(savedEmail);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchBookings = async (userEmail) => {
    try {
      setLoading(true);
      const response = await bookingsApi.getByEmail(userEmail);
      const formattedBookings = response.data.map(booking => ({
        ...booking,
        date: booking.date ? format(new Date(booking.date), 'EEEE, MMMM d, yyyy') : booking.date
      }));
      setBookings(formattedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (emailInput) {
      localStorage.setItem('userEmail', emailInput);
      setEmail(emailInput);
      fetchBookings(emailInput);
    }
  };
  
  // Filter bookings based on search term
  const filteredBookings = bookings.filter(booking => {
    const doctorName = booking.doctor?.name || '';
    const specialty = booking.doctor?.specialty || '';
    return doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           specialty.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsApi.cancel(bookingId);
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'CANCELLED' } 
          : booking
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };
  
  const handleRescheduleBooking = (bookingId) => {
    // This would typically open a reschedule dialog
    alert('Reschedule functionality would open here');
  };
  
  return (
    <Box>
      <NavBar />
      <PageHeader 
        title="My Bookings" 
        subtitle="Manage your appointments and bookings with healthcare providers."
        image={Doctor}
      />
      
      <Container maxWidth="xl" sx={{ mb: 8 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search by doctor name or specialty"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 500, mx: 'auto', display: 'block' }}
          />
        </Box>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!email && !loading && (
          <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', mb: 4 }}>
            <Typography variant="h6" gutterBottom>Enter your email to view bookings</Typography>
            <form onSubmit={handleEmailSubmit}>
              <TextField
                fullWidth
                type="email"
                label="Email Address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                sx={{ mb: 2 }}
                required
              />
              <Button type="submit" variant="contained" fullWidth>
                View My Bookings
              </Button>
            </form>
          </Paper>
        )}
        
        {/* Bookings List */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Your Appointments
        </Typography>
        
        {filteredBookings.length > 0 ? (
          <Grid container spacing={3}>
            {filteredBookings.map((booking) => (
              <Grid item xs={12} key={booking.id}>
                <Card 
                  elevation={0}
                  sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    opacity: booking.status === 'CANCELLED' ? 0.7 : 1,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {booking.status === 'CANCELLED' && (
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'error.main',
                        color: 'white',
                        py: 0.5,
                        px: 2,
                        borderBottomLeftRadius: 8
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {booking.status}
                      </Typography>
                    </Box>
                  )}
                  
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Avatar 
                            src={booking.doctor?.image} 
                            alt={booking.doctor?.name || 'Doctor'}
                            sx={{ 
                              width: 100, 
                              height: 100, 
                              mb: 2,
                              border: '4px solid white',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Typography variant="h6" sx={{ textAlign: 'center' }}>
                            {booking.doctor?.name || 'Doctor'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                            {booking.doctor?.specialty || 'Specialist'}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <EventNoteIcon sx={{ mr: 1, color: 'primary.main' }} />
                            Appointment Details
                          </Typography>
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CalendarMonthIcon sx={{ color: 'primary.main', mr: 1 }} />
                                <Typography>{booking.date}</Typography>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <AccessTimeIcon sx={{ color: 'primary.main', mr: 1 }} />
                                <Typography>{booking.time}</Typography>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Chip 
                                icon={booking.type === 'Video Consultation' ? <VideoCallIcon /> : <PersonIcon />} 
                                label={booking.type} 
                                color="primary" 
                                variant="outlined" 
                              />
                            </Grid>
                          </Grid>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Typography variant="body2" color="text.secondary">
                            Reason: {booking.patientInfo.reason || 'General Consultation'}
                          </Typography>
                          {booking.patientInfo.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Notes: {booking.patientInfo.notes}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          {booking.status !== 'CANCELLED' && (
                            <>
                              <Button 
                                variant="outlined" 
                                color="primary" 
                                fullWidth 
                                sx={{ mb: 2 }}
                                onClick={() => handleRescheduleBooking(booking.id)}
                              >
                                Reschedule
                              </Button>
                              
                              <Button 
                                variant="outlined" 
                                color="error" 
                                fullWidth
                                startIcon={<CancelIcon />}
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel Appointment
                              </Button>
                            </>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                maxWidth: 800, 
                mx: 'auto',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h5" gutterBottom>
                No Bookings Found!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                You don't have any appointments booked yet. Visit our Find Doctors section to schedule an appointment.
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Promotional section */}
              <Box sx={{ textAlign: 'left', p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  This World Oral Health Day,
                </Typography>
                <Typography variant="h5">
                  Get a <span style={{ color: '#2AA7FF', fontWeight: 'bold' }}>FREE</span> Appointment* with Top Dentists.
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 1, display: 'inline-block', bgcolor: 'primary.main', px: 1, borderRadius: 1 }}>
                  LIMITED PERIOD OFFER
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  #BeSensitiveToOralHealth
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  *T&C Apply - only consultation fee. Procedures / surgeries not covered
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MyBookings;