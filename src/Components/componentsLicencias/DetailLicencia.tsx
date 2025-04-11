import React, { useState } from 'react';
import { Licencia } from '../../types/licencia';

interface DetailLicenciaProps {
  licencia: Licencia | null;
  onClose: () => void;
}

const DetailLicencia: React.FC<DetailLicenciaProps> = ({ licencia, onClose }) => {
  const [showProveedorModal, setShowProveedorModal] = useState(false);

  if (!licencia) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-auto">
          <h2 className="text-lg font-bold mb-4">Detalles de la Licencia</h2>
          <p>
            <strong>No Identificador:</strong> {licencia.numeroIdentificador}
          </p>
          <p>
            <strong>Nombre:</strong> {licencia.nombre}
          </p>
          <p className="max-h-40 overflow-auto">
            <strong>Descripción:</strong> {licencia.descripcion}
          </p>
          <p>
            <strong>Código de Licencia:</strong> {licencia.codigoLicencia}
          </p>
          <p>
            <strong>Modo Adquisición:</strong> {licencia.modoAdquisicion}
          </p>
          <p>
            <strong>Licitación:</strong>{' '}
            {licencia.modoAdquisicion === 'Ley' && licencia.licitacion ? (
              <span
                className="text-blue-600 cursor-pointer hover:underline focus:outline-none"
                onClick={() => setShowProveedorModal(true)}
              >
                {licencia.licitacion.nombre}
              </span>
            ) : (
              'No aplica'
            )}
          </p>
          <p>
            <strong>Disponibilidad:</strong> {licencia.disponibilidad}
          </p>
          <p>
            <strong>Vigencia de la Licencia:</strong>{' '}
            {new Date(licencia.vigenciaInicio + 'T00:00:00').toLocaleDateString()} -{' '}
            {new Date(licencia.vigenciaFin + 'T00:00:00').toLocaleDateString()}
          </p>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Modal del proveedor */}
      {showProveedorModal && licencia.licitacion?.proveedor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-auto">
            <h2 className="text-lg font-bold mb-4">Detalles del Proveedor</h2>
            <p>
              <strong>Empresa:</strong> {licencia.licitacion.proveedor.nombreEmpresa}
            </p>
            <p>
              <strong>Vendedor:</strong> {licencia.licitacion.proveedor.vendedor}
            </p>
            <p>
              <strong>Teléfono Empresa:</strong> {licencia.licitacion.proveedor.telefonoEmpresa}
            </p>
            <p>
              <strong>Teléfono Vendedor:</strong> {licencia.licitacion.proveedor.telefonoProveedor}
            </p>
            <p>
              <strong>Email:</strong> {licencia.licitacion.proveedor.email}
            </p>

            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowProveedorModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailLicencia;
