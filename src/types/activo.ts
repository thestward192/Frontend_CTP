import { Ubicacion } from "./ubicacion";
import { Licitacion } from "./licitacion"; // Importamos el tipo Licitacion
import { Moneda } from "./moneda";

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
    moneda: Moneda;
    observacion: string;
    modoAdquisicion: string; // Ley o Donación
    ubicacionId: number;
    ubicacion?: Ubicacion; // Relación con la ubicación
    licitacionId?: number; // Nueva relación con Licitacion
    licitacion?: Licitacion; // Relación opcional con la licitación
}
