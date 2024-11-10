import { Activo } from '../../types/activo';
import { useActivos } from '../../hooks/useActivo';
import FormularioEditarActivo from './FormularioEditarActivo';
import { FaArrowLeft, FaEdit, FaFileExport, FaTags, FaTrash, FaFilePdf } from 'react-icons/fa';
import HistorialPrestamos from './HistorialPrestamos';
import { useState } from 'react';
import useBarcode from '../../hooks/useBarcode';
import { useExportToExcel } from '../../hooks/useExportToExcel';
import ActaBajaForm from './ActaBajaForm';

interface DetalleComponentProps {
  asset: Activo;
  onBack: () => void;
}

const DetalleComponent: React.FC<DetalleComponentProps> = ({ asset, onBack }) => {
  const [activeTab, setActiveTab] = useState('detalle');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSticker, setShowSticker] = useState(false);
  const { handleDeleteActivo, handleUpdateActivo } = useActivos();
  const [isActaFormOpen, setIsActaFormOpen] = useState(false);

  // Hook para generar el código de barras usando numPlaca
  const { barcodeUrl, loading, error } = useBarcode(asset.numPlaca.toString());
  const { exportToExcel } = useExportToExcel();

  const handleEliminar = async (id: number) => {
    try {
      await handleDeleteActivo(id);
      onBack();
    } catch (error) {
      console.error('Error al eliminar el activo:', error);
    }
  };

  const handleEditar = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData: Partial<Activo>) => {
    try {
      await handleUpdateActivo({ id: asset.id!, data: updatedData });
      setIsEditModalOpen(false);
      onBack();
    } catch (error) {
      console.error('Error al guardar los cambios del activo:', error);
    }
  };

  const handleExportar = () => {
    exportToExcel([asset]);
  };

  const handleGenerarSticker = () => {
    setShowSticker(true);
  };

  return (
    <div className="w-full h-full bg-white shadow-lg rounded-lg p-6 overflow-hidden relative" style={{ height: 'calc(100vh - 180px)' }}>
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 font-bold text-sm transition-colors duration-300 ${activeTab === 'detalle' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
          onClick={() => setActiveTab('detalle')}
        >
          Detalle de Activo
        </button>
        <button
          className={`px-6 py-2 font-bold text-sm transition-colors duration-300 ${activeTab === 'historial' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
          onClick={() => setActiveTab('historial')}
        >
          Historial de Préstamos
        </button>
      </div>

      {activeTab === 'detalle' ? (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Información del Activo</h2>
            <p className="text-sm text-gray-500">Detalles generales y estado del activo.</p>
          </div>

          <div className="flex justify-between">
            <div className="flex-grow">
              {/* Reemplazamos id por numPlaca en el campo de No. Identificador */}
              <div className="border-t border-gray-200 py-2 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-gray-600">No. Identificador</p>
                    <p className="text-gray-800">{asset.numPlaca}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-gray-600">Marca</p>
                    <p className="text-gray-800">{asset.marca}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 py-2 w-full">
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

              <div className="border-t border-gray-200 py-2 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-gray-600">Ubicación</p>
                    <p className="text-gray-800">{asset.ubicacion?.nombre || 'Desconocida'}</p>
                  </div>
                </div>
              </div>

              {asset.modoAdquisicion === 'Ley' && asset.licitacion && (
                <div className="border-t border-gray-200 py-2 w-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <p className="text-sm font-semibold text-gray-600">Licitación</p>
                      <p className="text-gray-800">{asset.licitacion.nombre}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm font-semibold text-gray-600">Ley Asociada</p>
                      <p className="text-gray-800">{asset.licitacion.ley?.nombre || 'No disponible'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 py-2 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-gray-600">Estado</p>
                    <p className="text-gray-800">{asset.estado}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-gray-600">Disponibilidad</p>
                    <p className="text-gray-800">{asset.disponibilidad}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 py-2 w-full">
                <p className="text-sm font-semibold text-gray-600">Precio</p>
                <p className="text-gray-800">{asset.precio ? `$${asset.precio.toFixed(2)}` : 'No disponible'}</p>
              </div>

              <div className="border-t border-gray-200 py-2 w-full">
                <p className="text-sm font-semibold text-gray-600">Descripción</p>
                <p className="text-gray-800">{asset.descripcion}</p>
              </div>

              <div className="border-t border-gray-200 py-2 w-full">
                <p className="text-sm font-semibold text-gray-600">Observación</p>
                <p className="text-gray-800">{asset.observacion}</p>
              </div>

              {showSticker && (
                <div className="border-t border-gray-200 py-2 w-3/4">
                  <h3 className="text-sm font-semibold text-gray-600">Sticker del Activo</h3>
                  {loading ? (
                    <p>Cargando código de barras...</p>
                  ) : error ? (
                    <p>Error al generar el sticker: {error}</p>
                  ) : barcodeUrl ? (
                    <div>
                      <img src={barcodeUrl} alt={`Código de barras para ${asset.numPlaca}`} className="w-60 h-20 object-contain mt-2" />
                      <p className="text-sm font-semibold text-gray-800 mt-2">Número de Placa: {asset.numPlaca}</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 ml-4">
              <img
                src={asset.foto}
                alt="Foto del Activo"
                className="w-60 h-60 object-cover rounded-lg shadow-md border border-gray-200"
              />
            </div>
          </div>

          {showDeleteConfirmation && (
            <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg z-20">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">¿Deseas eliminar este activo?</h2>
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="bg-gray-500 text-white py-1 px-3 rounded-lg shadow hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleEliminar(asset.id!)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg shadow hover:bg-red-600 transition-all duration-300"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}

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
              onClick={() => setIsActaFormOpen(true)}
              className="bg-red-500 text-white py-1 px-3 rounded-lg shadow hover:bg-red-600 transition-all duration-300 flex items-center text-sm"
            >
              <FaFilePdf className="mr-2" /> Acta de Baja
            </button>
            <button
              onClick={handleGenerarSticker}
              className="bg-gray-300 text-white py-1 px-3 rounded-lg shadow hover:bg-gray-400 transition-all duration-300 flex items-center text-sm"
            >
              <FaTags className="mr-2" /> Generar Sticker
            </button>
            <button
              onClick={() => setShowDeleteConfirmation(true)}
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
          {isActaFormOpen && <ActaBajaForm onClose={() => setIsActaFormOpen(false)} />}
        </>
      ) : (
        <HistorialPrestamos activoId={asset.id!} />
      )}

      {isEditModalOpen && (
        <FormularioEditarActivo
          asset={asset}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default DetalleComponent;
