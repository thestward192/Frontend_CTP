import React, { useState } from 'react';
import { FaArrowLeft, FaTrash, FaEdit, FaFileExport, FaTags } from 'react-icons/fa';
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

  const handleEditar = () => {
    console.log('Editar activo', asset.id);
    // Lógica para editar el activo
  };

  const handleExportar = () => {
    console.log('Exportar activo', asset.id);
    // Lógica para exportar los datos del activo
  };

  const handleGenerarSticker = () => {
    console.log('Generar sticker para activo', asset.id);
    // Lógica para generar el sticker del activo
  };

  return (
    <div className="w-full h-full bg-white shadow-lg rounded-lg p-6 overflow-hidden relative" style={{ height: 'calc(100vh - 180px)' }}> {/* Ajuste del tamaño y espacio adicional */}
      {/* Pestañas en la parte superior */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 font-bold text-sm transition-colors duration-300 ${
            activeTab === 'detalle' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
          onClick={() => setActiveTab('detalle')}
        >
          Detalle de Activo
        </button>
        <button
          className={`px-6 py-2 font-bold text-sm transition-colors duration-300 ${
            activeTab === 'historial' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
          onClick={() => setActiveTab('historial')}
        >
          Historial de Préstamos
        </button>
      </div>

      {/* Contenido basado en la pestaña seleccionada */}
      {activeTab === 'detalle' ? (
        <>
          {/* Título */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Información del Activo</h2>
            <p className="text-sm text-gray-500">Detalles generales y estado del activo.</p>
          </div>

          {/* Datos del Activo y la Imagen */}
          <div className="flex justify-between">
            <div className="flex-grow">
              <div className="border-t border-gray-200 py-2 w-3/4"> {/* Ajusta el ancho de las líneas divisorias */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-gray-600">No. Identificador</p>
                    <p className="text-gray-800">{asset.id}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-gray-600">Marca</p>
                    <p className="text-gray-800">{asset.marca}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 py-2 w-3/4"> {/* Ajusta el ancho de las líneas divisorias */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-gray-600">Modelo</p>
                    <p className="text-gray-800">{asset.modelo}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-gray-600">Serie</p>
                    <p className="text-gray-800">{asset.serie}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 py-2 w-3/4"> {/* Ajusta el ancho de las líneas divisorias */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-gray-600">Estado</p>
                    <p className="text-gray-800">{asset.estado}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-gray-600">Ubicación</p>
                    <p className="text-gray-800">{asset.ubicacion}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 py-2 w-3/4"> {/* Ajusta el ancho de las líneas divisorias */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-gray-600">Modo de Adquisición</p>
                    <p className="text-gray-800">{asset.modoAdquisicion}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-gray-600">Precio</p>
                    <p className="text-gray-800">{asset.precio}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 py-2 w-3/4"> {/* Ajusta el ancho de las líneas divisorias */}
                <p className="text-sm font-semibold text-gray-600">Descripción</p>
                <p className="text-gray-800">{asset.descripcion}</p>
              </div>

              <div className="border-t border-gray-200 py-2 w-3/4"> {/* Ajusta el ancho de las líneas divisorias */}
                <p className="text-sm font-semibold text-gray-600">Observación</p>
                <p className="text-gray-800">{asset.observacion}</p>
              </div>
            </div>

            {/* Imagen del Activo */}
            <div className="flex-shrink-0 ml-4" style={{ marginLeft: '-100px' }}> {/* Movemos la imagen más hacia la izquierda */}
              <img
                src={asset.foto}
                alt="Foto del Activo"
                className="w-60 h-60 object-cover rounded-lg shadow-md border border-gray-200"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="absolute bottom-4 right-4 flex justify-end space-x-4">
            <button
              onClick={handleEditar}
              className="bg-blue-300 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-400 transition-all duration-300 flex items-center text-sm"
            >
              <FaEdit className="mr-2" /> Editar
            </button>
            <button
              onClick={handleExportar}
              className="bg-green-300 text-white py-1 px-3 rounded-lg shadow hover:bg-green-400 transition-all duration-300 flex items-center text-sm"
            >
              <FaFileExport className="mr-2" /> Exportar
            </button>
            <button
              onClick={handleGenerarSticker}
              className="bg-gray-300 text-white py-1 px-3 rounded-lg shadow hover:bg-gray-400 transition-all duration-300 flex items-center text-sm"
            >
              <FaTags className="mr-2" /> Generar Sticker
            </button>
            <button
              onClick={() => handleEliminar(asset.id)}
              className="bg-red-500 text-white py-1 px-3 rounded-lg shadow hover:bg-red-600 transition-all duration-300 flex items-center text-sm"
            >
              <FaTrash className="mr-2" /> Eliminar
            </button>
            <button
              onClick={onBack}
              className="bg-blue-500 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-300 flex items-center text-sm"
            >
              <FaArrowLeft className="mr-2" /> Volver
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
