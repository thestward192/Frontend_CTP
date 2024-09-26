import axios from 'axios';
import { Licencia } from '../types/licencia';

const API_URL = 'http://localhost:3000/licencia'; // Cambia la URL según tu backend

// Obtener todas las licencias
export const getLicencias = async (): Promise<Licencia[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Crear una nueva licencia
export const createLicencia = async (licencia: Licencia): Promise<Licencia> => {
  const response = await axios.post(API_URL, licencia);
  return response.data;
};

export const updateLicencia = async (id: number, licencia: Partial<Licencia>): Promise<Licencia> => {
  const response = await axios.patch(`${API_URL}/${id}`, licencia);
  return response.data;
};

// Eliminar una licencia por su código
export const deleteLicencia = async (codigoLicencia: string): Promise<void> => {
  await axios.delete(`${API_URL}/${codigoLicencia}`);
};
