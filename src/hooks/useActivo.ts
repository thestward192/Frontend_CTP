import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Activo } from '../types/activo';
import { createActivo, getActivos, updateActivo, getActivosByUbicacion, updateDisponibilidadActivo } from '../Services/activoService';
import { useState } from 'react';

export const useActivos = () => {

  const queryClient = useQueryClient();

  const [disponibilidad, setDisponibilidad] = useState<string>();

  // Luego en tu hook/useQuery:
  const { data: activos = [], isLoading: loading, error } =
    useQuery<Activo[], Error>(
      ['activos', disponibilidad],
      () => getActivos(disponibilidad),
    );
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

  const updateDisponibilidadActivoMutation = useMutation(
    (id: number) => updateDisponibilidadActivo(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('activos');
        queryClient.invalidateQueries('activosByUbicacion');
      },
    }
  );

  return {
    activos,
    loading,
    error: error || createError || updateError,
    creating,
    updating,
    handleCreateActivo,
    handleUpdateActivo,
    updateDisponibilidadActivoMutation,
    useActivosByUbicacion,
  };
};
