// src/pages/Surgeries/Surgeries.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import NavBar from '../../components/NavBar/NavBar';
import PageHeader from '../../components/PageHeader/PageHeader';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideocamIcon from '@mui/icons-material/Videocam';
import { format } from 'date-fns';

import { surgeries, surgeryCategories } from '../../data/surgeryData';

// Replace with a real surgery header image
const surgeryHeaderImage = "https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg";

const SurgeryCard = ({ surgery, onConsultClick }) => {
  return (
    <Card 
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={surgery.image}
        alt={surgery.name}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {surgery.category}
        </Typography>
        
        <Typography variant="h6" component="h2" gutterBottom>
          {surgery.name}
        </Typography>
        
        <Box sx={{ my: 1 }}>
          <Chip 
            icon={<CheckCircleOutlineIcon />} 
            label={`${surgery.successRate}% Success Rate`} 
            color="primary" 
            variant="outlined"
            size="small"
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip 
            icon={<ScheduleIcon />} 
            label={`Recovery: ${surgery.recoveryTime}`} 
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {surgery.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" color="primary">
            ₹{surgery.estimatedCost.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="outlined" 
          fullWidth
          onClick={() => onConsultClick(surgery)}
          startIcon={<MedicalServicesIcon />}
        >
          Request Consultation
        </Button>
      </CardActions>
    </Card>
  );
};

const SurgeryDetails = ({ open, surgery, onClose, onRequestConsultation }) => {
  if (!surgery) return null;
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h5">
          {surgery.name}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box 
              component="img"
              src={surgery.image}
              alt={surgery.name}
              sx={{
                width: '100%',
                borderRadius: 2,
                mb: 2
              }}
            />
            
            <Typography variant="h6" gutterBottom>
              Estimated Cost
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              ₹{surgery.estimatedCost.toLocaleString()}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip 
                icon={<CheckCircleOutlineIcon />} 
                label={`${surgery.successRate}% Success Rate`} 
                color="primary" 
                variant="outlined"
              />
              <Chip 
                icon={<ScheduleIcon />} 
                label={`Recovery: ${surgery.recoveryTime}`} 
                variant="outlined"
              />
              <Chip 
                icon={<LocalHospitalIcon />} 
                label={`Stay: ${surgery.hospitalStay}`} 
                variant="outlined"
              />
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              startIcon={<MedicalServicesIcon />}
              onClick={() => {
                onClose();
                onRequestConsultation(surgery);
              }}
              sx={{ mt: 2 }}
            >
              Request Consultation
            </Button>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              About {surgery.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {surgery.description}
            </Typography>
            
            <Accordion defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">Pre-Requisites</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense disablePadding>
                  {surgery.preRequisites.map((req, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckBoxIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={req} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">Potential Risks</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense disablePadding>
                  {surgery.risks.map((risk, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ErrorOutlineIcon color="error" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={risk} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">Popular Hospitals</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense disablePadding>
                  {surgery.popularHospitals.map((hospital, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LocalHospitalIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={hospital} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const ConsultationRequestForm = ({ open, surgery, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: null,
    time: null,
    mode: 'video',
    additionalInfo: '',
    documents: []
  });
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };
  
  const handleTimeChange = (time) => {
    setFormData(prev => ({ ...prev, time }));
  };
  
  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  const handleSubmit = () => {
    setSubmitted(true);
    
    // In a real app, you would save this data to the backend
    console.log('Consultation request:', {
      surgery,
      ...formData
    });
    
    // Move to final step
    handleNext();
  };
  
  const handleClose = () => {
    // Reset the form when closing
    setActiveStep(0);
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: null,
      time: null,
      mode: 'video',
      additionalInfo: '',
      documents: []
    });
    setSubmitted(false);
    onClose();
  };
  
  const steps = ['Personal Information', 'Schedule Consultation', 'Additional Information', 'Confirmation'];
  
  return (
    <Dialog 
      open={open} 
      onClose={submitted ? handleClose : null}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h5">
          {activeStep === steps.length - 1 ? 'Consultation Requested' : 'Request Consultation'}
        </Typography>
        {activeStep !== steps.length - 1 && (
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent sx={{ pb: 1, pt: 3 }}>
        {surgery && activeStep !== steps.length - 1 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Surgery: <Typography component="span" fontWeight="medium" color="text.primary">{surgery.name}</Typography>
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Estimated Cost: <Typography component="span" fontWeight="medium" color="primary">₹{surgery.estimatedCost.toLocaleString()}</Typography>
            </Typography>
          </Box>
        )}
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Personal Information</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        )}
        
        {activeStep === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Schedule Your Consultation</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Preferred Date"
                  value={formData.date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  minDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Preferred Time"
                  value={formData.time}
                  onChange={handleTimeChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Consultation Mode
              </Typography>
              <RadioGroup
                row
                name="mode"
                value={formData.mode}
                onChange={handleChange}
              >
                <FormControlLabel 
                  value="video" 
                  control={<Radio />} 
                  label={(
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <VideocamIcon sx={{ mr: 1 }} />
                      <Typography>Video Consultation</Typography>
                    </Box>
                  )} 
                />
                <FormControlLabel 
                  value="inPerson" 
                  control={<Radio />} 
                  label={(
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      <Typography>In-Person Consultation</Typography>
                    </Box>
                  )} 
                />
              </RadioGroup>
            </Grid>
          </Grid>
        )}
        
        {activeStep === 2 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MedicalServicesIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Additional Information</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Information or Questions"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Please provide any additional information about your condition or any questions you have about the surgery."
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Upload Medical Documents (Optional)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AttachMoneyIcon />}
              >
                Upload Files
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      documents: [...e.target.files]
                    }));
                  }}
                />
              </Button>
              {formData.documents.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Files:
                  </Typography>
                  <List dense>
                    {Array.from(formData.documents).map((file, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Grid>
          </Grid>
        )}
        
        {activeStep === 3 && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            
            <Typography variant="h5" gutterBottom>
              Consultation Request Submitted!
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              Your consultation request for {surgery?.name} has been successfully submitted. Our medical team will review your request and contact you shortly at {formData.email} or {formData.phone}.
            </Typography>
            
            <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom>
                Appointment Details:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon color="primary" sx={{ mr: 1 }} />
                    <Typography>
                      {formData.date ? format(formData.date, 'EEEE, MMMM d, yyyy') : 'Date not specified'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography>
                      {formData.time ? format(formData.time, 'h:mm a') : 'Time not specified'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Chip 
                    icon={formData.mode === 'video' ? <VideocamIcon /> : <PersonIcon />} 
                    label={formData.mode === 'video' ? 'Video Consultation' : 'In-Person Consultation'} 
                    color="primary" 
                    variant="outlined" 
                  />
                </Grid>
              </Grid>
            </Paper>
            
            <Typography variant="body2" paragraph>
              Please keep an eye on your email for further instructions and preparation guidelines.
            </Typography>
            
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{ mt: 2 }}
            >
              Done
            </Button>
          </Box>
        )}
      </DialogContent>
      
      {activeStep !== steps.length - 1 && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack}>
              Back
            </Button>
          )}
          <Box sx={{ flex: '1 1 auto' }} />
          <Button 
            variant="contained"
            onClick={activeStep === steps.length - 2 ? handleSubmit : handleNext}
            disabled={
              (activeStep === 0 && (!formData.name || !formData.email || !formData.phone)) ||
              (activeStep === 1 && (!formData.date || !formData.time))
            }
          >
            {activeStep === steps.length - 2 ? 'Submit Request' : 'Next'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

const Surgeries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Surgeries');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [selectedSurgery, setSelectedSurgery] = useState(null);
  
  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };
  
  const handleSurgeryClick = (surgery) => {
    setSelectedSurgery(surgery);
    setDetailsOpen(true);
  };
  
  const handleConsultClick = (surgery) => {
    setSelectedSurgery(surgery);
    setConsultOpen(true);
  };
  
  // Filter surgeries based on search term and category
  const filteredSurgeries = surgeries.filter(surgery => {
    const matchesSearch = 
      surgery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Surgeries' || surgery.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      <NavBar />
      <PageHeader 
        title="Surgical Procedures" 
        subtitle="Explore various surgical procedures, their costs, risks, recovery times, and consult with our specialists."
        image={surgeryHeaderImage}
      />
      
      <Container maxWidth="xl" sx={{ mb: 8 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search for surgeries, specialties, or conditions..."
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
            sx={{ maxWidth: 600, mx: 'auto', display: 'block' }}
          />
        </Box>
        
        {/* Categories */}
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              mb: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 'auto',
                px: 2,
              }
            }}
          >
            {surgeryCategories.map((category) => (
              <Tab key={category} value={category} label={category} />
            ))}
          </Tabs>
        </Box>
        
        {/* Surgery Info Banner */}
        <Box 
          sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: 2, 
            bgcolor: 'primary.light',
            color: 'white',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              Free Initial Consultation
            </Typography>
            <Typography variant="body1">
              Discuss your surgical needs with our specialists before making any decisions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Chip 
                icon={<MedicalServicesIcon />} 
                label="Expert Surgeons" 
                color="secondary" 
              />
              <Chip 
                icon={<LocalHospitalIcon />} 
                label="Top Hospitals" 
                color="secondary" 
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Need help choosing?
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
            >
              Talk to a Medical Advisor
            </Button>
          </Box>
        </Box>
        
        {/* Surgery Grid */}
        <Typography 
          variant="h5" 
          sx={{ mb: 3, fontWeight: 600 }}
        >
          {selectedCategory} ({filteredSurgeries.length})
        </Typography>
        
        <Grid container spacing={3}>
          {filteredSurgeries.length > 0 ? (
            filteredSurgeries.map((surgery) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={surgery.id}>
                <SurgeryCard 
                  surgery={surgery} 
                  onConsultClick={handleConsultClick} 
                  onClick={() => handleSurgeryClick(surgery)}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No surgeries match your search criteria.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search terms or category selection.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
      
      {/* Surgery Details Dialog */}
      <SurgeryDetails 
        open={detailsOpen} 
        surgery={selectedSurgery} 
        onClose={() => setDetailsOpen(false)}
        onRequestConsultation={handleConsultClick}
      />
      
      {/* Consultation Request Dialog */}
      <ConsultationRequestForm 
        open={consultOpen} 
        surgery={selectedSurgery} 
        onClose={() => setConsultOpen(false)}
      />
    </Box>
  );
};

export default Surgeries;