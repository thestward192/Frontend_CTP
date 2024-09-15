import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { createActivo, getDonadores, getLeyes, getUbicaciones } from '../../Services/activoService';
import { Activo } from '../../types/activo';
import { Ley } from '../../types/ley';
import { Ubicacion } from '../../types/ubicacion';

const FormularioActivo: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [formData, setFormData] = useState<Activo>({
    id: 0,
    nombre: '',
    descripcion: '',
    marca: '',
    serie: '',
    estado: '',
    modelo: '',
    numPlaca: 0,
    foto: '',
    precio: 0,
    observacion: '',
    ubicacionId: 0,
    leyId: undefined,
    donadorId: undefined,
  });

  const [leyes, setLeyes] = useState<Ley[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leyesData, , ubicacionesData] = await Promise.all([getLeyes(), getDonadores(), getUbicaciones()]);
        setLeyes(leyesData);
        setUbicaciones(ubicacionesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      dataToSubmit.precio = Number(dataToSubmit.precio);
      dataToSubmit.numPlaca = Number(dataToSubmit.numPlaca);
      await createActivo(dataToSubmit);
      onBack(); // Volver a la tabla
    } catch (error) {
      console.error('Error al crear el activo:', error);
    }
  };

  return (
    <div className="w-full h-auto p-6 mx-auto max-w-7xl" style={{ marginBottom: '100px', paddingBottom: '40px' }}>
      {/* Título */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Agregar Activo</h2>
        <p className="text-sm text-gray-500">Complete la información del nuevo activo.</p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Campo de Nombre */}
          <div>
            <label className="block mb-2 font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>

          {/* Campo de Marca */}
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

          {/* Campo de Modelo */}
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

          {/* Campo de Serie */}
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
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block mb-2 font-medium">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>

          {/* Descripción */}
          <div className="col-span-2">
            <label className="block mb-2 font-medium">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>

          {/* Ubicación */}
          <div>
            <label className="block mb-2 font-medium">Ubicación</label>
            <select
              name="ubicacionId"
              value={formData.ubicacionId}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            >
              <option value="">Seleccione una Ubicación</option>
              {ubicaciones.map((ubicacion) => (
                <option key={ubicacion.id} value={ubicacion.id}>
                  {ubicacion.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Ley */}
          <div>
            <label className="block mb-2 font-medium">Ley</label>
            <select
              name="leyId"
              value={formData.leyId}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
            >
              <option value="">Seleccione una Ley</option>
              {leyes.map((ley) => (
                <option key={ley.id} value={ley.id}>
                  {ley.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition-all duration-300 flex items-center text-sm"
          >
            Crear Activo
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

export default FormularioActivo;
