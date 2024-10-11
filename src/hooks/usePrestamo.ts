import { useState } from 'react';
import { Prestamo } from '../types/prestamo';
import { createPrestamo, deletePrestamo, getPrestamosByUbicacion, getPrestamosByUsuario, updatePrestamoEstado } from '../Services/prestamoService';

export const usePrestamo = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrestamosByUbicacion = async (ubicacionId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPrestamosByUbicacion(ubicacionId);
      setPrestamos(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los préstamos');
    } finally {
      setLoading(false);
    }
  };

  const fetchPrestamosByUsuario = async (prestadoPorId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPrestamosByUsuario(prestadoPorId);
      setPrestamos(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los préstamos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrestamo = async (prestamoData: Omit<Prestamo, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newPrestamo = await createPrestamo(prestamoData);
      setPrestamos((prevPrestamos) => [...prevPrestamos, newPrestamo]);
    } catch (err: any) {
      setError(err.message || 'Error al crear el préstamo');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrestamoEstado = async (id: number, estado: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPrestamo = await updatePrestamoEstado(id, estado);
      setPrestamos((prevPrestamos) =>
        prevPrestamos.map((prestamo) => (prestamo.id === id ? updatedPrestamo : prestamo))
      );
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado del préstamo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrestamo = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deletePrestamo(id);
      setPrestamos((prevPrestamos) => prevPrestamos.filter((prestamo) => prestamo.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el préstamo');
    } finally {
      setLoading(false);
    }
  };

  return {
    prestamos,
    loading,
    error,
    fetchPrestamosByUbicacion,
    fetchPrestamosByUsuario,
    handleCreatePrestamo,
    handleUpdatePrestamoEstado,
    handleDeletePrestamo
  };
};