// src/pages/FindDoctors/FindDoctors.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  MenuItem, 
  Button,
  Avatar,
  Chip,
  Rating, 
  Stack,
  Divider
} from '@mui/material';
import NavBar from '../../components/NavBar/NavBar';
import PageHeader from '../../components/PageHeader/PageHeader';
import BookAppointment from '../../components/BookAppointment/BookAppointment';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';

// Use existing images from the project
import Doctor from '../../assets/Doctor.png';
import lesley from '../../assets/lesley.png';
import ahmad from '../../assets/ahmad.png';
import heena from '../../assets/heena.png';
import ankur from '../../assets/ankur.png';

const specialties = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Oncology',
  'Radiology',
  'Urology',
  'General Medicine'
];

const locations = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'San Francisco',
  'Seattle',
  'Boston',
  'Miami',
  'Denver',
  'Austin'
];

// Sample doctor data
const doctors = [
  {
    id: 1,
    name: 'Dr. Lesley Hull',
    specialty: 'Cardiology',
    location: 'New York',
    rating: 4.8,
    reviews: 124,
    experience: '15 years',
    image: lesley,
    availability: 'Available Today',
    consultation: 'Online & In-person'
  },
  {
    id: 2,
    name: 'Dr. Ahmad Khan',
    specialty: 'Neurology',
    location: 'Boston',
    rating: 4.9,
    reviews: 98,
    experience: '12 years',
    image: ahmad,
    availability: 'Available Tomorrow',
    consultation: 'Online Only'
  },
  {
    id: 3,
    name: 'Dr. Heena Sachdeva',
    specialty: 'Orthopedics',
    location: 'Chicago',
    rating: 4.7,
    reviews: 156,
    experience: '10 years',
    image: heena,
    availability: 'Available Today',
    consultation: 'In-person Only'
  },
  {
    id: 4,
    name: 'Dr. Ankur Sharma',
    specialty: 'Pediatrics',
    location: 'Los Angeles',
    rating: 4.6,
    reviews: 89,
    experience: '8 years',
    image: ankur,
    availability: 'Available Next Week',
    consultation: 'Online & In-person'
  },
];

const FindDoctors = () => {
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Filter doctors based on search term, specialty, and location
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchTerm === '' || 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialty === '' || 
      doctor.specialty === specialty;
    
    const matchesLocation = location === '' || 
      doctor.location === location;
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });
  
  const handleBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingOpen(true);
  };
  
  const handleCloseBooking = () => {
    setBookingOpen(false);
  };
  
  const handleSearch = () => {
    // This function would typically call an API with search parameters
    console.log('Searching for doctors with:', { searchTerm, specialty, location });
  };
  
  return (
    <Box>
      <NavBar />
      <PageHeader 
        title="Find Top Doctors" 
        subtitle="Connect with board-certified doctors ready to help you with all your healthcare needs, online or in person."
        image={Doctor}
      />
      
      <Container maxWidth="xl" sx={{ mb: 8 }}>
        {/* Search and Filter */}
        <Card 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 6, 
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search by doctor name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                placeholder="Select specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <LocalHospitalIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              >
                <MenuItem value="">All Specialties</MenuItem>
                {specialties.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                placeholder="Select location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <PlaceIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              >
                <MenuItem value="">All Locations</MenuItem>
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button 
                variant="contained" 
                fullWidth
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{ 
                  py: 1, 
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                Search Doctors
              </Button>
            </Grid>
          </Grid>
        </Card>
        
        {/* Doctors List */}
        <Typography 
          variant="h5" 
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Find Doctors (Showing {filteredDoctors.length} results)
        </Typography>
        
        <Grid container spacing={3}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Grid item xs={12} key={doctor.id}>
                <Card 
                  elevation={0}
                  sx={{ 
                    p: 0, 
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Grid container>
                      <Grid 
                        item 
                        xs={12} 
                        md={3}
                        sx={{ 
                          bgcolor: 'rgba(42, 167, 255, 0.05)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          py: 4,
                          px: 2,
                        }}
                      >
                        <Avatar 
                          src={doctor.image} 
                          alt={doctor.name}
                          sx={{ 
                            width: 120, 
                            height: 120, 
                            mb: 2,
                            border: '4px solid white',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            textAlign: 'center',
                            color: 'primary.secondary',
                            mb: 0.5
                          }}
                        >
                          {doctor.name}
                        </Typography>
                        <Typography 
                          variant="body2"
                          sx={{ 
                            color: 'text.secondary',
                            textAlign: 'center',
                            mb: 2
                          }}
                        >
                          {doctor.specialty}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center" mb={1}>
                          <Rating 
                            value={doctor.rating} 
                            precision={0.1} 
                            readOnly 
                            size="small"
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                          />
                          <Typography variant="body2" color="text.secondary">
                            ({doctor.reviews})
                          </Typography>
                        </Stack>
                      </Grid>
                      
                      <Grid item xs={12} md={9}>
                        <Box sx={{ p: 3 }}>
                          <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            spacing={2}
                            mb={3}
                            flexWrap="wrap"
                          >
                            <Chip 
                              icon={<VerifiedIcon />} 
                              label="Verified" 
                              color="primary" 
                              variant="outlined"
                              size="small"
                            />
                            <Chip 
                              icon={<CalendarMonthIcon />} 
                              label={doctor.availability} 
                              color="primary" 
                              variant="outlined"
                              size="small"
                            />
                            <Chip 
                              icon={<LocalHospitalIcon />} 
                              label={doctor.consultation} 
                              color="primary" 
                              variant="outlined"
                              size="small"
                            />
                          </Stack>
                          
                          <Typography variant="body1" paragraph>
                            <strong>Experience:</strong> {doctor.experience}
                          </Typography>
                          <Typography variant="body1" paragraph>
                            <strong>Location:</strong> {doctor.location}
                          </Typography>
                          <Typography variant="body1" paragraph>
                            Dr. {doctor.name.split(' ')[1]} is a specialist in {doctor.specialty} with over {doctor.experience} of experience. They provide comprehensive care and are highly rated by patients.
                          </Typography>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            spacing={2}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                          >
                            <Box>
                              <Typography variant="h6" color="primary.main" fontWeight={600}>
                                Next Available
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Today, 2:00 PM
                              </Typography>
                            </Box>
                            <Button 
                              variant="contained" 
                              onClick={() => handleBooking(doctor)}
                              sx={{ 
                                minWidth: 200,
                                borderRadius: 2,
                              }}
                            >
                              Book Appointment
                            </Button>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No doctors match your search criteria.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your filters or search terms.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
      
      {/* Booking Dialog */}
      <BookAppointment 
        open={bookingOpen}
        onClose={handleCloseBooking}
        doctor={selectedDoctor}
      />
    </Box>
  );
};

export default FindDoctors;