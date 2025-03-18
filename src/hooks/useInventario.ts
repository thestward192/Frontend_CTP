// src/hooks/useInventario.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Inventario } from '../types/inventario';
import { getInventarios, createInventario, updateInventario, deleteInventario } from '../Services/inventarioService';

export const useInventario = () => {
  const queryClient = useQueryClient();

  const { data: inventarios = [], isLoading, error } = useQuery<Inventario[], Error>(
    'inventarios',
    getInventarios
  );

  const { mutate: createInventarioMutate, isLoading: creating } = useMutation<Inventario, Error, Inventario>(
    createInventario,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventarios');
      },
    }
  );

  const { mutate: updateInventarioMutate, isLoading: updating } = useMutation<
    Inventario,
    Error,
    { id: number; data: Inventario }
  >(
    ({ id, data }) => updateInventario(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventarios');
      },
    }
  );

  const { mutate: deleteInventarioMutate, isLoading: deleting } = useMutation<void, Error, number>(
    (id) => deleteInventario(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventarios');
      },
    }
  );

  return {
    inventarios,
    isLoading,
    error,
    createInventarioMutate,
    creating,
    updateInventarioMutate,
    updating,
    deleteInventarioMutate,
    deleting,
  };
};
