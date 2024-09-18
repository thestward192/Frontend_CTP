import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { createActivo } from '../../Services/activoService';
import { Activo } from '../../types/activo';
import { Ley } from '../../types/ley';
import { Ubicacion } from '../../types/ubicacion';
import { getUbicaciones } from '../../Services/ubicacionService';
import { getLeyes } from '../../Services/leyService';

const FormularioActivo: React.FC<{ onBack: () => void; modoAdquisicion: string }> = ({ onBack, modoAdquisicion }) => {
  const [formData, setFormData] = useState<Activo>({
    nombre: '',
    descripcion: '',
    marca: '',
    serie: '',
    estado: 'Activo', // Valor predeterminado
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para la notificación de éxito

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
      await createActivo(formData);
      setSuccessMessage('Activo creado exitosamente'); // Mostrar mensaje de éxito
      setTimeout(() => {
        setSuccessMessage(null); // Ocultar el mensaje después de 3 segundos
        onBack(); // Volver a la tabla
      }, 3000); // 3 segundos de espera
    } catch (error) {
      console.error('Error al crear el activo:', error);
    }
  };

  return (
    <div className="w-full flex justify-center items-start py-10" style={{ marginTop: '-30px' }}>
      <div
        className="w-full max-w-[90%] bg-white shadow-lg rounded-lg p-12"
        style={{
          marginBottom: '60px',
          marginLeft: '5%',
          marginRight: '5%',
        }}
      >
        {/* Notificación de éxito */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-6 flex items-center">
            <FaCheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}

        {/* Título */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700">
            {`Agregar Activo (${modoAdquisicion})`}
          </h2>
          <p className="text-sm text-gray-500">Complete la información del nuevo activo.</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
                required
              />
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium mb-2">Marca</label>
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
              <label className="block text-sm font-medium mb-2">Modelo</label>
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
              <label className="block text-sm font-medium mb-2">Serie</label>
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
              <label className="block text-sm font-medium mb-2">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
                required
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            {/* Número de Placa */}
            <div>
              <label className="block text-sm font-medium mb-2">Número de Placa</label>
              <input
                type="number"
                name="numPlaca"
                value={formData.numPlaca}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
                required
              />
            </div>

            {/* Descripción */}
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-2">Descripción</label>
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
              <label className="block text-sm font-medium mb-2">Ubicación</label>
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

            {/* Ley (solo si es modo Ley) */}
            {modoAdquisicion === 'Ley' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Ley</label>
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

                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium mb-2">Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-md"
                  />
                </div>

                {/* Observaciones */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-2">Observaciones</label>
                  <textarea
                    name="observacion"
                    value={formData.observacion}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-md"
                  />
                </div>
              </>
            )}
          </div>

          {/* Botones */}
          <div className="mt-6 flex justify-between space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow hover:bg-gray-700 transition-all flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Volver
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition-all"
            >
              Crear Activo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioActivo;
