// src/components/DetalleActivoDocente.tsx
import React, { useState } from 'react';
import { Activo } from '../../types/activo';
import FormularioPrestamo from '../componentsPrestamoDocente/FormularioPrestamo';

interface DetalleActivoDocenteProps {
  activo: Activo;
  onClose: () => void;
}

const DetalleActivoDocente: React.FC<DetalleActivoDocenteProps> = ({ activo, onClose }) => {
  const [showFormulario, setShowFormulario] = useState(false);

  const handlePrestar = () => {
    setShowFormulario(true);
  };

  const handleSubmitPrestamo = () => {
    setShowFormulario(false);
    onClose();
  };

  return (
    <>
      {!showFormulario ? (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
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