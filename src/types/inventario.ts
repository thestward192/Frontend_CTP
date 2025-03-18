// src/types/inventario.ts

export interface InventarioDetalle {
  activoId: number;
  estadoProvisional: string; // "Bueno", "Regular" o "Malo"
  detalle?: string;
}

export interface Inventario {
  id?: number;
  fecha: string; // Formato YYYY-MM-DD
  docenteId: number;
  ubicacionId: number;
  detalles: InventarioDetalle[];
  // Para el historial, se puede incluir información relacionada
  ubicacion?: {
    id: number;
    nombre: string;
  };
  revisado?: boolean; // Nuevo campo para indicar si ya fue revisado
}
