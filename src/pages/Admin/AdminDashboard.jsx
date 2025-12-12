import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Schedule as ScheduleIcon,
  List as ListIcon,
  Logout as LogoutIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import CreateDoctorForm from './CreateDoctorForm';
import CreateSlotsForm from './CreateSlotsForm';
import BookingsTable from './BookingsTable';

const TabPanel = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ py: 3 }}>
    {value === index && children}
  </Box>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { username, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ backgroundColor: '#1B3C74' }}>
        <Toolbar>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Medify Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {username}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: '#fff',
            }}
          >
            <Tab
              icon={<PersonAddIcon />}
              label="Create Doctor"
              iconPosition="start"
            />
            <Tab
              icon={<ScheduleIcon />}
              label="Create Slots"
              iconPosition="start"
            />
            <Tab
              icon={<ListIcon />}
              label="View Bookings"
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ p: 3, backgroundColor: '#fff' }}>
            <TabPanel value={activeTab} index={0}>
              <CreateDoctorForm />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <CreateSlotsForm />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <BookingsTable />
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
