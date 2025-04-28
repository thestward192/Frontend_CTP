// src/hooks/useLicitaciones.ts
import { useState, useEffect } from 'react';
import { Licitacion, UpdateLicitacionDTO } from '../types/licitacion';
import { 
  getLicitaciones, 
  getLicitacionById, 
  createLicitacion, 
  updateLicitacion, 
  updateDisponibilidadLicitacion // Nuevo servicio
} from '../Services/licitacionService';

export const useLicitaciones = (disponibilidad?: string) => {
  const [licitaciones, setLicitaciones] = useState<Licitacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLicitacion, setSelectedLicitacion] = useState<Licitacion | null>(null);
  const [showCompletedMessage, setShowCompletedMessage] = useState(false); // Mensaje de éxito
  const [showErrorMessage, setShowErrorMessage] = useState(false); // Mensaje de error

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getLicitaciones(disponibilidad);
      setLicitaciones(data);
    } catch (err) {
      setError('Error al cargar las licitaciones.');
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [disponibilidad]);

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

  // Modificar la función de eliminación para cambiar a "Fuera de Servicio"
  const updateDisponibilidad = async (id: number) => {
    try {
      await updateDisponibilidadLicitacion(id, "Fuera de Servicio");
      setLicitaciones(
        licitaciones.map((l) =>
          l.id === id ? { ...l, disponibilidad: "Fuera de Servicio" } : l
        )
      );
      setShowCompletedMessage(true); // Mostrar mensaje de éxito
    } catch (error) {
      setError('Error al actualizar la disponibilidad.');
      setShowErrorMessage(true); // Mostrar mensaje de error
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
    updateDisponibilidad, // Cambiado de removeLicitacion a updateDisponibilidad
    showCompletedMessage,
    showErrorMessage,
  };
};
