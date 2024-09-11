// src/hooks/useUbicacion.ts
import { useState, useEffect } from 'react';
import { createUbicacion, deleteUbicacion, getUbicacionById, getUbicaciones } from '../Services/ubicacionService';
import { Ubicacion } from '../types/ubicacion';

export const useUbicacion = () => {
  // Estado para el formulario de creación
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    pabellon: '',
  });

  // Estado para el listado de ubicaciones
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(null); // Estado para la ubicación seleccionada por ID
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar los cambios en los inputs del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para crear una nueva ubicación
  const handleSubmitUbicacion = async (): Promise<boolean> => {
    try {
      console.log('Enviando datos:', formData); // Agrega este log para verificar los datos
      await createUbicacion(formData);
      await fetchUbicaciones(); // Refrescar las ubicaciones tras la creación
      return true;
    } catch (error) {
      console.error('Error al agregar la ubicación:', error);
      setError('Error al agregar la ubicación');
      return false;
    }
  };
  
  

  // Función para obtener todas las ubicaciones (GET)
  const fetchUbicaciones = async () => {
    try {
      const data = await getUbicaciones(); // Llamada al servicio GET
      setUbicaciones(data); // Establecer las ubicaciones en el estado
    } catch (error) {
      console.error('Error al obtener ubicaciones:', error);
      setError('Error al obtener ubicaciones'); // Manejo de errores
    } finally {
      setLoading(false); // Finalizar estado de carga
    }
  };

  // Función para obtener detalles de una ubicación por ID
  const getUbicacionDetails = async (id: number) => {
    try {
      const data = await getUbicacionById(id); // Llamada al servicio para obtener detalles
      setSelectedUbicacion(data); // Establecer la ubicación seleccionada
    } catch (error) {
      console.error(`Error al obtener detalles de la ubicación con ID ${id}:`, error);
      setError(`Error al obtener detalles de la ubicación con ID ${id}`);
    }
  };

  // Función para eliminar una ubicación por ID
  const removeUbicacion = async (id: number) => {
    try {
      await deleteUbicacion(id); // Llamada al servicio DELETE
      setUbicaciones(ubicaciones.filter((ubicacion) => ubicacion.id !== id)); // Actualizar el estado filtrando la ubicación eliminada
    } catch (error) {
      console.error(`Error al eliminar la ubicación con ID ${id}:`, error);
      setError(`Error al eliminar la ubicación con ID ${id}`);
    }
  };

  // Efecto para cargar las ubicaciones al montar el componente
  useEffect(() => {
    fetchUbicaciones(); // Ejecutar al cargar
  }, []);

  return {
    formData,
    handleInputChange,
    handleSubmitUbicacion,
    ubicaciones,
    selectedUbicacion,
    getUbicacionDetails,
    removeUbicacion,
    loading,
    error,
  };
};
