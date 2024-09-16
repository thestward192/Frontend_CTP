import { useState, useEffect } from 'react';
import { Licitacion } from '../types/licitacion';
import { getLicitaciones, getLicitacionById, createLicitacion, updateLicitacion, deleteLicitacion, } from '../Services/licitacionService';

// Hook personalizado para manejar licitaciones
export const useLicitaciones = () => {
    const [licitaciones, setLicitaciones] = useState<Licitacion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar todas las licitaciones al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getLicitaciones();
                setLicitaciones(data);
                console.log(data)
            } catch (error) {
                setError('Error al cargar las licitaciones.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Función para obtener una licitación por ID
    const fetchLicitacionById = async (id: number) => {
        try {
            const data = await getLicitacionById(id);
            return data;
        } catch (error) {
            setError('Error al cargar la licitación.');
        }
    };

    // Función para crear una nueva licitación
    const addLicitacion = async (licitacion: Licitacion) => {
        try {
            const newLicitacion = await createLicitacion(licitacion);
            setLicitaciones([...licitaciones, newLicitacion]);
        } catch (error) {
            setError('Error al crear la licitación.');
        }
    };

    // Función para actualizar una licitación
    const editLicitacion = async (id: number, licitacion: Licitacion) => {
        try {
            const updatedLicitacion = await updateLicitacion(id, licitacion);
            setLicitaciones(licitaciones.map((l) => (l.id === id ? updatedLicitacion : l)));
        } catch (error) {
            setError('Error al actualizar la licitación.');
        }
    };

    // Función para eliminar una licitación
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
        fetchLicitacionById,
        addLicitacion,
        editLicitacion,
        removeLicitacion,
    };
};
