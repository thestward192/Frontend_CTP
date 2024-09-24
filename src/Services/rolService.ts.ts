// src/Services/rolService.ts
import axios from 'axios';
import { Rol } from '../types/rol';

const API_URL = 'http://localhost:3000';

export const getRoles = async (): Promise<Rol[]> => {
  try {
    const response = await axios.get(`${API_URL}/rol`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    throw error;
  }
};
