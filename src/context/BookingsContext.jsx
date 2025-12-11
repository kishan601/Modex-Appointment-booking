import React, { createContext, useContext, useState, useCallback } from 'react';
import { bookingsApi } from '../services/api';

const BookingsContext = createContext();

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [userBookings, setUserBookings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingsApi.create(bookingData);
      
      // Cache the new booking
      const email = bookingData.patient_email;
      setUserBookings((prev) => ({
        ...prev,
        [email]: [...(prev[email] || []), response.data.booking],
      }));
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserBookings = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      // Return cached if available
      if (userBookings[email]) {
        setLoading(false);
        return userBookings[email];
      }

      const response = await bookingsApi.getByEmail(email);
      setUserBookings((prev) => ({
        ...prev,
        [email]: response.data,
      }));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch bookings';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userBookings]);

  const fetchAllBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingsApi.getAll();
      setBookings(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch bookings';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingsApi.cancel(bookingId);
      
      // Update bookings in all caches
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      );
      
      setUserBookings((prev) => ({
        ...Object.keys(prev).reduce((acc, email) => {
          acc[email] = prev[email].map((b) =>
            b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
          );
          return acc;
        }, {}),
      }));

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to cancel booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    bookings,
    userBookings,
    loading,
    error,
    createBooking,
    fetchUserBookings,
    fetchAllBookings,
    cancelBooking,
  };

  return (
    <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error('useBookings must be used within BookingsProvider');
  }
  return context;
};
