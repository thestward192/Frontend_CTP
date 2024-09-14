// src/hooks/useLeyes.ts
import { useState, useEffect } from 'react';
import { getLeyes, createLey, getLeyById, deleteLey } from '../Services/leyService';
import { Ley } from '../types/ley';

export const useLeyes = () => {
  const [leyes, setLeyes] = useState<Ley[]>([]);
  const [selectedLey, setSelectedLey] = useState<Ley | null>(null); // Estado para la ley seleccionada por ID
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todas las leyes
  const fetchLeyes = async () => {
    try {
      const data = await getLeyes();
      setLeyes(data);
    } catch (error) {
      setError('Error al obtener las leyes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear una nueva ley
  const handleSubmitLey = async (leyData: Omit<Ley, 'id'>): Promise<boolean> => {
    try {
      const nuevaLey = await createLey(leyData);
      setLeyes([...leyes, nuevaLey]);
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
      const data = await getLeyById(id);
      setSelectedLey(data); // Almacenar la ley seleccionada
    } catch (error) {
      setError(`Error al obtener detalles de la ley con ID ${id}`);
    }
  };

  // Función para eliminar una ley por ID
  const removeLey = async (id: number) => {
    try {
      await deleteLey(id);
      setLeyes(leyes.filter((ley) => ley.id !== id)); // Actualizar el estado eliminando la ley
    } catch (error) {
      setError(`Error al eliminar la ley con ID ${id}`);
    }
  };

  useEffect(() => {
    fetchLeyes(); // Ejecutar al montar el componente
  }, []);

  return {
    leyes,
    loading,
    error,
    handleSubmitLey,
    getLeyDetails,   // Para obtener los detalles de una ley
    removeLey,       // Para eliminar una ley
    selectedLey,     // Ley seleccionada
  };
};
