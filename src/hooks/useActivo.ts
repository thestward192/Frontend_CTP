import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Activo } from '../types/activo';
import { createActivo, getActivos, updateActivo, deleteActivo, getActivosByUbicacion } from '../Services/activoService';

export const useActivos = () => {
  const queryClient = useQueryClient();

  // Obtener todos los activos
  const { data: activos = [], isLoading: loading, error } = useQuery<Activo[], Error>(['activos'], getActivos);

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

  // Hook para obtener activos por ubicación
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
