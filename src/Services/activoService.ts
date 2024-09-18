// src/services/activoService.ts
import axios from 'axios';
import { Activo } from '../types/activo';

const API_URL = 'http://localhost:3000'; // Ajusta la URL según tu backend

// Obtener todos los activos
export const getActivos = async (): Promise<Activo[]> => {
  try {
    const response = await axios.get(`${API_URL}/activo`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los activos:', error);
    throw error;
  }
};

// Crear un activo
export const createActivo = async (activoData: Omit<Activo, 'id'>): Promise<Activo> => {
  try {
    const response = await axios.post(`${API_URL}/activo`, activoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el activo:', error);
    throw error;
  }
};

// Obtener activo por ID
export const getActivoById = async (id: number): Promise<Activo> => {
  try {
    const response = await axios.get(`${API_URL}/activo/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el activo con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un activo
export const deleteActivo = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/activo/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el activo con ID ${id}:`, error);
    throw error;
  }
};
