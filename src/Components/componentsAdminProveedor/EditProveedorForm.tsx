import React, { useState } from 'react';
import { Proveedor } from '../../types/proveedor';

interface EditProveedorFormProps {
  proveedor: Proveedor;
  onSave: (id: number, updatedData: Partial<Proveedor>) => void;
  onCancel: () => void;
}

const EditProveedorForm: React.FC<EditProveedorFormProps> = ({ proveedor, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Proveedor>>({
    nombreProveedor: proveedor.nombreProveedor,
    nombreEmpresa: proveedor.nombreEmpresa,
    telefonoProveedor: proveedor.telefonoProveedor,
    telefonoEmpresa: proveedor.telefonoEmpresa,
    email: proveedor.email,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(proveedor.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Editar Proveedor</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nombre del Proveedor</label>
            <input
              type="text"
              name="nombreProveedor"
              value={formData.nombreProveedor}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Nombre de la Empresa</label>
            <input
              type="text"
              name="nombreEmpresa"
              value={formData.nombreEmpresa}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Teléfono del Proveedor</label>
            <input
              type="text"
              name="telefonoProveedor"
              value={formData.telefonoProveedor}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Teléfono de la Empresa</label>
            <input
              type="text"
              name="telefonoEmpresa"
              value={formData.telefonoEmpresa}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
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

export default EditProveedorForm;
