import { useQuery, useMutation, useQueryClient } from 'react-query';
import { aprobarPrestamo, obtenerPrestamos, solicitarPrestamo } from '../Services/prestamoService';

export const usePrestamo = () => {
  const queryClient = useQueryClient();

  // Obtener todos los préstamos
  const obtenerPrestamosQuery = useQuery('prestamos', obtenerPrestamos, {
    onError: (error) => {
      console.error('Error al obtener los préstamos:', error);
    },
  });

  // Solicitar un préstamo
  const solicitarPrestamoMutation = useMutation(solicitarPrestamo, {
    onSuccess: () => {
      // Refresca la lista de préstamos después de hacer una solicitud
      queryClient.invalidateQueries('prestamos');
    },
    onError: (error) => {
      console.error('Error al solicitar el préstamo:', error);
    },
  });

  // Aprobar un préstamo
  const aprobarPrestamoMutation = useMutation(aprobarPrestamo, {
    onSuccess: () => {
      // Refresca la lista de préstamos después de aprobar uno
      queryClient.invalidateQueries('prestamos');
    },
    onError: (error) => {
      console.error('Error al aprobar el préstamo:', error);
    },
  });

  return {
    obtenerPrestamos: obtenerPrestamosQuery.data,
    isLoadingObtenerPrestamos: obtenerPrestamosQuery.isLoading,
    isErrorObtenerPrestamos: obtenerPrestamosQuery.isError,
    errorObtenerPrestamos: obtenerPrestamosQuery.error,

    solicitarPrestamo: solicitarPrestamoMutation.mutate,
    isLoadingSolicitarPrestamo: solicitarPrestamoMutation.isLoading,
    isErrorSolicitarPrestamo: solicitarPrestamoMutation.isError,
    isSuccessSolicitarPrestamo: solicitarPrestamoMutation.isSuccess,
    errorSolicitarPrestamo: solicitarPrestamoMutation.error,

    aprobarPrestamo: aprobarPrestamoMutation.mutate,
    isLoadingAprobarPrestamo: aprobarPrestamoMutation.isLoading,
    isErrorAprobarPrestamo: aprobarPrestamoMutation.isError,
    isSuccessAprobarPrestamo: aprobarPrestamoMutation.isSuccess,
    errorAprobarPrestamo: aprobarPrestamoMutation.error,
  };
};
