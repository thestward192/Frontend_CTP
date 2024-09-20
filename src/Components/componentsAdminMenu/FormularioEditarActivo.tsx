import React, { useState, useEffect } from 'react';
import { Activo } from '../../types/activo';
import { Ley } from '../../types/ley';
import { Ubicacion } from '../../types/ubicacion';
import { getUbicaciones } from '../../Services/ubicacionService';
import { getLeyes } from '../../Services/leyService';
import {  FaCheckCircle } from 'react-icons/fa';

interface FormularioEditarActivoProps {
  asset: Activo;
  onClose: () => void;
  onSave: (updatedData: Partial<Activo>) => void;
}

const FormularioEditarActivo: React.FC<FormularioEditarActivoProps> = ({ asset, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Activo>>({
    nombre: asset.nombre,
    descripcion: asset.descripcion,
    marca: asset.marca,
    serie: asset.serie,
    estado: asset.estado,
    modelo: asset.modelo,
    numPlaca: asset.numPlaca,
    foto: asset.foto,
    precio: asset.precio,
    observacion: asset.observacion,
    ubicacionId: asset.ubicacionId,
    modoAdquisicion: asset.modoAdquisicion,
    leyId: asset.leyId,
  });

  const [leyes, setLeyes] = useState<Ley[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      onSave(formData);
      setSuccessMessage('Activo actualizado exitosamente');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error al actualizar el activo:', error);
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

        <h2 className="text-lg font-bold mb-4">Editar Activo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Marca</label>
              <input
                type="text"
                name="marca"
                value={formData.marca || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Modelo</label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Serie</label>
              <input
                type="text"
                name="serie"
                value={formData.serie || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                name="estado"
                value={formData.estado || 'Activo'}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Número de Placa</label>
              <input
                type="number"
                name="numPlaca"
                value={formData.numPlaca || 0}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ubicación</label>
              <select
                name="ubicacionId"
                value={formData.ubicacionId || 0}
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

            {formData.modoAdquisicion === 'Ley' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ley</label>
                  <select
                    name="leyId"
                    value={formData.leyId || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  >
                    <option value="">Seleccione una Ley</option>
                    {leyes.map((ley) => (
                      <option key={ley.id} value={ley.id}>
                        {ley.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio || 0}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                  <textarea
                    name="observacion"
                    value={formData.observacion || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEditarActivo;
