export interface Licitacion {
    id:number
    numActa: number;
    numLicitacion: number;
    nombre: string;
    monto: number;
    descripcion: string;
    fecha: Date;
    idProveedor: number;
    idLey: number;
}

export interface UpdateLicitacionDTO {
    numActa?: number;
    numLicitacion?: number;
    nombre?: string;
    monto?: number;
    descripcion?: string;
    fecha?: Date;
    idProveedor?: number;
    idLey?: number;
  }

  