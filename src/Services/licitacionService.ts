import axios from 'axios';
import { Licitacion, UpdateLicitacionDTO } from '../types/licitacion';

// URL base para las peticiones
const API_URL = 'http://localhost:3000/licitacion'; // Cambia la URL según tu backend

// Servicio para obtener todas las licitaciones
export const getLicitaciones = async (): Promise<Licitacion[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Servicio para obtener una licitación por su ID
export const getLicitacionById = async (id: number): Promise<Licitacion> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Servicio para crear una nueva licitación
export const createLicitacion = async (licitacion: Licitacion): Promise<Licitacion> => {
    const response = await axios.post(API_URL, licitacion);
    return response.data;
};

// Servicio para actualizar una licitación
export const updateLicitacion = async (id: number, licitacionData: UpdateLicitacionDTO): Promise<Licitacion> => {
    try {
      const response = await axios.patch(`${API_URL}/licitacion/${id}`, licitacionData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la licitación con ID ${id}:`, error);
      throw error;
    }
  };

// Servicio para eliminar una licitación
export const deleteLicitacion = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
