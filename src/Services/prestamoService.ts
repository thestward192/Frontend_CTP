import axios from 'axios';

const API_URL = 'http://localhost:3000/prestamos'; // Asegúrate de que esta URL sea la correcta según tu backend

// Función para solicitar un préstamo
export const solicitarPrestamo = async (prestamoData) => {
  const response = await axios.post(`${API_URL}/solicitar`, prestamoData);
  return response.data;
};

// Función para obtener todas las solicitudes de préstamo (para el Administrador)
export const obtenerPrestamos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Función para aprobar un préstamo (solo Administrador)
export const aprobarPrestamo = async (prestamoId) => {
  const response = await axios.patch(`${API_URL}/aprobar/${prestamoId}`);
  return response.data;
};
