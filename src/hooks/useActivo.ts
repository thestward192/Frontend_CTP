import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Activo } from '../types/activo';
import { createActivo, getActivos, updateActivo, deleteActivo, getActivosByUbicacion } from '../Services/activoService';

export const useActivos = () => {
  const queryClient = useQueryClient();
  const [activosFiltrados, setActivosFiltrados] = useState<Activo[]>([]);


  // Obtener todos los activos
  const { data: activos = [], isLoading: loading, error } = useQuery<Activo[], Error>(['activos'], getActivos);

  const fetchActivosByUbicacion = async (ubicacionId: number) => {
    try {
      const data = await getActivosByUbicacion(ubicacionId);
      setActivosFiltrados(data);  // Actualiza el estado local con los activos filtrados
    } catch (error) {
      console.error('Error al obtener activos por ubicación:', error);
      throw error;
    }
  };

  // Crear un nuevo activo
  const { mutate: handleCreateActivo, isLoading: creating, error: createError } = useMutation<
    Activo,
    Error,
    Omit<Activo, 'id'>
  >(
    (activoData: Omit<Activo, 'id'>) => createActivo(activoData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['activos']);
        queryClient.invalidateQueries(['activosByUbicacion']); // Invalida también los activos por ubicación
      },
    }
  );

  // Hook para obtener activos por ubicacion
  const useActivosByUbicacion = (ubicacionId: number) => {
    return useQuery<Activo[], Error>(
      ['activosByUbicacion', ubicacionId],
      () => getActivosByUbicacion(ubicacionId),
      {
        enabled: !!ubicacionId,
      }
    );
  };

  // Actualizar un activo existente (usando PATCH)
  const { mutate: handleUpdateActivo, isLoading: updating, error: updateError } = useMutation<
    Activo,
    Error,
    { id: number; data: Partial<Activo> }
  >(
    ({ id, data }) => updateActivo(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['activos']);  // Invalida la cache general de activos
        queryClient.invalidateQueries(['activosByUbicacion']);  // Invalida la cache de activos por ubicación
      },
    }
  );

  // Eliminar un activo existente
  const { mutate: handleDeleteActivo, isLoading: deleting, error: deleteError } = useMutation<
    void,
    Error,
    number
  >(
    (id) => deleteActivo(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['activos']);
        queryClient.invalidateQueries(['activosByUbicacion']);  // Invalida la cache de activos por ubicación
      },
    }
  );

  return {
    activos,
    activosFiltrados,
    loading,
    error: error || createError || updateError || deleteError,
    creating,
    updating,
    deleting,
    handleCreateActivo,
    handleUpdateActivo,
    handleDeleteActivo,
    useActivosByUbicacion,
  };
};
