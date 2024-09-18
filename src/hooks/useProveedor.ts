import { useState, useEffect } from 'react';
import { getProveedores, createProveedor, getProveedorById, deleteProveedor } from '../Services/proveedorService'; // Servicios de proveedor
import { Proveedor } from '../types/proveedor'; // Tipo Proveedor

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null); // Proveedor seleccionado
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todos los proveedores
  const fetchProveedores = async () => {
    try {
      const data = await getProveedores();
      setProveedores(data);
    } catch (error) {
      setError('Error al obtener los proveedores');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un nuevo proveedor
  const handleSubmitProveedor = async (proveedorData: Omit<Proveedor, 'id'>): Promise<boolean> => {
    try {
      const nuevoProveedor = await createProveedor(proveedorData);
      setProveedores([...proveedores, nuevoProveedor]);
      return true;
    } catch (error) {
      console.error('Error al crear el proveedor:', error);
      setError('Error al crear el proveedor');
      return false;
    }
  };

  // Función para obtener detalles de un proveedor por ID
  const getProveedorDetails = async (id: number) => {
    try {
      const data = await getProveedorById(id);
      setSelectedProveedor(data); // Almacenar el proveedor seleccionado
    } catch (error) {
      setError(`Error al obtener detalles del proveedor con ID ${id}`);
    }
  };

  // Función para eliminar un proveedor por ID
  const removeProveedor = async (id: number) => {
    try {
      await deleteProveedor(id);
      setProveedores(proveedores.filter((proveedor) => proveedor.id !== id)); // Actualizar el estado eliminando el proveedor
    } catch (error) {
      setError(`Error al eliminar el proveedor con ID ${id}`);
    }
  };

  useEffect(() => {
    fetchProveedores(); // Ejecutar al montar el componente
  }, []);

  return {
    proveedores,
    loading,
    error,
    fetchProveedores, // Retorna la función para que esté disponible fuera
    handleSubmitProveedor,
    getProveedorDetails,
    removeProveedor,
    selectedProveedor,
  };
};
