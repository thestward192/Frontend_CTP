export interface Proveedor {
    id: number;
    vendedor: string;
    nombreEmpresa: string;
    telefonoProveedor: string;
    telefonoEmpresa: string;
    disponibilidad?: string;
    email: string;
}

export interface CreateProveedor {
    vendedor: string;
    nombreEmpresa: string;
    telefonoProveedor: string;
    telefonoEmpresa: string;
    disponibilidad?: string;
    email: string;
  }