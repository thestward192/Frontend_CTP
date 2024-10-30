import React, { useState, useEffect } from 'react';
import { createActivo, getDonadores, getLeyes, getUbicaciones } from '../../Services/activoService';
import { Activo } from '../../types/activo';
import { Ley } from '../../types/ley';
import { Donador } from '../../types/donador';
import { Ubicacion } from '../../types/ubicacion';


const FormularioActivo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<Activo>({
    id: 0,
    nombre: '',
    descripcion: '',
    marca: '',
    serie: '',
    estado: '',
    modelo: '',
    numPlaca: 0,
    foto: '',  // Este campo será un archivo (File) para la foto
    precio: 0,
    observacion: '',
    ubicacionId: 0,
    leyId: undefined,
    donadorId: undefined,
    });

  // Estado para listas de leyes, donadores, y ubicaciones
  const [leyes, setLeyes] = useState<Ley[]>([]);
  const [donadores, setDonadores] = useState<Donador[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);

  // Cargar datos de leyes, donadores y ubicaciones al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leyesData, donadoresData, ubicacionesData] = await Promise.all([
          getLeyes(),
          getDonadores(),
          getUbicaciones(),
        ]);
        setLeyes(leyesData);
        setDonadores(donadoresData);
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
      onClose();
    } catch (error) {
      console.error('Error al crear el activo:', error);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg w-[1000px] max-h-[750px] overflow-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Agregar Activo</h2>
        <form onSubmit={handleSubmit}>
          
          {/* Campo de Nombre */}
          <div className="mb-6">
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

          {/* Campo de la Foto (URL) */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Foto (URL)</label>
            <input
              type="text"
              name="foto"
              value={formData.foto}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Campo de la Marca */}
          <div className="mb-6">
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

          {/* Otros Campos */}
          <div className="grid grid-cols-3 gap-8">
            <div className="mb-6">
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

            <div className="mb-6">
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

            <div className="mb-6">
              <label className="block mb-2 font-medium">Estado</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Número de Placa</label>
              <input
                type="number"
                name="numPlaca"
                value={formData.numPlaca}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
                required
              />
            </div>

            <div className="mb-6">
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

            <div className="mb-6 col-span-3">
              <label className="block mb-2 font-medium">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
                required
              />
            </div>

            <div className="mb-6 col-span-3">
              <label className="block mb-2 font-medium">Observación</label>
              <textarea
                name="observacion"
                value={formData.observacion}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
              />
            </div>
          </div>

          {/* Ubicación */}
          <div className="mb-6">
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

          {/* Ley y Donador */}
          <div className="mb-6">
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

          <div className="mb-6">
            <label className="block mb-2 font-medium">Donador</label>
            <select
              name="donadorId"
              value={formData.donadorId}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
            >
              <option value="">Seleccione un Donador</option>
              {donadores.map((donador) => (
                <option key={donador.id} value={donador.id}>
                  {donador.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="sticky bottom-0 bg-white pt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioActivo;