export interface Proveedor {
    id: number;
    nombreProveedor: string;
    nombreEmpresa: string;
    telefonoProveedor: number;
    telefonoEmpresa: number;
    email: string;
}

export interface CreateProveedor {
    nombreProveedor: string;
    nombreEmpresa: string;
    telefonoProveedor: number;
    telefonoEmpresa: number;
    email: string;
  }