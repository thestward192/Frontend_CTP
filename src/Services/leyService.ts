// src/services/LeyService.ts
import axios from 'axios';
import { Ley } from '../types/ley';

const API_URL = 'http://localhost:3000'; // Ajusta la URL según tu backend

// Obtener todas las leyes
export const getLeyes = async (): Promise<Ley[]> => {
  try {
    const response = await axios.get(`${API_URL}/ley`);
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
  export const deleteLey = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/ley/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la ley con ID ${id}:`, error);
      throw error;
    }
  };
