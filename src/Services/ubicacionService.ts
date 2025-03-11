// src/services/UbicacionService.ts
import axios from 'axios';
import { CreateUbicacion, Ubicacion } from '../types/ubicacion';

const API_URL = 'https://backendcontrolactivos-2.onrender.com';

//const API_URL = 'http://localhost:3000';

export const createUbicacion = async (ubicacionData: CreateUbicacion): Promise<Ubicacion> => {
  try {
    const response = await axios.post(`${API_URL}/ubicacion`, ubicacionData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar la ubicación:', error);
    throw new Error('Error al agregar la ubicación');
  }
};

export const getUbicaciones = async (): Promise<Ubicacion[]> => {
  try {
    const response = await axios.get(`${API_URL}/ubicacion`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las ubicaciones:', error);
    throw new Error('Error al obtener las ubicaciones');
  }
};

export const updateUbicacion = async (id: number, ubicacionData: Partial<Ubicacion>): Promise<Ubicacion> => {
  try {
    const response = await axios.patch(`${API_URL}/ubicacion/${id}`, ubicacionData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la ubicación con ID ${id}:`, error);
    throw new Error(`Error al actualizar la ubicación con ID ${id}`);
  }
};

export const getUbicacionById = async (id: number): Promise<Ubicacion> => {
  try {
    const response = await axios.get(`${API_URL}/ubicacion/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la ubicación con ID ${id}:`, error);
    throw new Error(`Error al obtener la ubicación con ID ${id}`);
  }
};

export const updateDisponibilidadUbicacion = async (id: number): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/ubicacion/${id}`, { disponibilidad: 'Fuera de Servicio' }); // Actualizamos a "Fuera de Servicio"
  } catch (error) {
    console.error(`Error al actualizar la disponibilidad de la ubicación con ID ${id}:`, error);
    throw new Error(`Error al actualizar la disponibilidad de la ubicación con ID ${id}`);
  }
};


