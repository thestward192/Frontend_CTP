// src/components/DetailProveedor.tsx
import React from 'react';
import { Proveedor } from '../../types/proveedor';

interface DetailProveedorProps {
  proveedor: Proveedor | null;
  onClose: () => void;
}

const DetailProveedor: React.FC<DetailProveedorProps> = ({ proveedor, onClose }) => {
  if (!proveedor) {
    return null; // No mostrar nada si no hay proveedor seleccionado
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Detalles del Proveedor</h2>
        <p><strong>ID:</strong> {proveedor.id}</p>
        <p><strong>Nombre del Proveedor:</strong> {proveedor.nombreProveedor}</p>
        <p><strong>Nombre de la Empresa:</strong> {proveedor.nombreEmpresa}</p>
        <p><strong>Teléfono del Proveedor:</strong> {proveedor.telefonoProveedor}</p>
        <p><strong>Teléfono de la Empresa:</strong> {proveedor.telefonoEmpresa}</p>
        <p><strong>Email:</strong> {proveedor.email}</p>

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default DetailProveedor;
