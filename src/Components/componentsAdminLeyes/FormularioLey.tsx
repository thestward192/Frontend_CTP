import React from 'react';

interface FormularioLeyProps {
  onClose: () => void;
}

const FormularioLey: React.FC<FormularioLeyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Agregar Ley</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-1">ID Ley</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="ID de la Ley"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Número de Ley</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="Número de la Ley"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="Nombre de la Ley"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Detalle</label>
            <textarea
              className="w-full border p-2 rounded-md"
              placeholder="Detalle"
              rows={4}
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

export default FormularioLey;
