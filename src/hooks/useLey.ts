import { useState, useEffect } from 'react';
import { getLeyes, createLey, getLeyById, deleteLey } from '../services/LeyService';
import { Ley } from '../types/ley';

export const useLeyes = () => {
  const [leyes, setLeyes] = useState<Ley[]>([]);
  const [selectedLey, setSelectedLey] = useState<Ley | null>(null); // Estado para la ley seleccionada por ID
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todas las leyes
  const fetchLeyes = async () => {
    try {
      setLoading(true); // Activar el estado de carga
      const data = await getLeyes();
      setLeyes(data);
      setError(null); // Limpiar error si tiene éxito
    } catch (error) {
      setError('Error al obtener las leyes');
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  // Función para crear una nueva ley
  const handleSubmitLey = async (leyData: Omit<Ley, 'id'>): Promise<boolean> => {
    try {
      setLoading(true); // Activar el estado de carga
      const nuevaLey = await createLey(leyData);
      setLeyes([...leyes, nuevaLey]);
      setError(null); // Limpiar error si tiene éxito
      return true;
    } catch (error) {
      setError('Error al crear la ley');
      return false;
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  // Función para obtener detalles de una ley por ID
  const getLeyDetails = async (id: number) => {
    try {
      setLoading(true); // Activar el estado de carga
      const data = await getLeyById(id);
      setSelectedLey(data); // Almacenar la ley seleccionada
      setError(null); // Limpiar error si tiene éxito
    } catch (error) {
      setError(`Error al obtener detalles de la ley con ID ${id}`);
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  // Función para eliminar una ley por ID
  const removeLey = async (id: number) => {
    try {
      setLoading(true); // Activar el estado de carga
      await deleteLey(id);
      setLeyes(leyes.filter((ley) => ley.id !== id)); // Actualizar el estado eliminando la ley
      setError(null); // Limpiar error si tiene éxito
    } catch (error) {
      setError(`Error al eliminar la ley con ID ${id}`);
    } finally {
      setLoading(false); // Desactivar el estado de carga
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
