import { Activo } from "./activo";
import { Ubicacion } from "./ubicacion";

export interface Prestamo {
    prestamo_id: number;
    activo: Activo;
    ubicacion_origen: Ubicacion;
    ubicacion_destino: Ubicacion;
    estado: string;
    fecha_solicitud: string;
    fecha_aprobacion?: string;
  }