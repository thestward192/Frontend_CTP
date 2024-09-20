// src/hooks/useRoles.ts
import { useState, useEffect } from 'react';
import { Rol } from '../types/rol';
import { getRoles } from '../Services/rolService.ts';

export const useRoles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
        setLoading(false);
      } catch {
        setError('Error al obtener los roles');
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { roles, loading, error };
};
