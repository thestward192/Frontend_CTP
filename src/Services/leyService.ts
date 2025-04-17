// src/services/LeyService.ts
import axios from 'axios';
import { Ley } from '../types/ley';

const API_URL = 'https://backendcontrolactivos-2.onrender.com';

//const API_URL = 'http://localhost:3000';

// Obtener todas las leyes
export const getLeyes = async (disponibilidad?: string): Promise<Ley[]> => {
  try {
    const params = disponibilidad ? { disponibilidad } : {};
    const response = await axios.get(`${API_URL}/ley`, { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las leyes:', error);
    throw error;
  }
};

export const createLey = async (leyData: Omit<Ley, 'id'>): Promise<Ley> => {
  try {
    const response = await axios.post(`${API_URL}/ley`, leyData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la ley:', error);
    throw error;
  }
};

export const updateLey = async (id: number, leyData: Partial<Ley>): Promise<Ley> => {
  try {
    const response = await axios.patch(`${API_URL}/ley/${id}`, leyData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la ley con ID ${id}:`, error);
    throw error;
  }
};

export const getLeyById = async (id: number): Promise<Ley> => {
  try {
    const response = await axios.get(`${API_URL}/ley/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la ley con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una ley por ID
export const updateDisponibilidadLey = async (id: number): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/ley/${id}/disponibilidad`);
  } catch (error) {
    console.error(`Error al actualizar la disponibilidad de la ley con ID ${id}:`, error);
    throw error;
  }
};

