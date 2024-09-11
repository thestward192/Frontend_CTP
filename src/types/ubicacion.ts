export interface Ubicacion {
    id: number,
    nombre : string;
    descripcion : string;
    pabellon: string;
}

export interface CreateUbicacion {
    nombre: string;
    descripcion: string;
    pabellon: string;
  }