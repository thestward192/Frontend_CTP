import { useState, useEffect } from 'react';
import { User, CreateUserDTO } from '../types/user';
import { createUser, getAllUsers, deleteUser } from '../Services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
        setLoading(false);
      } catch {
        setError('Error al obtener los usuarios');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const addUser = async (userData: CreateUserDTO) => {
    try {
      const newUser = await createUser(userData);
      setUsers([...users, newUser]);
    } catch {
      setError('Error al crear el usuario');
    }
  };

  const removeUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch {
      setError('Error al eliminar el usuario');
    }
  };

  return { users, loading, error, addUser, removeUser };
};
