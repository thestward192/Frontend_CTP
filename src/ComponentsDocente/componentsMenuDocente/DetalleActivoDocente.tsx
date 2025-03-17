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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 md:mx-auto">
            <h2 className="text-xl font-semibold mb-4">Detalle del Activo</h2>
            <p><strong>No. Identificador:</strong> {activo.numPlaca}</p>
            <p><strong>Nombre:</strong> {activo.nombre}</p>
            <p><strong>Marca:</strong> {activo.marca}</p>
            <p><strong>Serie:</strong> {activo.serie}</p>
            <p><strong>Estado:</strong> {activo.estado}</p>

            <div className="mt-6 flex justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handlePrestar}
              >
                Prestar
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
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
