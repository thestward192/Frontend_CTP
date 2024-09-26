export interface Proveedor {
    id: number;
    nombreProveedor: string;
    nombreEmpresa: string;
    telefonoProveedor: string;
    telefonoEmpresa: string;
    email: string;
}

export interface CreateProveedor {
    nombreProveedor: string;
    nombreEmpresa: string;
    telefonoProveedor: string;
    telefonoEmpresa: string;
    email: string;
  }