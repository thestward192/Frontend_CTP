import { useState, useEffect } from 'react';
import { Activo } from '../types/activo';
import { createActivo, deleteActivo, getActivoById, getActivos, updateActivo } from '../Services/activoService';

export const useActivos = () => {
  const [activos, setActivos] = useState<Activo[]>([]);
  const [selectedActivo, setSelectedActivo] = useState<Activo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los activos
  const fetchActivos = async () => {
    try {
      setLoading(true);
      const data = await getActivos();
      setActivos(data);
    } catch (error) {
      console.error('Error al obtener los activos:', error);  // Mostramos el error en consola
      setError('Error al obtener los activos');
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo activo
  const handleCreateActivo = async (activoData: Omit<Activo, 'id'>) => {
    try {
      setError(null);
      const newActivo = await createActivo(activoData);
      setActivos([...activos, newActivo]);
    } catch (error) {
      console.error('Error al crear el activo:', error);  // Mostramos el error en consola
      setError('Error al crear el activo');
    }
  };

  // Actualizar un activo existente
  const handleUpdateActivo = async (id: number, updatedData: Partial<Activo>) => {
    try {
      setError(null);
      const updatedActivo = await updateActivo(id, updatedData);
      setActivos(activos.map(activo => (activo.id === id ? updatedActivo : activo)));
    } catch (error) {
      console.error('Error al actualizar el activo:', error);  // Mostramos el error en consola
      setError('Error al actualizar el activo');
    }
  };

  // Obtener detalles de un activo por ID
  const getActivoDetails = async (id: number) => {
    try {
      const data = await getActivoById(id);
      setSelectedActivo(data);
    } catch (error) {
      console.error('Error al obtener detalles del activo:', error);  // Mostramos el error en consola
      setError('Error al obtener detalles del activo');
    }
  };

  // Eliminar un activo
  const handleDeleteActivo = async (id: number) => {
    try {
      await deleteActivo(id);
      setActivos(activos.filter((activo) => activo.id !== id));
    } catch (error) {
      console.error('Error al eliminar el activo:', error);  // Mostramos el error en consola
      setError('Error al eliminar el activo');
    }
  };

  useEffect(() => {
    fetchActivos();
  }, []);

  return {
    activos,
    selectedActivo,
    loading,
    error,
    handleCreateActivo,
    handleUpdateActivo,
    getActivoDetails,
    handleDeleteActivo,
  };
};
