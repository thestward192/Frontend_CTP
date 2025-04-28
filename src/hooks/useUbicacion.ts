import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useState } from 'react';
import { createUbicacion, getUbicaciones, updateUbicacion, getUbicacionById, updateDisponibilidadUbicacion } from '../Services/ubicacionService';
import { Ubicacion } from '../types/ubicacion';

export const useUbicacion = (disponibilidad?: string) => {
  const queryClient = useQueryClient();
  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(null); // ✅ Estado para almacenar la ubicación seleccionada

  // Fetch all ubicaciones
  const { data: ubicaciones = [], isLoading: loading, error } = useQuery<Ubicacion[], Error>(
    ['ubicaciones', disponibilidad],
    () => getUbicaciones(disponibilidad),
  );

  // Crear una nueva ubicación usando useMutation
  const {
    mutate: handleSubmitUbicacion,
    isLoading,
    isError,
  } = useMutation(createUbicacion, {
    onSuccess: (data) => {
      queryClient.setQueryData<Ubicacion[]>('ubicaciones', (old) => [...(old || []), data]);
      queryClient.invalidateQueries('ubicaciones');
    },
    onError: (error) => {
      console.error('Error al agregar la ubicación:', error);
    },
  });

  const updateDisponibilidadMutation = useMutation(updateDisponibilidadUbicacion, {
    onSuccess: () => {
      queryClient.invalidateQueries('ubicaciones');
    },
    onError: (error) => {
      console.error('Error al actualizar disponibilidad:', error);
    },
  });

  // Función para editar una ubicación
  const editUbicacion = async (id: number, ubicacionData: Partial<Ubicacion>) => {
    try {
      const updatedUbicacion = await updateUbicacion(id, ubicacionData);
      queryClient.invalidateQueries('ubicaciones');
      return updatedUbicacion;
    } catch (error) {
      console.error(`Error al actualizar la ubicación con ID ${id}:`, error);
      throw error;
    }
  };

  // Obtener detalles de una ubicación por ID y almacenarlos en el estado
  const getUbicacionDetails = async (id: number) => {
    try {
      const ubicacion = await getUbicacionById(id);
      setSelectedUbicacion(ubicacion); // ✅ Guardamos la ubicación seleccionada en el estado
      return ubicacion;
    } catch (error) {
      console.error(`Error al obtener detalles de la ubicación con ID ${id}:`, error);
      throw error;
    }
  };

  return {
    ubicaciones,
    loading,
    error,
    selectedUbicacion, // ✅ Ahora tenemos acceso a la ubicación seleccionada
    updateDisponibilidad: updateDisponibilidadMutation.mutateAsync,
    editUbicacion,
    getUbicacionDetails,
    handleSubmitUbicacion,
    isLoading,
    isError,
  };
};
