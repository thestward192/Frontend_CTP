// src/components/DetalleActivoDocente.tsx
import React, { useState } from 'react';
import { Activo } from '../../types/activo';
import FormularioPrestamo from '../componentsPrestamoDocente/FormularioPrestamo';
import { Menu, X } from 'lucide-react';

interface DetalleActivoDocenteProps {
  activo: Activo;
  onClose: () => void;
}

const DetalleActivoDocente: React.FC<DetalleActivoDocenteProps> = ({ activo, onClose }) => {
  const [showFormulario, setShowFormulario] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handlePrestar = () => {
    setShowFormulario(true);
  };

  const handleSubmitPrestamo = () => {
    setShowFormulario(false);
    onClose();
  };

  return (
    <>
      {/* Botón para mostrar/ocultar el detalle */}
      <button
        className="absolute top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-full shadow-lg md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {!showFormulario ? (
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-4 md:mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Detalle del Activo</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna Izquierda - Imagen */}
              <div className="space-y-4">
                {activo.foto ? (
                  <img
                    src={activo.foto}
                    alt={activo.nombre}
                    className="w-full h-64 object-contain rounded-lg border border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">Sin imagen</span>
                  </div>
                )}
              </div>

              {/* Columna Derecha - Información */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">No. Identificador</p>
                  <p className="text-lg text-gray-900">{activo.numPlaca}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre</p>
                  <p className="text-lg text-gray-900">{activo.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Marca</p>
                  <p className="text-lg text-gray-900">{activo.marca}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Serie</p>
                  <p className="text-lg text-gray-900">{activo.serie}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <span className={`inline-block px-3 py-1 rounded-md text-sm ${
                    activo.estado === 'Bueno'
                      ? 'bg-green-100 text-green-800'
                      : activo.estado === 'Regular'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {activo.estado}
                  </span>
                </div>
              </div>
            </div>            <div className="mt-8 flex justify-between">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={handlePrestar}
              >
                Prestar
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <FormularioPrestamo activo={activo} onSubmit={handleSubmitPrestamo} onCancel={() => setShowFormulario(false)} />
      )}
    </>
  );
};

export default DetalleActivoDocente;
