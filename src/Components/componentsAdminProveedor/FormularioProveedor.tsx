import React from 'react';

interface FormularioProveedorProps {
  onClose: () => void;
}

const FormularioProveedor: React.FC<FormularioProveedorProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Agregar Proveedor</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-1">Nombre del Proveedor</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="Nombre del Proveedor"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Nombre de la Empresa</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="Nombre de la Empresa"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Teléfono del Proveedor</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="Teléfono del Proveedor"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Teléfono de la Empresa</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="Teléfono de la Empresa"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded-md"
              placeholder="Correo Electrónico"
            />
          </div>

          {/* Botones de Crear y Cancelar */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioProveedor;
