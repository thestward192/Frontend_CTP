// src/services/UbicacionService.ts
import axios from 'axios';
import { CreateUbicacion, Ubicacion } from '../types/ubicacion';

const API_URL = 'http://localhost:3000';

// Crear una nueva ubicación (POST)
export const createUbicacion = async (ubicacionData: CreateUbicacion): Promise<Ubicacion> => {
  try {
    const response = await axios.post(`${API_URL}/ubicacion`, ubicacionData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar la ubicación:', error);
    throw new Error('Error al agregar la ubicación');
  }
};

// Obtener todas las ubicaciones (GET)
export const getUbicaciones = async (): Promise<Ubicacion[]> => {
  try {
    const response = await axios.get(`${API_URL}/ubicacion`); // Asegúrate de que la ruta es correcta
    return response.data;
  } catch (error) {
    console.error('Error al obtener las ubicaciones:', error);
    throw new Error('Error al obtener las ubicaciones');
  }
};

// Obtener una ubicación por ID (GET by ID)
export const getUbicacionById = async (id: number): Promise<Ubicacion> => {
  try {
    const response = await axios.get(`${API_URL}/ubicacion/${id}`); // Asegúrate de que la ruta es correcta
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la ubicación con ID ${id}:`, error);
    throw new Error(`Error al obtener la ubicación con ID ${id}`);
  }
};

// Eliminar una ubicación (DELETE)
// src/services/UbicacionService.ts
export const deleteUbicacion = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/ubicacion/${id}`); // Asegúrate de que la ruta es correcta
  } catch (error) {
    console.error(`Error al eliminar la ubicación con ID ${id}:`, error);
    throw new Error(`Error al eliminar la ubicación con ID ${id}`);
  }
};

