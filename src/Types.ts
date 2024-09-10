export interface Activo {
    idActivo: number;
    descripcion: string;
    marca: string;
    serie: string;
    estado: string;
    modelo: string;
    numeroPlaca: string;
    foto: string; // Podría ser un URL a la imagen
    precio: number;
    observacion: string;
  }
  export interface Ley {
    idLey: number;
    numLey: string;
    nombre: string;
    detalle: string;
  }
  
  export interface Donador {
    idDonador: number;
    nombre: string;
    descripcion: string;
  }
  
  export interface ModoAdquisicion {
    idModoAdquisicion: number;
    tipo: string;
    idRelacionado: number;
  }
  
  export interface Licencia {
    idLicencia: number;
    nombre: string;
    descripcion: string;
    codigoLicencia: string;
  }
  
  export interface Usuario {
    idUsuario: number;
    nombre: string;
    apellido: string;
    email: string;
    contrasena: string;
  }
  
  export interface Rol {
    rolID: number;
    nombre: string;
    descripcion: string;
  }
  
  export interface Reporte {
    reporteID: number;
    tipoReporte: string;
    fechaGeneracion: Date;
    descripcion: string;
  }
  
  export interface Prestamo {
    idPrestamo: number;
    fechaPrestamo: Date;
    fechaDevolucion: Date;
    estado: string;
    ubicacion: string;
  }
  
  export interface Inventario {
    idInventario: number;
    año: number;
    fechaCreacion: Date;
    detalleInventario: string;
  }
  
  export interface Licitacion {
    fecha: Date;
    idLicitacion: number;
    numActa: string;
    numLicitacion: string;
    nombreLicitacion: string;
    montoAutorizado: number;
    descripcion: string;
  }
  
  export interface Proveedor {
    telProveedor: string;
    idProveedor: number;
    nomProveedor: string;
    nomEmpresa: string;
    numContacto: string;
    email: string;
    telEmpresa: string;
  }
  
  export interface Ubicacion {
    idUbicacion: number;
    nombreUbicacion: string;
    pabellon: string;
    descripcion: string;
  }
  