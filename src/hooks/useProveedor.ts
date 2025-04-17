import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getProveedores, createProveedor, getProveedorById, updateProveedor, updateDisponibilidadProveedor } from '../Services/proveedorService';
import { CreateProveedor, Proveedor } from '../types/proveedor';
import { useState } from 'react';

export const useProveedores = (disponibilidad?: string) => {
  const queryClient = useQueryClient();
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);

  // Obtener todos los proveedores usando useQuery
  const { data: proveedores, isLoading: loading, error } = useQuery<Proveedor[], Error>(
    {
      queryKey: ['proveedores', disponibilidad],
      queryFn: () => getProveedores(disponibilidad),
    }
  );

const handleSubmitProveedor = useMutation(
    async (proveedorData: CreateProveedor) => await createProveedor(proveedorData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('proveedores');
      },
      onError: (error: any) => {
        throw error; // Dejamos que el error sea manejado en el componente
      },
    }
  );


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

  const updateDisponibilidadProveedorMutation = useMutation((id: number) => updateDisponibilidadProveedor(id), {
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
    handleSubmitProveedor,
    editProveedor: editProveedorMutation.mutateAsync,
    updateDisponibilidadProveedorMutation,
  };
};
