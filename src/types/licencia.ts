import { Licitacion } from "./licitacion";

export interface Licencia {
    id:number;
    numeroIdentificador:string;
    nombre: string;
    descripcion: string;
    codigoLicencia: string;
    modoAdquisicion: string;
    disponibilidad?: string;
    licitacionId?: number;
    licitacion?: Licitacion;
}

// types/dtos.ts
export interface CreateLicenciaDTO {
    numeroIdentificador:string;
    nombre: string;
    descripcion: string;
    codigoLicencia: string;
    modoAdquisicion: string;
    disponibilidad?: string;
    licitacionId?: number;
  }
  
