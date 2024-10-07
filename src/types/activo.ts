import { Ubicacion } from "./ubicacion";

export interface Activo {
    id?: number; // ID opcional
    nombre: string;
    descripcion: string;
    marca: string;
    serie: string;
    estado?: string;
    disponibilidad?: string;
    modelo: string;
    numPlaca: number;
    foto: string;
    precio: number;
    observacion: string;
    modoAdquisicion: string; // Ley o Donación
    ubicacionId: number;
    ubicacion?: Ubicacion; // Relación con la ubicación
    leyId?: number; // Relación opcional con la ley si es por "Ley"
  }
  