// src/hooks/useInventario.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Inventario } from '../types/inventario';
import { getInventarios, createInventario } from '../Services/inventarioService';

export const useInventario = () => {
  const queryClient = useQueryClient();

  // Query para obtener el historial de inventarios
  const { data: inventarios = [], isLoading } = useQuery<Inventario[], Error>(
    'inventarios',
    getInventarios
  );

  // Mutación para crear un inventario
  const { mutate: createInventarioMutate, isLoading: creating } = useMutation<Inventario, Error, Inventario>(
    createInventario,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventarios');
      },
    }
  );

  return { inventarios, isLoading, createInventarioMutate, creating };
};
