import React, { useState } from 'react';
import { Ley } from '../../types/ley';

interface EditLeyFormProps {
  ley: Ley;
  onSave: (id: number, updatedData: Partial<Ley>) => void;
  onCancel: () => void;
}

const EditLey: React.FC<EditLeyFormProps> = ({ ley, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Ley>>({
    numLey: ley.numLey,
    nombre: ley.nombre,
    detalle: ley.detalle,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(ley.id, formData); // Llama a la función onSave con los datos actualizados
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Editar Ley</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Número de Ley</label>
            <input
              type="text"
              name="numLey"
              value={formData.numLey || ''}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Detalle</label>
            <textarea
              name="detalle"
              value={formData.detalle || ''}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel} // Botón para cancelar la edición
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLey;
