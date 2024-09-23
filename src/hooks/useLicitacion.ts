// src/hooks/useLicitaciones.ts
import { useState, useEffect } from 'react';
import { Licitacion, UpdateLicitacionDTO } from '../types/licitacion';
import { getLicitaciones, getLicitacionById, createLicitacion, updateLicitacion, deleteLicitacion } from '../Services/licitacionService';

export const useLicitaciones = () => {
  const [licitaciones, setLicitaciones] = useState<Licitacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLicitacion, setSelectedLicitacion] = useState<Licitacion | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLicitaciones();
        setLicitaciones(data);
      } catch (error) {
        setError('Error al cargar las licitaciones.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchLicitacionById = async (id: number) => {
    try {
      const data = await getLicitacionById(id);
      setSelectedLicitacion(data);
    } catch (error) {
      setError('Error al cargar la licitación.');
    }
  };

  const addLicitacion = async (licitacion: Licitacion) => {
    try {
      const newLicitacion = await createLicitacion(licitacion);
      setLicitaciones([...licitaciones, newLicitacion]);
    } catch (error) {
      setError('Error al crear la licitación.');
    }
  };

  const editLicitacion = async (id: number, licitacionData: UpdateLicitacionDTO) => {
    try {
        const updatedLicitacion = await updateLicitacion(id, licitacionData);
        setLicitaciones(licitaciones.map((l) => (l.id === id ? updatedLicitacion : l)));
        setSelectedLicitacion(updatedLicitacion); // actualizar la licitación seleccionada
    } catch (error) {
        console.error('Error al actualizar la licitación:', error);
        setError('Error al actualizar la licitación.');
    }
};

  const removeLicitacion = async (id: number) => {
    try {
      await deleteLicitacion(id);
      setLicitaciones(licitaciones.filter((l) => l.id !== id));
    } catch (error) {
      setError('Error al eliminar la licitación.');
    }
  };

  return {
    licitaciones,
    loading,
    error,
    selectedLicitacion,
    fetchLicitacionById,
    addLicitacion,
    editLicitacion,
    removeLicitacion,
  };
};
