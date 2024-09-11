import React from 'react';

interface FormularioLicitacionProps {
  onClose: () => void;
}

const FormularioLicitacion: React.FC<FormularioLicitacionProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Agregar Licitación</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-1">Número de Acta</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="Número de Acta"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Número de Licitación</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="Número de Licitación"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Nombre de la Licitación</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="Nombre de la Licitación"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Monto</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="Monto Autorizado"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Descripción</label>
            <textarea
              className="w-full border p-2 rounded-md"
              placeholder="Descripción"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Fecha</label>
            <input
              type="date"
              className="w-full border p-2 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">ID Proveedor</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="ID del Proveedor"
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

export default FormularioLicitacion;
