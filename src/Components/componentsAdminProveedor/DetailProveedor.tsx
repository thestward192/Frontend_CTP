import React from 'react';
import { Proveedor } from '../../types/proveedor';

interface DetailProveedorProps {
  proveedor: Proveedor | null;
  onClose: () => void;
}

const DetailProveedor: React.FC<DetailProveedorProps> = ({ proveedor, onClose }) => {
  if (!proveedor) {
    return null; 
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Detalles del Proveedor</h2>
        <p><strong>Nombre del Vendedor:</strong> {proveedor.vendedor}</p>
        <p><strong>Nombre de la Empresa:</strong> {proveedor.nombreEmpresa}</p>
        <p><strong>Teléfono del Proveedor:</strong> {proveedor.telefonoProveedor}</p>
        <p><strong>Teléfono de la Empresa:</strong> {proveedor.telefonoEmpresa}</p>
        <p><strong>Email:</strong> {proveedor.email}</p>
        <p><strong>Disponibilidad:</strong> {proveedor.disponibilidad}</p>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailProveedor;
