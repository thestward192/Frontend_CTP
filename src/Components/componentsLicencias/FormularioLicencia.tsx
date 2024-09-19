import React from 'react';

interface FormularioLicenciaProps {
  onClose: () => void;
}

const FormularioLicencia: React.FC<FormularioLicenciaProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Agregar Licencia</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-1">Nombre de la Licencia</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="Nombre de la Licencia"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Descripción</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="Descripción"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Código de la Licencia</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              placeholder="Código de la Licencia"
            />
          </div>

          {/* Botones de Guardar y Cancelar */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioLicencia;
