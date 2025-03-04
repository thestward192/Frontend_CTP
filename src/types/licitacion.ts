import { Ley } from "./ley";
import { Proveedor } from "./proveedor";

export interface Licitacion {
    id:number
    numActa: number;
    numLicitacion: number;
    nombre: string;
    monto: number;
    descripcion: string;
    disponibilidad?: string;
    fecha: Date;
    idProveedor: number;
    idLey: number;
    ley?: Ley;
    proveedor?: Proveedor;
}

export interface UpdateLicitacionDTO {
    numActa?: number;
    numLicitacion?: number;
    nombre?: string;
    monto?: number;
    descripcion?: string;
    disponibilidad?: string;
    fecha?: Date;
    idProveedor?: number;
    idLey?: number;
  }

  