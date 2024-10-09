export interface Prestamo {
  id: number;
  activoId: number;
  prestadoPorId: number;
  prestadoAId: number;
  ubicacionId: number;  // Ubicación a la que va el activo
  ubicacionActualId: number;  // Ubicación actual del activo
  fechaPrestamo: Date;  // Fecha de préstamo automática
  fechaDevolucion?: Date;  // Fecha de devolución ingresada por el usuario
  estado: string;
}
