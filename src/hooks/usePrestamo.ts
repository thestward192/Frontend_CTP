import { useEffect, useState } from 'react';
import { Prestamo } from '../types/prestamo';
import { createPrestamo, deletePrestamo, getAllPrestamos, getPrestamosByActivo, getPrestamosByUbicacion, getPrestamosByUsuario, updatePrestamoEstado } from '../Services/prestamoService';
import { getUserById } from '../Services/userService';
import { getUbicacionById } from '../Services/ubicacionService';

export const usePrestamo = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


   // Función para obtener todos los préstamos
   const fetchAllPrestamos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPrestamos();  // Llamada al servicio que obtiene los préstamos
      const prestamosConPlaca = data.map((prestamo) => ({
        ...prestamo,
        numPlaca: prestamo.activo?.numPlaca || 'Sin placa',
      }));
      setPrestamos(prestamosConPlaca);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los préstamos');
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar los préstamos cuando se monta el componente
  useEffect(() => {
    fetchAllPrestamos();
  }, []);

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

  const fetchPrestamosByActivo = async (activoId: number) => {
    setLoading(true);
    setError(null);
    try {
      // Obtener los préstamos por activo
      const data = await getPrestamosByActivo(activoId);

      // Para cada préstamo, obtener los nombres de prestado por, prestado a y las ubicaciones
      const prestamosConNombresYUbicaciones = await Promise.all(
        data.map(async (prestamo) => {
          // Validar que prestadoPorId y prestadoAId no son undefined
          let prestadoPorNombre = 'Desconocido';
          let prestadoANombre = 'Desconocido';

          if (prestamo.prestadoPorId) {
            try {
              const prestadoPor = await getUserById(prestamo.prestadoPorId);
              prestadoPorNombre = `${prestadoPor.nombre} ${prestadoPor.apellido_1}`;
            } catch (error) {
              console.error(`Error al obtener el usuario con ID ${prestamo.prestadoPorId}: ${error}`);
            }
          }

          if (prestamo.prestadoAId) {
            try {
              const prestadoA = await getUserById(prestamo.prestadoAId);
              prestadoANombre = `${prestadoA.nombre} ${prestadoA.apellido_1}`;
            } catch (error) {
              console.error(`Error al obtener el usuario con ID ${prestamo.prestadoAId}: ${error}`);
            }
          }

          let ubicacionNombre = 'Desconocida';
          let ubicacionActualNombre = 'Desconocida';

          if (prestamo.ubicacionId) {
            try {
              const ubicacion = await getUbicacionById(prestamo.ubicacionId);
              ubicacionNombre = ubicacion.nombre;
            } catch (error) {
              console.error(`Error al obtener la ubicación con ID ${prestamo.ubicacionId}: ${error}`);
            }
          }

          if (prestamo.ubicacionActualId) {
            try {
              const ubicacionActual = await getUbicacionById(prestamo.ubicacionActualId);
              ubicacionActualNombre = ubicacionActual.nombre;
            } catch (error) {
              console.error(`Error al obtener la ubicación con ID ${prestamo.ubicacionActualId}: ${error}`);
            }
          }

          return {
            ...prestamo,
            prestadoPorNombre,
            prestadoANombre,
            ubicacionNombre,
            ubicacionActualNombre,
          };
        })
      );

      setPrestamos(prestamosConNombresYUbicaciones);
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
    fetchAllPrestamos,
    fetchPrestamosByUbicacion,
    fetchPrestamosByUsuario,
    fetchPrestamosByActivo,
    handleCreatePrestamo,
    handleUpdatePrestamoEstado,
    handleDeletePrestamo
  };
};