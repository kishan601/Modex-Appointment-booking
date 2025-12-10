// src/pages/ProviderSoftware/ProviderSoftware.jsx

import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import NavBar from '../../components/NavBar/NavBar';
import PageHeader from '../../components/PageHeader/PageHeader';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneIcon from '@mui/icons-material/Done';
import DevicesIcon from '@mui/icons-material/Devices';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import SupportIcon from '@mui/icons-material/Support';
import AnalyticsIcon from '@mui/icons-material/Analytics';

// Use existing images from the project
import softwareImage from '../../assets/primary-care.png';

// Sample features data
const features = [
  {
    id: 1,
    title: 'Electronic Health Records',
    description: 'Intuitive EHR system that streamlines documentation and enhances clinical workflow.',
    benefits: [
      'Customizable templates for different specialties',
      'Voice-to-text capabilities for efficient note-taking',
      'Secure patient portal for communication',
      'Integrated e-prescribing with drug interaction alerts',
      'Automated coding suggestions for accurate billing'
    ],
    icon: <DevicesIcon sx={{ fontSize: 40 }} />
  },
  {
    id: 2,
    title: 'Telemedicine Platform',
    description: 'HIPAA-compliant video platform enabling virtual consultations and remote patient monitoring.',
    benefits: [
      'HD video quality with minimal bandwidth requirements',
      'Screen sharing and digital whiteboard tools',
      'Integrated scheduling and reminders',
      'Mobile app for iOS and Android devices',
      'Remote patient monitoring dashboard'
    ],
    icon: <CloudIcon sx={{ fontSize: 40 }} />
  },
  {
    id: 3,
    title: 'Practice Management',
    description: 'Comprehensive solution for scheduling, billing, and operations management.',
    benefits: [
      'Automated appointment reminders to reduce no-shows',
      'Insurance eligibility verification in real-time',
      'Revenue cycle management tools',
      'Inventory management for medical supplies',
      'Staff scheduling and resource allocation'
    ],
    icon: <AnalyticsIcon sx={{ fontSize: 40 }} />
  },
  {
    id: 4,
    title: 'Data Security & Compliance',
    description: 'Advanced security measures ensuring HIPAA compliance and data protection.',
    benefits: [
      'End-to-end encryption for all patient data',
      'Role-based access controls for staff',
      'Automated backup and disaster recovery',
      'Compliance monitoring and reporting tools',
      'Security breach prevention and detection'
    ],
    icon: <SecurityIcon sx={{ fontSize: 40 }} />
  }
];

// Pricing plans
const plans = [
  {
    title: 'Basic',
    price: '$199',
    period: 'per provider/month',
    features: [
      'Electronic Health Records',
      'Basic Practice Management',
      'E-Prescribing',
      'Patient Portal',
      'Standard Support (9am-5pm)',
      '1 Hour of Training',
    ],
    buttonText: 'Start Free Trial',
    isPopular: false
  },
  {
    title: 'Professional',
    price: '$349',
    period: 'per provider/month',
    features: [
      'Everything in Basic, plus:',
      'Telemedicine Platform',
      'Advanced Practice Management',
      'Custom Templates',
      'Analytics Dashboard',
      'Priority Support (24/7)',
      '5 Hours of Training',
    ],
    buttonText: 'Start Free Trial',
    isPopular: true
  },
  {
    title: 'Enterprise',
    price: '$599',
    period: 'per provider/month',
    features: [
      'Everything in Professional, plus:',
      'Custom Integrations',
      'Dedicated Account Manager',
      'Remote Patient Monitoring',
      'Advanced Analytics & Reporting',
      'White-labeled Patient Portal',
      'Unlimited Training & Support',
    ],
    buttonText: 'Contact Sales',
    isPopular: false
  }
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`software-tabpanel-${index}`}
      aria-labelledby={`software-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProviderSoftware = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <Box>
      <NavBar />
      <PageHeader 
        title="Healthcare Provider Software" 
        subtitle="Powerful, integrated solutions designed to streamline clinical workflows, enhance patient care, and optimize your practice."
        image={softwareImage}
      />
      
      <Container maxWidth="xl" sx={{ mb: 8 }}>
        {/* Software Features */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            textAlign="center"
            sx={{ fontWeight: 600, mb: 1 }}
          >
            All-in-One Provider Suite
          </Typography>
          <Typography 
            variant="subtitle1" 
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            Our comprehensive platform offers everything healthcare providers need to deliver exceptional care while optimizing operations.
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid item xs={12} md={6} key={feature.id}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    p: 3, 
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ 
                      mr: 2, 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: 'rgba(42, 167, 255, 0.1)',
                      color: 'primary.main'
                    }}>
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={600} gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" paragraph>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <List>
                    {feature.benefits.map((benefit, index) => (
                      <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={benefit} primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Tabs Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            textAlign="center"
            sx={{ fontWeight: 600, mb: 1 }}
          >
            Designed for All Specialties
          </Typography>
          <Typography 
            variant="subtitle1" 
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}
          >
            Our software adapts to the unique needs of different medical specialties.
          </Typography>
          
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={value} 
                onChange={handleChange} 
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
                aria-label="specialty tabs"
                centered
              >
                <Tab label="Primary Care" />
                <Tab label="Cardiology" />
                <Tab label="Orthopedics" />
                <Tab label="Pediatrics" />
                <Tab label="OB/GYN" />
                <Tab label="Psychiatry" />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Primary Care Solutions
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Our primary care module is designed to support family physicians, internists, and general practitioners in delivering comprehensive care to patients of all ages.
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <DoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Preventive care tracking and reminders"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Chronic disease management templates"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Integrated wellness assessment tools"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Population health management dashboards"
                      />
                    </ListItem>
                  </List>
                  <Button variant="contained" sx={{ mt: 2 }}>
                    Learn More
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box 
                    component="img"
                    src={softwareImage}
                    alt="Primary Care Software"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 2,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    }}
                  />
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Typography variant="h5">Cardiology-specific solutions available</Typography>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Typography variant="h5">Orthopedics-specific solutions available</Typography>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Typography variant="h5">Pediatrics-specific solutions available</Typography>
            </TabPanel>
            <TabPanel value={value} index={4}>
              <Typography variant="h5">OB/GYN-specific solutions available</Typography>
            </TabPanel>
            <TabPanel value={value} index={5}>
              <Typography variant="h5">Psychiatry-specific solutions available</Typography>
            </TabPanel>
          </Box>
        </Box>
        
        {/* Pricing Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            textAlign="center"
            sx={{ fontWeight: 600, mb: 1 }}
          >
            Simple, Transparent Pricing
          </Typography>
          <Typography 
            variant="subtitle1" 
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            Choose the plan that fits your practice's needs and budget.
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    height: '100%',
                    position: 'relative',
                    border: plan.isPopular ? '2px solid #2AA7FF' : '1px solid #e0e0e0',
                    boxShadow: plan.isPopular ? '0 8px 25px rgba(42, 167, 255, 0.15)' : '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                >
                  {plan.isPopular && (
                    <Box 
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 5,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      MOST POPULAR
                    </Box>
                  )}
                  
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {plan.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                    <Typography variant="h3" fontWeight={700}>
                      {plan.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" ml={1}>
                      {plan.period}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <List sx={{ mb: 3 }}>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx} sx={{ py: 1, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature}
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            fontWeight: idx === 0 && plan.title !== 'Basic' ? 600 : 400
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Button 
                    variant={plan.isPopular ? "contained" : "outlined"} 
                    fullWidth
                    sx={{ 
                      mt: 'auto',
                      py: 1.5
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Call to Action */}
        <Box 
          sx={{ 
            p: 6, 
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Ready to transform your practice?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
            Join thousands of healthcare providers who are streamlining their operations and enhancing patient care with our software solutions.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              Request Demo
            </Button>
            <Button 
              variant="outlined" 
              sx={{ 
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Contact Sales
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default ProviderSoftware;