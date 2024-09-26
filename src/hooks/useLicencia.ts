import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getLicencias, createLicencia, deleteLicencia } from '../Services/licenciaService';
import { Licencia } from '../types/licencia';

export const useLicencias = () => {
  const queryClient = useQueryClient();

  // Obtener todas las licencias
  const { data: licencias, isLoading: loading, error } = useQuery<Licencia[], Error>(
    'licencias',
    getLicencias
  );

  // Crear una nueva licencia
  const mutation = useMutation(createLicencia, {
    onSuccess: () => {
      // Invalida y refetch los datos después de una mutación exitosa
      queryClient.invalidateQueries('licencias');
    },
  });

  // const updateLicenciaMutation = useMutation(
  //   ({ id, licencia }: { id: number; licencia: UpdateLicenciaDTO }) => updateLicencia(id, licencia),
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries('licencias');
  //     },
  //   }
  // );

  // Eliminar una licencia
  const deleteMutation = useMutation(deleteLicencia, {
    onSuccess: () => {
      // Invalida y refetch los datos después de una eliminación exitosa
      queryClient.invalidateQueries('licencias');
    },
  });

  return {
    licencias,
    loading,
    error,
    addLicencia: mutation.mutateAsync,
    removeLicencia: deleteMutation.mutateAsync
  };
};
