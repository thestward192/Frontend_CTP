// src/Services/userService.ts
import axios from 'axios';
import { User, CreateUserDTO } from '../types/user';

 const API_URL = 'https://backendcontrolactivos-2.onrender.com';

//const API_URL = 'http://localhost:3000';

// Obtener el token del localStorage
const getAuthToken = () => localStorage.getItem('token');

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw new Error('Error al obtener los usuarios');
  }
};

export const getUserById = async (id: number): Promise<User> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el usuario con ID ${id}:`, error);
    throw new Error(`Error al obtener el usuario con ID ${id}`);
  }
};

export const createUser = async (userData: CreateUserDTO): Promise<User> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/user`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.message || 'El email ya está en uso');
    }
    throw new Error('Error al crear el usuario');
  }
};

export const updateDisponibilidadUser = async (id: number, disponibilidad: string): Promise<void> => {
  try {
    const token = getAuthToken();
    await axios.patch(
      `${API_URL}/user/${id}`,
      { disponibilidad }, // Actualización parcial del campo de disponibilidad
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error(`Error al actualizar la disponibilidad del usuario con ID ${id}:`, error);
    throw new Error(`Error al actualizar la disponibilidad del usuario con ID ${id}`);
  }
};

export const updateUser = async (id: number, updatedData: Partial<User>): Promise<User> => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(`${API_URL}/user/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el usuario con ID ${id}:`, error);
    throw new Error(`Error al actualizar el usuario con ID ${id}`);
  }
};
