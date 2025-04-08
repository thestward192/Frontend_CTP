import axios from 'axios';
import { Licitacion, UpdateLicitacionDTO } from '../types/licitacion';


const API_URL = 'https://backendcontrolactivos-2.onrender.com/licitacion';

//const API_URL = 'http://localhost:3000/licitacion';

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
      const response = await axios.patch(`${API_URL}/${id}`, licitacionData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la licitación con ID ${id}:`, error);
      throw error;
    }
  };

// Servicio para actualizar la disponibilidad de una licitación
export const updateDisponibilidadLicitacion = async (id: number, disponibilidad: string): Promise<void> => {
  await axios.patch(`${API_URL}/${id}`, { disponibilidad });
};

