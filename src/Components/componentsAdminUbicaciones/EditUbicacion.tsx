// src/components/EditUbicacionForm.tsx
import React, { useState } from 'react';
import { Ubicacion } from '../../types/ubicacion';

interface EditUbicacionFormProps {
  ubicacion: Ubicacion;
  onSave: (id: number, updatedData: Partial<Ubicacion>) => void;
  onCancel: () => void;
}

const EditUbicacion: React.FC<EditUbicacionFormProps> = ({ ubicacion, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Ubicacion>>({
    nombre: ubicacion.nombre,
    descripcion: ubicacion.descripcion,
    pabellon: ubicacion.pabellon,
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
    onSave(ubicacion.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Editar Ubicación</h2>
        <form onSubmit={handleSubmit}>
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
            <label className="block mb-1">Pabellón</label>
            <input
              type="text"
              name="pabellon"
              value={formData.pabellon || ''}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
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

export default EditUbicacion;
