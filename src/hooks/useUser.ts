// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { User, CreateUserDTO } from '../types/user';
import { createUser, getAllUsers, updateUser, updateDisponibilidadUser } from '../Services/userService';

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Obtener todos los usuarios usando useQuery
  const { data: users, isLoading: loading, error } = useQuery<User[], Error>('users', getAllUsers);



  // Crear un nuevo usuario con useMutation
  const addUserMutation = useMutation(async (userData: CreateUserDTO) => createUser(userData), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
    onError: (error: any) => {
      throw error;
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
  const updateDisponibilidadMutation = useMutation((userId: number) => updateDisponibilidadUser(userId, "Fuera de Servicio"), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });

  
  return { users, loading, error, addUserMutation, editUserMutation, updateDisponibilidadMutation };
};
