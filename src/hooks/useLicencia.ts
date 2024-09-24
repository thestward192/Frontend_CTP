import { useState, useEffect } from 'react';
import { Licencia } from '../types/licencia';
import { getLicencias, createLicencia, deleteLicencia } from '../Services/licenciaService';

export const useLicencias = () => {
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener todas las licencias al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLicencias();
        setLicencias(data);
      } catch (error) {
        setError('Error al cargar las licencias.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Crear una nueva licencia
  const addLicencia = async (licencia: Licencia) => {
    try {
      const newLicencia = await createLicencia(licencia);
      setLicencias([...licencias, newLicencia]);
    } catch (error) {
      setError('Error al crear la licencia.');
    }
  };

  // Eliminar una licencia
  const removeLicencia = async (codigoLicencia: string) => {
    try {
      await deleteLicencia(codigoLicencia);
      setLicencias(licencias.filter(l => l.codigoLicencia !== codigoLicencia));
    } catch (error) {
      setError('Error al eliminar la licencia.');
    }
  };

  return {
    licencias,
    loading,
    error,
    addLicencia,
    removeLicencia,
  };
};
