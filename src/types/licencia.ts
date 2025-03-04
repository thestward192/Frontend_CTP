import { Ley } from "./ley";

export interface Licencia {
    id:number;
    nombre: string;
    descripcion: string;
    codigoLicencia: string;
    modoAdquisicion: string;
    disponibilidad?: string;
    leyId?: number;
    ley?: Ley;
    vigenciaInicio: Date;
    vigenciaFin: Date;
}

// types/dtos.ts
export interface CreateLicenciaDTO {
    nombre: string;
    descripcion: string;
    codigoLicencia: string;
    modoAdquisicion: string;
    disponibilidad?: string;
    leyId?: number;
    vigenciaInicio: Date;
    vigenciaFin: Date;
  }
  
