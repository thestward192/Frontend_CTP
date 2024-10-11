// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { User, CreateUserDTO } from '../types/user';
import { createUser, getAllUsers, deleteUser, updateUser } from '../Services/userService';

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Obtener todos los usuarios usando useQuery
  const { data: users, isLoading: loading, error } = useQuery<User[], Error>('users', getAllUsers);

  // Crear un nuevo usuario con useMutation
  const addUserMutation = useMutation((userData: CreateUserDTO) => createUser(userData), {
    onSuccess: () => {
      // Invalida la query 'users' para refrescar la lista después de agregar un nuevo usuario
      queryClient.invalidateQueries('users');
    },
  });

  // Actualizar un usuario
  const editUserMutation = useMutation(
    ({ userId, updatedData }: { userId: number; updatedData: Partial<User> }) => updateUser(userId, updatedData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  // Eliminar un usuario
  const removeUserMutation = useMutation((userId: number) => deleteUser(userId), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });

  
  return { users, loading, error, addUserMutation, editUserMutation, removeUserMutation };
};
