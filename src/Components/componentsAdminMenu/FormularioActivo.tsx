import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Activo } from '../../types/activo';
import { Ley } from '../../types/ley';
import { Ubicacion } from '../../types/ubicacion';
import { getUbicaciones } from '../../Services/ubicacionService';
import { getLeyes } from '../../Services/leyService';
import { useActivos } from '../../hooks/useActivo';

const FormularioAgregarActivo: React.FC<{ onClose: () => void; modoAdquisicion: string }> = ({ onClose, modoAdquisicion }) => {
  const [formData, setFormData] = useState<Omit<Activo, 'id'>>({
    nombre: '',
    descripcion: '',
    marca: '',
    serie: '',
    modelo: '',
    numPlaca: 0,
    foto: '',
    precio: 0,
    observacion: '',
    ubicacionId: 0,
    modoAdquisicion,
    leyId: modoAdquisicion === 'Ley' ? undefined : undefined,
  });

  const [leyes, setLeyes] = useState<Ley[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { handleCreateActivo, loading, error } = useActivos();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ubicacionesData, leyesData] = await Promise.all([getUbicaciones(), getLeyes()]);
        setUbicaciones(ubicacionesData);
        setLeyes(leyesData);
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
      await handleCreateActivo(formData);
      setSuccessMessage('Activo creado exitosamente');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();  // Cerramos el formulario al crear el activo
      }, 1000);
    } catch (error) {
      console.error('Error al crear el activo:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]">
        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-6 flex items-center">
            <FaCheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}

        <h2 className="text-lg font-bold mb-4">Agregar Activo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usamos grid para crear 2 columnas */}
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Marca</label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Modelo</label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            {/* Serie */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Serie</label>
              <input
                type="text"
                name="serie"
                value={formData.serie}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            {/* Número de Placa */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Número de Placa</label>
              <input
                type="number"
                name="numPlaca"
                value={formData.numPlaca}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            {/* Descripción */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Ubicación</label>
              <select
                name="ubicacionId"
                value={formData.ubicacionId}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
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

            {/* Ley (solo si es modo Ley) */}
            {modoAdquisicion === 'Ley' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ley</label>
                  <select
                    name="leyId"
                    value={formData.leyId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  >
                    <option value="">Seleccione una Ley</option>
                    {leyes.map((ley) => (
                      <option key={ley.id} value={ley.id}>
                        {ley.numLey}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Observaciones */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                  <textarea
                    name="observacion"
                    value={formData.observacion}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={onClose}  // Aseguramos que el botón de cancelar cierre el formulario
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Activo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioAgregarActivo;
