import React, { useState } from 'react';
import { useUbicacion } from '../../hooks/useUbicacion';

interface FormularioUbicacionProps {
  onClose: () => void;
}

const FormularioUbicacion: React.FC<FormularioUbicacionProps> = ({ onClose }) => {
  const { formData, handleInputChange, handleSubmitUbicacion } = useUbicacion();
  const [alertaVisible, setAlertaVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await handleSubmitUbicacion();
    if (success) {
      setAlertaVisible(true);
      setTimeout(() => {
        setAlertaVisible(false);
        onClose(); // Cerrar el formulario al crear una ubicación
      }, 2000); // Cerrar después de 2 segundos
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] relative">
        {alertaVisible && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
            <p>Ubicación creada exitosamente</p>
          </div>
        )}
        <h2 className="text-lg font-bold mb-4">Agregar Ubicación</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              name="nombre" // Asegúrate de que el 'name' coincida con 'nombre' en formData
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="Nombre de la Ubicación"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Descripción</label>
            <textarea
              name="descripcion" // Asegúrate de que el 'name' coincida con 'descripcion' en formData
              value={formData.descripcion}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="Descripción"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Pabellón</label>
            <input
              type="text"
              name="pabellon" // Asegúrate de que el 'name' coincida con 'pabellon' en formData
              value={formData.pabellon}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="Pabellón de la Ubicación"
            />
          </div>

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

export default FormularioUbicacion;
