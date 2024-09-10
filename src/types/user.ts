export interface User {
    nombre: string;
    apellido_1: string;
    apellido_2: string;
    email: string;
    contraseña: string;
    descripcion? : string;
    rolId : number;
}