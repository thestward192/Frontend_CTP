import React, { useState } from 'react';
import { useLeyes } from '../../hooks/useLey'; // Importamos el hook

interface FormularioLeyProps {
  onClose: () => void;
}

const FormularioLey: React.FC<FormularioLeyProps> = ({ onClose }) => {
  const { handleSubmitLey } = useLeyes(); // Usamos la función para crear ley
  const [formData, setFormData] = useState({
    numLey: '',
    nombre: '',
    detalle: '',
  });
  const [alertaVisible, setAlertaVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await handleSubmitLey(formData); // Enviar la nueva ley
    if (success) {
      setAlertaVisible(true); // Mostrar alerta de éxito
      setTimeout(() => {
        setAlertaVisible(false);
        onClose(); // Cerrar el modal al crear la ley
      }, 1000); // Cerrar después de 1.5 segundos
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] relative">
        {alertaVisible && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
            <p>Ley creada exitosamente</p>
          </div>
        )}
        <h2 className="text-lg font-bold mb-4">Agregar Ley</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Número de Ley</label>
            <input
              type="text"
              name="numLey"
              value={formData.numLey}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="Número de la Ley"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="Nombre de la Ley"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Detalle</label>
            <textarea
              name="detalle"
              value={formData.detalle}
              onChange={handleInputChange}
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
