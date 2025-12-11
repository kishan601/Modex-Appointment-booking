import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { useDoctors } from '../../context/DoctorsContext';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
];

const CreateSlotsForm = () => {
  const { doctors, fetchDoctors, createSlot, createBulkSlots, loading: doctorsLoading } = useDoctors();
  
  const [mode, setMode] = useState('single');
  const [formData, setFormData] = useState({
    doctor_id: '',
    slot_date: '',
    slot_time: '',
    dates: [],
    times: [],
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (doctors.length === 0) {
      fetchDoctors().catch(console.error);
    }
  }, [doctors.length, fetchDoctors]);

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getNextDays = (days) => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.doctor_id) {
      newErrors.doctor_id = 'Please select a doctor';
    }
    
    if (mode === 'single') {
      if (!formData.slot_date) {
        newErrors.slot_date = 'Date is required';
      } else {
        const selectedDate = new Date(formData.slot_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          newErrors.slot_date = 'Cannot select a past date';
        }
      }
      if (!formData.slot_time) {
        newErrors.slot_time = 'Time is required';
      }
    } else {
      if (formData.dates.length === 0) {
        newErrors.dates = 'Please select at least one date';
      }
      if (formData.times.length === 0) {
        newErrors.times = 'Please select at least one time slot';
      }
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

  const handleTimesChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      times: typeof value === 'string' ? value.split(',') : value,
    }));
    if (errors.times) {
      setErrors((prev) => ({ ...prev, times: '' }));
    }
  };

  const addDate = () => {
    if (formData.slot_date && !formData.dates.includes(formData.slot_date)) {
      const selectedDate = new Date(formData.slot_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setErrors((prev) => ({ ...prev, slot_date: 'Cannot select a past date' }));
        return;
      }
      
      setFormData((prev) => ({
        ...prev,
        dates: [...prev.dates, prev.slot_date].sort(),
        slot_date: '',
      }));
      if (errors.dates) {
        setErrors((prev) => ({ ...prev, dates: '' }));
      }
    }
  };

  const removeDate = (date) => {
    setFormData((prev) => ({
      ...prev,
      dates: prev.dates.filter((d) => d !== date),
    }));
  };

  const addNextWeek = () => {
    const nextWeekDates = getNextDays(7);
    setFormData((prev) => ({
      ...prev,
      dates: [...new Set([...prev.dates, ...nextWeekDates])].sort(),
    }));
    if (errors.dates) {
      setErrors((prev) => ({ ...prev, dates: '' }));
    }
  };

  const selectAllTimes = () => {
    setFormData((prev) => ({
      ...prev,
      times: [...timeSlots],
    }));
    if (errors.times) {
      setErrors((prev) => ({ ...prev, times: '' }));
    }
  };

  const clearAllTimes = () => {
    setFormData((prev) => ({
      ...prev,
      times: [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setApiError('');
    setSuccess('');
    
    try {
      if (mode === 'single') {
        await createSlot({
          doctor_id: Number(formData.doctor_id),
          slot_date: formData.slot_date,
          slot_time: formData.slot_time,
        });
        setSuccess('Slot created successfully!');
        setFormData((prev) => ({
          ...prev,
          slot_date: '',
          slot_time: '',
        }));
      } else {
        const result = await createBulkSlots({
          doctor_id: Number(formData.doctor_id),
          dates: formData.dates,
          times: formData.times,
        });
        setSuccess(`${result.created} slots created successfully!`);
        setFormData((prev) => ({
          ...prev,
          dates: [],
          times: [],
        }));
      }
    } catch (err) {
      if (err.message.includes('already exists')) {
        setApiError('This slot already exists. Please select a different date/time.');
      } else if (err.message.includes('401') || err.message.includes('403')) {
        setApiError('Session expired. Please login again.');
      } else {
        setApiError(err.message || 'Failed to create slots. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#1B3C74', fontWeight: 600 }}>
        Create Time Slots
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add available appointment slots for doctors
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant={mode === 'single' ? 'contained' : 'outlined'}
          onClick={() => setMode('single')}
          sx={{ 
            backgroundColor: mode === 'single' ? '#2AA7FF' : 'transparent',
            '&:hover': { backgroundColor: mode === 'single' ? '#1a97ef' : 'rgba(42, 167, 255, 0.1)' },
          }}
        >
          Single Slot
        </Button>
        <Button
          variant={mode === 'bulk' ? 'contained' : 'outlined'}
          onClick={() => setMode('bulk')}
          sx={{ 
            backgroundColor: mode === 'bulk' ? '#2AA7FF' : 'transparent',
            '&:hover': { backgroundColor: mode === 'bulk' ? '#1a97ef' : 'rgba(42, 167, 255, 0.1)' },
          }}
        >
          Bulk Create
        </Button>
      </Box>

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
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Select Doctor"
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              error={!!errors.doctor_id}
              helperText={errors.doctor_id || (doctorsLoading ? 'Loading doctors...' : '')}
              disabled={loading || doctorsLoading}
              required
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {mode === 'single' ? (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date"
                  name="slot_date"
                  type="date"
                  value={formData.slot_date}
                  onChange={handleChange}
                  error={!!errors.slot_date}
                  helperText={errors.slot_date}
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getTodayDate() }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Time Slot"
                  name="slot_time"
                  value={formData.slot_time}
                  onChange={handleChange}
                  error={!!errors.slot_time}
                  helperText={errors.slot_time}
                  disabled={loading}
                  required
                >
                  {timeSlots.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Select Dates
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Add Date"
                    name="slot_date"
                    type="date"
                    value={formData.slot_date}
                    onChange={handleChange}
                    disabled={loading}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: getTodayDate() }}
                    size="small"
                    sx={{ width: 180 }}
                    error={!!errors.slot_date}
                  />
                  <Button
                    variant="outlined"
                    onClick={addDate}
                    disabled={loading || !formData.slot_date}
                    size="small"
                  >
                    Add Date
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={addNextWeek}
                    disabled={loading}
                    size="small"
                    color="secondary"
                  >
                    + Next 7 Days
                  </Button>
                </Box>
                {errors.dates && (
                  <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                    {errors.dates}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {formData.dates.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No dates selected
                    </Typography>
                  ) : (
                    formData.dates.map((date) => (
                      <Chip
                        key={date}
                        label={formatDateDisplay(date)}
                        onDelete={() => removeDate(date)}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Select Time Slots
                  </Typography>
                  <Button size="small" onClick={selectAllTimes} disabled={loading}>
                    Select All
                  </Button>
                  <Button size="small" onClick={clearAllTimes} disabled={loading}>
                    Clear All
                  </Button>
                </Box>
                <FormControl fullWidth error={!!errors.times}>
                  <InputLabel>Time Slots</InputLabel>
                  <Select
                    multiple
                    value={formData.times}
                    onChange={handleTimesChange}
                    input={<OutlinedInput label="Time Slots" />}
                    renderValue={(selected) => `${selected.length} time slots selected`}
                    disabled={loading}
                  >
                    {timeSlots.map((time) => (
                      <MenuItem key={time} value={time}>
                        <Checkbox checked={formData.times.indexOf(time) > -1} />
                        <ListItemText primary={time} />
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.times && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.times}
                    </Typography>
                  )}
                </FormControl>
                {formData.times.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Selected: {formData.times.join(', ')}
                    </Typography>
                  </Box>
                )}
              </Grid>

              {formData.dates.length > 0 && formData.times.length > 0 && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    This will create <strong>{formData.dates.length * formData.times.length}</strong> slots 
                    ({formData.dates.length} dates × {formData.times.length} time slots)
                  </Alert>
                </Grid>
              )}
            </>
          )}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !formData.doctor_id}
                sx={{
                  minWidth: 150,
                  backgroundColor: '#2AA7FF',
                  '&:hover': { backgroundColor: '#1a97ef' },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : mode === 'single' ? (
                  'Create Slot'
                ) : (
                  `Create ${formData.dates.length * formData.times.length || 0} Slots`
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateSlotsForm;
