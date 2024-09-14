// src/services/ProveedorService.ts
import axios from 'axios';
import { CreateProveedor, Proveedor } from '../types/proveedor'; // Asegúrate de que la ruta sea correcta

const API_URL = 'http://localhost:3000'; // Cambia esto según la URL de tu API

export const getProveedores = async (): Promise<Proveedor[]> => {
  try {
    const response = await axios.get(`${API_URL}/proveedor`); // Ajusta la ruta de tu backend
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
  } catch (error) {
    console.error('Error al crear el proveedor:', error);
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

// Eliminar proveedor por ID
export const deleteProveedor = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/proveedor/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el proveedor con ID ${id}:`, error);
    throw error;
  }
};