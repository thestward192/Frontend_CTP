import axios from 'axios';
import { Activo } from '../types/activo';

// const API_URL = 'https://backendcontrolactivos-2.onrender.com';

const API_URL = 'http://localhost:3000';

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

// Obtener activos por ubicación
export const getActivosByUbicacion = async (ubicacionId: number): Promise<Activo[]> => {
  try {
    const response = await axios.get(`${API_URL}/activo/ubicacion/${ubicacionId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los activos por ubicación:', error);
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

// Actualizar un activo
export const updateActivo = async (id: number, activoData: Partial<Activo>): Promise<Activo> => {
  try {
    const response = await axios.patch(`${API_URL}/activo/${id}`, activoData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el activo con ID ${id}:`, error);
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



// Obtener código de barras para un activo dado su número de placa
export const getBarcode = async (numPlaca: string): Promise<Blob> => {
  try {
    const response = await axios.get(`${API_URL}/activo/barcode/${numPlaca}`, {
      responseType: 'blob', // Esto es importante para que axios trate la respuesta como un Blob
    });
    return response.data;
  } catch (error) {
    console.error(`Error al generar el código de barras para el número de placa ${numPlaca}:`, error);
    throw error;
  }
};