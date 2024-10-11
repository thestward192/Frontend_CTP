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
    Error,  // Asegúrate de que el error sea de tipo `Error`
    Omit<Activo, 'id'>
  >(
    (activoData: Omit<Activo, 'id'>) => createActivo(activoData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['activos']);  // Invalida la cache para actualizar la lista
      },
    }
  );

  const useActivosByUbicacion = (ubicacionId: number) => {
    return useQuery<Activo[], Error>(
      ['activosByUbicacion', ubicacionId], // La query se identifica por ubicación
      () => getActivosByUbicacion(ubicacionId), // Función que obtiene los activos por ubicación
      {
        enabled: !!ubicacionId, // Solo se ejecuta si el ubicacionId es válido
      }
    );
  };

  // Actualizar un activo existente (usando PATCH)
  const { mutate: handleUpdateActivo, isLoading: updating, error: updateError } = useMutation<
    Activo,
    Error,
    { id: number; data: Partial<Activo> }  // Recibe un objeto con id y data parcial para actualizar
  >(
    ({ id, data }) => updateActivo(id, data),  // Llamada al servicio de actualización
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['activos']);  // Invalida la cache para actualizar la lista
      },
    }
  );



  // Eliminar un activo existente
  const { mutate: handleDeleteActivo, isLoading: deleting, error: deleteError } = useMutation<
    void,  // No retorna un valor
    Error,
    number  // Eliminar recibe solo el ID del activo a eliminar
  >(
    (id) => deleteActivo(id),  // Llamada al servicio de eliminación
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['activos']);  // Invalida la cache para actualizar la lista
      },
    }
  );

  return {
    activos,
    loading,
    error: error || createError || updateError || deleteError,  // Manejo de errores unificado
    creating,
    updating,
    deleting,
    handleCreateActivo,  // Función para crear activos
    handleUpdateActivo,  // Función para actualizar activos
    handleDeleteActivo,
    useActivosByUbicacion  // Función para eliminar activos
  };
};
