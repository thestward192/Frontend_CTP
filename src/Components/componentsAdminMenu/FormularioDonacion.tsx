import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const FormularioDonacion: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    id: '',
    descripcion: '',
    marca: '',
    modelo: '',
    serie: '',
    estado: '',
    ubicacion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos de la donación:', formData);
    // Aquí se manejará la lógica de envío en el futuro
  };

  return (
    <div className="w-full h-auto p-6 mx-auto max-w-7xl" style={{ marginBottom: '100px', paddingBottom: '40px' }}>
      {/* Título */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Agregar Activo por Donación</h2>
        <p className="text-sm text-gray-500">Complete la información del activo donado.</p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* No. Identificación */}
          <div>
            <label className="block mb-2 font-medium">No. Identificación</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block mb-2 font-medium">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>

          {/* Marca */}
          <div>
            <label className="block mb-2 font-medium">Marca</label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>

          {/* Modelo */}
          <div>
            <label className="block mb-2 font-medium">Modelo</label>
            <input
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>

          {/* Serie */}
          <div>
            <label className="block mb-2 font-medium">Serie</label>
            <input
              type="text"
              name="serie"
              value={formData.serie}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block mb-2 font-medium">Estado</label>
            <input
              type="text"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>

          {/* Ubicación */}
          <div className="col-span-2">
            <label className="block mb-2 font-medium">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition-all duration-300 flex items-center text-sm"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onBack}
            className="bg-blue-500 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-300 flex items-center text-sm"
          >
            <FaArrowLeft className="mr-2" /> Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioDonacion;
