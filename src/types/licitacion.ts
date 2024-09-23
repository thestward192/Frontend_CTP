export interface Licitacion {
    id?:number
    numActa: number;
    numLicitacion: number;
    nombre: string;
    monto: number;
    descripcion: string;
    fecha: string;
    idProveedor: number;
    idLey: number;
}