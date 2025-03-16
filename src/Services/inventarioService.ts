// src/Services/inventarioService.ts
import api from './api';
import { Inventario } from '../types/inventario';

export const getInventarios = async (): Promise<Inventario[]> => {
  try {
    const response = await api.get('/inventario');
    return response.data;
  } catch (error) {
    console.error('Error al obtener inventarios:', error);
    throw error;
  }
};

export const createInventario = async (inventarioData: Inventario): Promise<Inventario> => {
  try {
    const response = await api.post('/inventario', inventarioData);
    return response.data;
  } catch (error) {
    console.error('Error al crear inventario:', error);
    throw error;
  }
};
