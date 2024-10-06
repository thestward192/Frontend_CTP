import axios from 'axios';

const API_URL = 'http://localhost:3000/prestamos'; // Asegúrate de que esta URL sea la correcta según tu backend

// Obtener el token JWT desde localStorage
const getToken = () => localStorage.getItem('token');

// Función para solicitar un préstamo
export const solicitarPrestamo = async (prestamoData) => {
  const token = getToken(); // Obtenemos el token
  const response = await axios.post(`${API_URL}/solicitar`, prestamoData, {
    headers: {
      Authorization: `Bearer ${token}`, // Añadimos el token en el encabezado
    },
  });
  return response.data;
};

// Función para obtener todas las solicitudes de préstamo (para el Administrador)
export const obtenerPrestamos = async () => {
  const token = getToken(); // Obtenemos el token
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`, // Añadimos el token en el encabezado
    },
  });
  return response.data;
};

// Función para aprobar un préstamo (solo Administrador)
export const aprobarPrestamo = async (prestamoId) => {
  const token = getToken(); // Obtenemos el token
  const response = await axios.patch(`${API_URL}/aprobar/${prestamoId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`, // Añadimos el token en el encabezado
    },
  });
  return response.data;
};
