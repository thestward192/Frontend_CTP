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
    vigenciaInicio: Date;
    vigenciaFin: Date;
    vigenciaInicio: Date;
    vigenciaFin: Date;
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
    vigenciaInicio: Date;
    vigenciaFin: Date;
  }