import { Ubicacion } from "./ubicacion";
import { Licitacion } from "./licitacion"; // Importamos el tipo Licitacion

export interface Activo {
    id?: number; // ID opcional
    nombre: string;
    descripcion: string;
    marca: string;
    serie: string;
    estado?: string;
    disponibilidad?: string;
    modelo: string;
    numPlaca?: string;
    foto: string;
    precio: number;
    observacion: string;
    modoAdquisicion: string;
    ubicacionId: number;
    ubicacion?: Ubicacion;
    licitacionId?: number;
    licitacion?: Licitacion;
}
