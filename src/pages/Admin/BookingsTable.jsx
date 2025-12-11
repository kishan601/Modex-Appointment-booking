import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  TablePagination,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useBookings } from '../../context/BookingsContext';

const statusColors = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  FAILED: 'error',
  CANCELLED: 'default',
};

const BookingsTable = () => {
  const { bookings, fetchAllBookings, loading, error } = useBookings();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      await fetchAllBookings();
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.patient_first_name?.toLowerCase().includes(searchLower) ||
      booking.patient_last_name?.toLowerCase().includes(searchLower) ||
      booking.patient_email?.toLowerCase().includes(searchLower) ||
      booking.doctor_name?.toLowerCase().includes(searchLower) ||
      booking.status?.toLowerCase().includes(searchLower)
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
    return timeStr;
  };

  if (loading && bookings.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#1B3C74', fontWeight: 600 }}>
            All Bookings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage all appointment bookings
          </Typography>
        </Box>
        <Tooltip title="Refresh bookings">
          <IconButton onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        placeholder="Search by patient name, email, doctor, or status..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Doctor</TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {searchTerm ? 'No bookings match your search' : 'No bookings found'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking) => (
                  <TableRow key={booking.id} hover>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>
                      {booking.patient_first_name} {booking.patient_last_name}
                    </TableCell>
                    <TableCell>{booking.patient_email}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{booking.doctor_name || '-'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.specialty || ''}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(booking.booking_date)}</TableCell>
                    <TableCell>{formatTime(booking.booking_time)}</TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        color={statusColors[booking.status] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(booking.created_at)}</TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredBookings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default BookingsTable;
