  import { useMutation, useQuery, useQueryClient } from 'react-query';
  import { useState } from 'react';
  import { createUbicacion, deleteUbicacion, getUbicaciones, updateUbicacion, getUbicacionById } from '../Services/ubicacionService';
  import { Ubicacion } from '../types/ubicacion';

  export const useUbicacion = () => {
    const queryClient = useQueryClient();

    // Estado para el formulario de creación
    const [formData, setFormData] = useState({
      nombre: '',
      descripcion: '',
      pabellon: '',
    });

    // Fetch all ubicaciones
    const { data: ubicaciones = [], isLoading: loading, error } = useQuery('ubicaciones', getUbicaciones);

  

    // Crear una nueva ubicación usando useMutation
    const {
      mutate: handleSubmitUbicacion,
      isLoading,
      isError,
    } = useMutation(createUbicacion, {
      onSuccess: (data) => {
        queryClient.setQueryData<Ubicacion[]>('ubicaciones', (old) => [...(old || []), data]);
        queryClient.invalidateQueries('ubicaciones');
      },
      onError: (error) => {
        console.error('Error al agregar la ubicación:', error);
      },
    });

    // Eliminar una ubicación usando useMutation
    const { mutate: removeUbicacion, isLoading: isDeleting, isError: isDeleteError } = useMutation(deleteUbicacion, {
      onSuccess: () => {
        queryClient.invalidateQueries('ubicaciones'); // Invalida la cache y refetch ubicaciones
      },
      onError: (error) => {
        console.error('Error al eliminar la ubicación:', error);
      },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    // Función para editar una ubicación
    const editUbicacion = async (id: number, ubicacionData: Partial<Ubicacion>) => {
      try {
        const updatedUbicacion = await updateUbicacion(id, ubicacionData);
        queryClient.invalidateQueries('ubicaciones'); // Refrescar las ubicaciones tras la edición
        return updatedUbicacion;
      } catch (error) {
        console.error(`Error al actualizar la ubicación con ID ${id}:`, error);
        throw error;
      }
    };

    // Obtener detalles de una ubicación por ID
    const getUbicacionDetails = async (id: number) => {
      try {
        return await getUbicacionById(id);
      } catch (error) {
        console.error(`Error al obtener detalles de la ubicación con ID ${id}:`, error);
        throw error;
      }
    };

    return {
      formData,
      handleInputChange,
      handleSubmitUbicacion,
      isLoading,  // Ahora se incluye isLoading en el retorno
      isError,    // También incluimos isError
      ubicaciones,
      loading,
      error,
      removeUbicacion,
      isDeleting,
      isDeleteError,
      editUbicacion,
      getUbicacionDetails,
      
    };
  };
