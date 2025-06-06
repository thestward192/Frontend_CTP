import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getLicencias, createLicencia, updateLicencia, updateDisponibilidadLicencia } from '../Services/licenciaService';
import { CreateLicenciaDTO, Licencia } from '../types/licencia';

export const useLicencias = () => {
  const queryClient = useQueryClient();

  // Obtener todas las licencias
  const { data: licencias, isLoading: loading, error } = useQuery<Licencia[], Error>(
    'licencias',
    getLicencias
  );

  // Crear una nueva licencia
  const createMutation = useMutation((licencia: CreateLicenciaDTO) => createLicencia(licencia), {
    onSuccess: () => {
      queryClient.invalidateQueries('licencias');
    },
  });

  const updateMutation = useMutation(
    ({ id, licencia }: { id: number; licencia: Partial<Licencia> }) => updateLicencia(id, licencia),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('licencias');
      },
    }
  );
  
  const updateDisponibilidadLicenciaMutation = useMutation((id: number) => updateDisponibilidadLicencia(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('licencias');
    },
  });

  return {
    licencias,
    loading,
    error,
    updateLicencia: updateMutation.mutateAsync,
    addLicencia: createMutation.mutateAsync, 
    updateDisponibilidadLicenciaMutation
  };
};
