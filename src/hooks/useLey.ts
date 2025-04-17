import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getLeyes, createLey, getLeyById, updateLey, updateDisponibilidadLey } from '../Services/leyService';
import { Ley } from '../types/ley';
import { useState } from 'react';

export const useLeyes = (disponibilidad?: string) => {
  const queryClient = useQueryClient();
  const [selectedLey, setSelectedLey] = useState<Ley | null>(null);
  
  // Obtener todas las leyes usando useQuery
  const { data: leyes, isLoading: loading, error } = useQuery<Ley[], Error>(
   {
      queryKey: ['leyes', disponibilidad],
      queryFn: () => getLeyes(disponibilidad),
      
   }
  );

  // Crear una nueva ley
  const createLeyMutation = useMutation(createLey, {
    onSuccess: () => {
      queryClient.invalidateQueries('leyes');
    },
  });

  // Obtener detalles de una ley específica y establecerla como seleccionada
  const getLeyDetails = async (id: number) => {
    try {
      const data = await getLeyById(id);
      setSelectedLey(data); // Establecer ley seleccionada
    } catch (error) {
      console.error(`Error al obtener detalles de la ley con ID ${id}:`, error);
    }
  };

  // Editar una ley existente
  const editLeyMutation = useMutation(
    ({ id, leyData }: { id: number; leyData: Partial<Ley> }) => updateLey(id, leyData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('leyes');
      },
    }
  );

  // Eliminar una ley
  const updateDisponibilidadLeyMutation = useMutation((id: number) => updateDisponibilidadLey(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('leyes');
    },
  });
  
  return {
    leyes,
    loading,
    error,
    selectedLey,
    getLeyDetails,
    createLey: createLeyMutation.mutateAsync,
    editLey: editLeyMutation.mutateAsync,
    updateDisponibilidadLeyMutation
  };
};
