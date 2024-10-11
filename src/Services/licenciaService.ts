import axios from 'axios';
import { CreateLicenciaDTO, Licencia } from '../types/licencia';

const API_URL = 'http://localhost:3000/licencia'; // Cambia la URL según tu backend

// Obtener todas las licencias
export const getLicencias = async (): Promise<Licencia[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createLicencia = async (licencia: CreateLicenciaDTO): Promise<void> => {
  await axios.post(API_URL, licencia);
};

export const updateLicencia = async (id: number, licencia: Partial<Licencia>): Promise<Licencia> => {
  const response = await axios.patch(`${API_URL}/${id}`, licencia);
  return response.data;
};

// Eliminar una licencia por su código
export const deleteLicencia = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
