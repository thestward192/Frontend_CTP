import { useState, useEffect } from 'react';
import { getLeyes, createLey, getLeyById, deleteLey } from '../Services/leyService';
import { Ley } from '../types/ley';

export const useLeyes = () => {
  const [leyes, setLeyes] = useState<Ley[]>([]);
  const [selectedLey, setSelectedLey] = useState<Ley | null>(null); // Ley seleccionada
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  // Función para obtener todas las leyes
  const fetchLeyes = async () => {
    try {
      setError(null); // Limpiar cualquier error anterior
      setLoading(true); // Activar estado de carga
      const data = await getLeyes();
      setLeyes(data); // Almacenar las leyes obtenidas
    } catch (error) {
      setError('Error al obtener las leyes');
      console.error(error);
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  // Función para crear una nueva ley
  const handleSubmitLey = async (leyData: Omit<Ley, 'id'>): Promise<boolean> => {
    try {
      setError(null); // Limpiar cualquier error anterior
      const nuevaLey = await createLey(leyData); // Crear nueva ley
      setLeyes([...leyes, nuevaLey]); // Agregar la nueva ley al estado
      return true;
    } catch (error) {
      console.error('Error al crear la ley:', error);
      setError('Error al crear la ley');
      return false;
    }
  };

  // Función para obtener detalles de una ley por ID
  const getLeyDetails = async (id: number) => {
    try {
      setError(null); // Limpiar cualquier error anterior
      const data = await getLeyById(id);
      setSelectedLey(data); // Almacenar la ley seleccionada
    } catch (error) {
      setError(`Error al obtener detalles de la ley con ID ${id}`);
    }
  };

  // Función para eliminar una ley por ID
  const removeLey = async (id: number) => {
    try {
      setError(null); // Limpiar cualquier error anterior
      await deleteLey(id); // Eliminar ley del backend
      setLeyes(leyes.filter((ley) => ley.id !== id)); // Eliminar la ley del estado
    } catch (error) {
      setError(`Error al eliminar la ley con ID ${id}`);
    }
  };

  // useEffect para ejecutar al montar el componente
  useEffect(() => {
    fetchLeyes(); // Ejecutar la carga inicial de leyes
  }, []);

  return {
    leyes,           // Lista de todas las leyes
    loading,         // Estado de carga
    error,           // Estado de error
    handleSubmitLey, // Función para crear una nueva ley
    getLeyDetails,   // Función para obtener los detalles de una ley
    removeLey,       // Función para eliminar una ley
    selectedLey,     // Ley seleccionada
    fetchLeyes       // Añadimos fetchLeyes aquí
  };
};
