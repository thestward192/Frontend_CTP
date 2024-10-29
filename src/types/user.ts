// src/types/user.ts
export interface User {
    id: number;
    nombre: string;
    apellido_1: string;
    apellido_2: string;
    email: string;
    disponibilidad?: string;
    descripcion?: string;
    rol: {
      id: number;
      nombre: string;
    };
    ubicaciones: {
      id: number;
      nombre: string;
    }[];
  }
  
  export interface CreateUserDTO {
    nombre: string;
    apellido_1: string;
    apellido_2: string;
    email: string;
    contraseña: string;
    descripcion?: string;
    disponibilidad?: string;
    rolId: number;
    ubicacionIds?: number[];
  }
  