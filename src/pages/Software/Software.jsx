// src/pages/Software/Software.jsx
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
  Paper,
  Rating
} from '@mui/material';
import NavBar from '../../components/NavBar/NavBar';
import PageHeader from '../../components/PageHeader/PageHeader';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import BusinessIcon from '@mui/icons-material/Business';
import DevicesIcon from '@mui/icons-material/Devices';
import CloudIcon from '@mui/icons-material/Cloud';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { softwareProducts, softwareCategories } from '../../data/softwareData';

// Replace with a real software header image
const softwareHeaderImage = "https://img.freepik.com/free-photo/medicine-technology-concept-doctor-using-digital-tablet_53876-14522.jpg";

const SoftwareCard = ({ software, onDemoClick }) => {
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
        image={software.image}
        alt={software.name}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {software.category}
        </Typography>
        
        <Typography variant="h6" component="h2" gutterBottom>
          {software.name}
        </Typography>
        
        <Box sx={{ my: 1 }}>
          <Chip 
            icon={<BusinessIcon />} 
            label={`Best for: ${software.bestFor}`} 
            color="primary" 
            variant="outlined"
            size="small"
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip 
            icon={software.deployment.includes('Cloud') ? <CloudIcon /> : <DevicesIcon />} 
            label={software.deployment} 
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {software.description}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="subtitle2" gutterBottom>
            Key Features:
          </Typography>
          <List dense disablePadding>
            {software.features.slice(0, 3).map((feature, index) => (
              <ListItem key={index} disablePadding disableGutters>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <CheckIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
            {software.features.length > 3 && (
              <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                +{software.features.length - 3} more features
              </Typography>
            )}
          </List>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" color="primary">
            {software.price}
          </Typography>
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="outlined" 
          fullWidth
          onClick={() => onDemoClick(software)}
          startIcon={<AccessTimeIcon />}
        >
          Request Demo
        </Button>
      </CardActions>
    </Card>
  );
};

const SoftwareDetails = ({ open, software, onClose, onRequestDemo }) => {
  if (!software) return null;
  
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
          {software.name}
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
              src={software.image}
              alt={software.name}
              sx={{
                width: '100%',
                borderRadius: 2,
                mb: 2
              }}
            />
            
            <Typography variant="h6" gutterBottom>
              Pricing
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              {software.price}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {software.pricing} Model
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip 
                icon={<BusinessIcon />} 
                label={`Best for: ${software.bestFor}`} 
                color="primary" 
                variant="outlined"
              />
              <Chip 
                icon={software.deployment.includes('Cloud') ? <CloudIcon /> : <DevicesIcon />} 
                label={software.deployment} 
                variant="outlined"
              />
              {software.mobileSupport && (
                <Chip 
                  icon={<DevicesIcon />} 
                  label="Mobile Support" 
                  variant="outlined"
                />
              )}
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              startIcon={<AccessTimeIcon />}
              onClick={() => {
                onClose();
                onRequestDemo(software);
              }}
              sx={{ mt: 2 }}
            >
              Request Demo - {software.freeTrial} Free Trial
            </Button>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              About {software.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {software.description}
            </Typography>
            
            <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Key Features
              </Typography>
              <List dense disablePadding>
                {software.features.map((feature, index) => (
                  <ListItem key={index} disablePadding disableGutters>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                What's Included
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {software.freeTrial} Free Trial
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      24/7 Technical Support
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {software.trainingIncluded ? "Training Included" : "Training Available"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Regular Updates
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const DemoRequestForm = ({ open, software, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    employees: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    console.log('Demo request:', {
      software,
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
      organization: '',
      role: '',
      employees: '',
      message: '',
    });
    setSubmitted(false);
    onClose();
  };
  
  const steps = ['Personal Information', 'Organization Details', 'Confirmation'];
  
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
          {activeStep === steps.length - 1 ? 'Demo Request Sent' : 'Request a Demo'}
        </Typography>
        {activeStep !== steps.length - 1 && (
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent sx={{ pb: 1, pt: 3 }}>
        {software && activeStep !== steps.length - 1 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Software: <Typography component="span" fontWeight="medium" color="text.primary">{software.name}</Typography>
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Free Trial: <Typography component="span" fontWeight="medium" color="primary">{software.freeTrial}</Typography>
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
                <BusinessIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Organization Details</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Organization Name"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Your Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Organization Size</InputLabel>
                <Select
                  label="Organization Size"
                  name="employees"
                  value={formData.employees}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="1-10">1-10 employees</MenuItem>
                  <MenuItem value="11-50">11-50 employees</MenuItem>
                  <MenuItem value="51-200">51-200 employees</MenuItem>
                  <MenuItem value="201-500">201-500 employees</MenuItem>
                  <MenuItem value="501+">501+ employees</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Information or Questions"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Please provide any specific requirements or questions you have about the software."
              />
            </Grid>
          </Grid>
        )}
        
        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            
            <Typography variant="h5" gutterBottom>
              Demo Request Submitted!
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              Your request for a demo of {software?.name} has been successfully submitted. Our team will contact you at {formData.email} or {formData.phone} to schedule your demo session.
            </Typography>
            
            <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom>
                What's Next:
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Confirmation Email" 
                    secondary="You'll receive a confirmation email with details of your request."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Demo Scheduling" 
                    secondary="Our team will contact you within 24 hours to schedule your personalized demo."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Free Trial Setup" 
                    secondary={`You'll get access to a ${software?.freeTrial} free trial after the demo.`}
                  />
                </ListItem>
              </List>
            </Paper>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleClose}
            >
              Close
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
          <Button
            variant="contained"
            color="primary"
            onClick={activeStep === steps.length - 2 ? handleSubmit : handleNext}
          >
            {activeStep === steps.length - 2 ? 'Submit Request' : 'Next'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

const Software = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(softwareCategories[0]);
  const [selectedSoftware, setSelectedSoftware] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [demoFormOpen, setDemoFormOpen] = useState(false);
  
  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleSoftwareClick = (software) => {
    setSelectedSoftware(software);
    setDetailsOpen(true);
  };
  
  const handleDemoRequest = (software) => {
    setSelectedSoftware(software);
    setDemoFormOpen(true);
  };
  
  const filteredSoftware = softwareProducts.filter(software => {
    // Filter by category
    if (selectedCategory !== "All Software" && software.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        software.name.toLowerCase().includes(query) ||
        software.description.toLowerCase().includes(query) ||
        software.category.toLowerCase().includes(query) ||
        software.features.some(feature => feature.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  return (
    <Box>
      <NavBar />
      
      <PageHeader 
        title="Healthcare Software Solutions" 
        subtitle="Discover and implement powerful software tools designed specifically for healthcare providers to streamline operations and improve patient care."
        image={softwareHeaderImage}
      />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Search and Filter */}
        <Box sx={{ mb: 5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search software by name, feature, or category..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  sx={{
                    '& .MuiTab-root': {
                      minWidth: 'auto',
                      px: 2,
                    },
                  }}
                >
                  {softwareCategories.map((category) => (
                    <Tab key={category} label={category} value={category} />
                  ))}
                </Tabs>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Results Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Showing {filteredSoftware.length} {filteredSoftware.length === 1 ? 'software' : 'software solutions'}
            {selectedCategory !== "All Software" ? ` in ${selectedCategory}` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </Typography>
        </Box>
        
        {/* Software Grid */}
        <Grid container spacing={3}>
          {filteredSoftware.map((software) => (
            <Grid item xs={12} sm={6} md={4} key={software.id}>
              <SoftwareCard software={software} onDemoClick={handleSoftwareClick} />
            </Grid>
          ))}
        </Grid>
        
        {filteredSoftware.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" gutterBottom>
              No software solutions found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search criteria or browse a different category.
            </Typography>
          </Box>
        )}
      </Container>
      
      {/* Software Details Dialog */}
      <SoftwareDetails 
        open={detailsOpen}
        software={selectedSoftware}
        onClose={() => setDetailsOpen(false)}
        onRequestDemo={handleDemoRequest}
      />
      
      {/* Demo Request Form Dialog */}
      <DemoRequestForm 
        open={demoFormOpen}
        software={selectedSoftware}
        onClose={() => setDemoFormOpen(false)}
      />
    </Box>
  );
};

export default Software;