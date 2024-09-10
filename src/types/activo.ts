export interface Activo {
    nombre: string;
    descripcion: string;
    marca: string;
    serie: string;
    estado: string;
    modelo: string;
    numPlaca: number;
    foto: string;
    precio: number;
    observacion: string;

    ubicacionId: number;
    leyId?: number;
    donadorId?: number;
}