import axios from 'axios';
import { Prestamo } from '../types/prestamo';

//const API_URL = 'https://backendcontrolactivos-2.onrender.com/prestamos';

const API_URL = 'http://localhost:3000/prestamos';

const getAuthToken = () => localStorage.getItem('token');

export const createPrestamo = async (prestamoData: Omit<Prestamo, 'id'>) => {
  const token = getAuthToken();
  const response = await axios.post(API_URL, prestamoData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updatePrestamoEstado = async (id: number, estado: string) => {
  const token = getAuthToken();
  const response = await axios.patch(`${API_URL}/${id}/estado`, { estado }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deletePrestamo = async (id: number) => {
  const token = getAuthToken();
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getPrestamosByUbicacion = async (ubicacionId: number) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/ubicacion/${ubicacionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getPrestamosByUsuario = async (prestadoPorId: number) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/usuario/${prestadoPorId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getPrestamosByEstado = async (estado: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}?estado=${estado}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los préstamos por estado:', error);
    throw error;
  }
};

export const getPrestamosByActivo = async (activoId: number) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/activo/${activoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllPrestamos = async (): Promise<Prestamo[]> => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los préstamos:', error);
    throw new Error('No se pudo obtener los préstamos');
  }
};