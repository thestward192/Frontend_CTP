import React, { useState, useEffect } from 'react';
import { Licitacion, UpdateLicitacionDTO } from '../../types/licitacion';
import { useLeyes } from '../../hooks/useLey'; 
import { useProveedores } from '../../hooks/useProveedor';

interface EditLicitacionFormProps {
  licitacion: Licitacion;
  onSave: (id: number, updatedData: UpdateLicitacionDTO) => void;
  onCancel: () => void;
}

const EditLicitacion: React.FC<EditLicitacionFormProps> = ({ licitacion, onSave, onCancel }) => {
  const { leyes, fetchLeyes } = useLeyes();
  const { proveedores, fetchProveedores } = useProveedores();

  const [formData, setFormData] = useState<UpdateLicitacionDTO>({
    numLicitacion: licitacion.numLicitacion,
    nombre: licitacion.nombre,
    monto: licitacion.monto,
    descripcion: licitacion.descripcion,
    fecha: licitacion.fecha ? new Date(licitacion.fecha) : undefined,
    idProveedor: licitacion.idProveedor,
    idLey: licitacion.idLey,
  });

  useEffect(() => {
    fetchLeyes();
    fetchProveedores();
  }, [fetchLeyes, fetchProveedores]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(licitacion.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Editar Licitación</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Número de Licitación</label>
            <input
              type="text"
              name="numLicitacion"
              value={formData.numLicitacion}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
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
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Monto</label>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha?.toString().split('T')[0]}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Proveedor</label>
            <select
              name="idProveedor"
              value={formData.idProveedor}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Seleccionar Proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombreProveedor}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Ley</label>
            <select
              name="idLey"
              value={formData.idLey}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Seleccionar Ley</option>
              {leyes.map((ley) => (
                <option key={ley.id} value={ley.id}>
                  {ley.nombre}
                </option>
              ))}
            </select>
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

export default EditLicitacion;
