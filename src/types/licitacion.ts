import { Ley } from "./ley";
import { Moneda } from "./moneda";
import { Proveedor } from "./proveedor";

export interface Licitacion {
    id:number
    numActa: string;
    numLicitacion: number;
    nombre: string;
    monto: number;
    moneda: Moneda;
    descripcion: string;
    disponibilidad?: string;
    fecha: Date;
    idProveedor: number;
    idLey: number;
    ley?: Ley;
    proveedor?: Proveedor;
}

export interface UpdateLicitacionDTO {
    numActa?: string;
    numLicitacion?: number;
    nombre?: string;
    monto?: number;
    moneda?: Moneda;
    descripcion?: string;
    disponibilidad?: string;
    fecha?: Date;
    idProveedor?: number;
    idLey?: number;
  }

  