import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getProveedores, createProveedor, getProveedorById, deleteProveedor, updateProveedor } from '../Services/proveedorService';
import { Proveedor } from '../types/proveedor';
import { useState } from 'react';

export const useProveedores = () => {
  const queryClient = useQueryClient();
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);

  // Obtener todos los proveedores usando useQuery
  const { data: proveedores, isLoading: loading, error } = useQuery<Proveedor[], Error>(
    'proveedores',
    getProveedores
  );

  // Crear un nuevo proveedor
  const mutation = useMutation(createProveedor, {
    onSuccess: () => {
      queryClient.invalidateQueries('proveedores');
    },
  });

  // Obtener detalles de un proveedor específico y seleccionarlo
  const getProveedorDetails = async (id: number) => {
    try {
      const data = await getProveedorById(id);
      setSelectedProveedor(data); // Establecer proveedor seleccionado
    } catch (error) {
      console.error(`Error al obtener detalles del proveedor con ID ${id}:`, error);
    }
  };

  // Editar un proveedor existente
  const editProveedorMutation = useMutation(
    ({ id, proveedorData }: { id: number; proveedorData: Partial<Proveedor> }) => updateProveedor(id, proveedorData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('proveedores');
      },
    }
  );

  // Eliminar un proveedor
  const deleteProveedorMutation = useMutation((id: number) => deleteProveedor(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('proveedores');
    },
  });

  return {
    proveedores,
    loading,
    error,
    selectedProveedor,
    getProveedorDetails,
    handleSubmitProveedor: mutation.mutateAsync,
    editProveedor: editProveedorMutation.mutateAsync,
    removeProveedor: deleteProveedorMutation.mutateAsync,
  };
};
