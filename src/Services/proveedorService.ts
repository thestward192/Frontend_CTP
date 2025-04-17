import axios from 'axios';
import { CreateProveedor, Proveedor } from '../types/proveedor';

const API_URL = 'https://backendcontrolactivos-2.onrender.com';

//const API_URL = 'http://localhost:3000';

export const getProveedores = async (disponibilidad?: string): Promise<Proveedor[]> => {
  try {
    const params = disponibilidad ? { disponibilidad } : {};
    const response = await axios.get(`${API_URL}/proveedor`, { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los proveedores:', error);
    throw error;
  }
};

export const createProveedor = async (proveedorData: CreateProveedor): Promise<Proveedor> => {
  try {
    const response = await axios.post(`${API_URL}/proveedor`, proveedorData);
    return response.data;
  } catch (error: any) {
    console.error('Error al crear el proveedor:', error.response?.data?.message || error.message);

    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.message || 'Error al crear un proveedor');
    }

    throw new Error('Error inesperado al crear el proveedor');
  }
};

export const updateProveedor = async (id: number, proveedorData: Partial<Proveedor>): Promise<Proveedor> => {
  try {
    const response = await axios.patch(`${API_URL}/proveedor/${id}`, proveedorData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el proveedor con ID ${id}:`, error);
    throw error;
  }
};

export const getProveedorById = async (id: number): Promise<Proveedor> => {
  try {
    const response = await axios.get(`${API_URL}/proveedor/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el proveedor con ID ${id}:`, error);
    throw error;
  }
};

// src/Services/proveedorService.ts
export const updateDisponibilidadProveedor = async (id: number): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/proveedor/${id}`, { disponibilidad: "Fuera de Servicio" });
  } catch (error) {
    console.error(`Error al actualizar la disponibilidad del proveedor con ID ${id}:`, error);
    throw error;
  }
};
