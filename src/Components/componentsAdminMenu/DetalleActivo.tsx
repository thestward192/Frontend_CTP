import React, { useState } from 'react';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import HistorialPrestamos from './HistorialPrestamos';

// Definimos la interfaz para el activo
interface Asset {
  id: string;
  descripcion: string;
  marca: string;
  modelo: string;
  serie: string;
  estado: string;
  ubicacion: string;
  modoAdquisicion: string;
  precio: string;
  observacion: string;
  foto: string;
}

const DetalleComponent: React.FC<{ asset: Asset; onBack: () => void }> = ({ asset, onBack }) => {
  const [activeTab, setActiveTab] = useState('detalle'); // Controla la pestaña activa

  const handleEliminar = (id: string) => {
    console.log('Eliminar activo', id);
    // Lógica para eliminar el activo
  };

  return (
    <div className="w-full h-full bg-white shadow-lg rounded-lg p-8 overflow-auto">
      {/* Pestañas en la parte superior */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 mr-2 font-bold ${activeTab === 'detalle' ? 'border-b-2 border-blue-600' : ''}`}
          onClick={() => setActiveTab('detalle')}
        >
          Detalle de Activo
        </button>
        <button
          className={`px-4 py-2 ml-2 font-bold ${activeTab === 'historial' ? 'border-b-2 border-blue-600' : ''}`}
          onClick={() => setActiveTab('historial')}
        >
          Historial de Préstamos
        </button>
      </div>

      {/* Contenido basado en la pestaña seleccionada */}
      {activeTab === 'detalle' ? (
        <>
          {/* Imagen y Datos del Activo */}
          <div className="flex justify-start items-start w-full space-x-8 mb-4">
            {/* Imagen del activo */}
            <div className="flex-shrink-0">
              <img src={asset.foto} alt="Foto del Activo" className="w-40 h-40 object-cover rounded-lg" />
            </div>

            {/* Datos del activo */}
            <div className="w-full max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-8 gap-4 text-xs leading-6">
                <div className="col-span-1">
                  <p className="font-bold">No. Identificador</p>
                  <p>{asset.id}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-bold">Descripción</p>
                  <p>{asset.descripcion}</p>
                </div>
                <div className="col-span-1">
                  <p className="font-bold">Marca</p>
                  <p>{asset.marca}</p>
                </div>
                <div className="col-span-1">
                  <p className="font-bold">Modelo</p>
                  <p>{asset.modelo}</p>
                </div>
                <div className="col-span-1">
                  <p className="font-bold">Serie</p>
                  <p>{asset.serie}</p>
                </div>
                <div className="col-span-1">
                  <p className="font-bold">Estado</p>
                  <p>{asset.estado}</p>
                </div>
                <div className="col-span-1">
                  <p className="font-bold">Ubicación</p>
                  <p>{asset.ubicacion}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-bold">Modo de Adquisición</p>
                  <p>{asset.modoAdquisicion}</p>
                </div>
                <div className="col-span-1">
                  <p className="font-bold">Precio</p>
                  <p>{asset.precio}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-bold">Observación</p>
                  <p>{asset.observacion}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Eliminar y Volver */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={() => handleEliminar(asset.id)}
              className="bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-700 transition flex items-center"
            >
              <FaTrash className="mr-2" /> Eliminar Activo
            </button>
            <button
              onClick={onBack}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Volver a la tabla principal
            </button>
          </div>
        </>
      ) : (
        /* Historial de Préstamos */
        <HistorialPrestamos />
      )}
    </div>
  );
};

export default DetalleComponent;
