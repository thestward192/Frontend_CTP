import axios from 'axios';
import { Activo } from '../types/activo';
import { Ley } from '../types/ley';
import { Donador } from '../types/donador';
import { Ubicacion } from '../types/ubicacion';


const API_URL = 'http://localhost:3000';

// Función para crear un nuevo activo
export const createActivo = async (activo: Activo): Promise<Activo> => {
  const response = await axios.post<Activo>(`${API_URL}/activo`, activo, {
    headers: {
      'Content-Type': 'application/json',  // Enviar como JSON
    },
  });

  return response.data;
};

// Función para obtener todas las leyes
export const getLeyes = async (): Promise<Ley[]> => {
  const response = await axios.get<Ley[]>(`${API_URL}/ley`);
  return response.data;
};

// Función para obtener todos los donadores
export const getDonadores = async (): Promise<Donador[]> => {
  const response = await axios.get<Donador[]>(`${API_URL}/donador`);
  return response.data;
};

// Función para obtener todas las ubicaciones
export const getUbicaciones = async (): Promise<Ubicacion[]> => {
  const response = await axios.get<Ubicacion[]>(`${API_URL}/ubicacion`);
  return response.data;
};