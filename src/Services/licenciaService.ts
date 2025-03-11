import axios from 'axios';
import { CreateLicenciaDTO, Licencia } from '../types/licencia';

const API_URL = 'https://backendcontrolactivos-2.onrender.com/licencia'; // Cambia la URL según tu backend

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

export const updateDisponibilidadLicencia = async (id: number): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/${id}`, { disponibilidad: "Fuera de Servicio" });
  } catch (error) {
    console.error(`Error al actualizar la disponibilidad de la licencia con ID ${id}:`, error);
    throw error;
  }
};



