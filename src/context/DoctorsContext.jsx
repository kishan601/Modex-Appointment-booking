import React, { createContext, useContext, useState, useCallback } from 'react';
import { doctorsApi, slotsApi } from '../services/api';

const DoctorsContext = createContext();

export const DoctorsProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await doctorsApi.getAll();
      setDoctors(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch doctors';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSlots = useCallback(async (doctorId, date = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await doctorsApi.getSlots(doctorId, date);
      const cacheKey = `doctor_${doctorId}_${date || 'all'}`;
      setSlots((prev) => ({
        ...prev,
        [cacheKey]: response.data,
      }));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch slots';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSlotsCached = useCallback((doctorId, date = null) => {
    const cacheKey = `doctor_${doctorId}_${date || 'all'}`;
    return slots[cacheKey] || null;
  }, [slots]);

  const createDoctor = useCallback(async (doctorData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await doctorsApi.create(doctorData);
      setDoctors((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create doctor';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSlot = useCallback(async (slotData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await slotsApi.create(slotData);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create slot';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBulkSlots = useCallback(async (slotsData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await slotsApi.createBulk(slotsData);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create slots';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    doctors,
    slots,
    loading,
    error,
    fetchDoctors,
    fetchSlots,
    getSlotsCached,
    createDoctor,
    createSlot,
    createBulkSlots,
  };

  return (
    <DoctorsContext.Provider value={value}>{children}</DoctorsContext.Provider>
  );
};

export const useDoctors = () => {
  const context = useContext(DoctorsContext);
  if (!context) {
    throw new Error('useDoctors must be used within DoctorsProvider');
  }
  return context;
};
