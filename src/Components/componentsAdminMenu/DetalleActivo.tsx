import { Activo } from '../../types/activo';
import { useActivos } from '../../hooks/useActivo';
import FormularioEditarActivo from './FormularioEditarActivo';
import { FaArrowLeft, FaEdit, FaFileExport, FaTags, FaTrash, FaFilePdf } from 'react-icons/fa';
import HistorialPrestamos from './HistorialPrestamos';
import { useEffect, useState } from 'react';
import useBarcode from '../../hooks/useBarcode';
import { useExportToExcel } from '../../hooks/useExportToExcel';
import ActaBajaForm from './ActaBajaForm';
import html2canvas from 'html2canvas';

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
  const [showProveedorModal, setShowProveedorModal] = useState(false);

  // Hook para generar el código de barras usando numPlaca
  const { barcodeUrl, loading, error } = useBarcode(asset.numPlaca.toString());
  const { exportToExcel } = useExportToExcel();


  useEffect(() => {
    console.log("Estado de showProveedorModal cambió:", showProveedorModal);
  }, [showProveedorModal]);


  const handleDownloadBarcode = async () => {
    // Capturamos el contenedor por ID
    const element = document.getElementById('barcode-container');
    if (!element) return;

    const canvas = await html2canvas(element);
    const dataUrl = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `barcode_${asset.numPlaca}.jpg`;
    link.click();
  };

  const handleShowProveedor = async () => {
    console.log("Clic en Ver Proveedor");

    if (!asset.licitacion?.proveedor) {
      console.log("No hay proveedor asociado.");
      return;
    }

    console.log("Datos del proveedor:", asset.licitacion.proveedor);

    setTimeout(() => {
      setShowProveedorModal(true);
      console.log("Estado actualizado a true después del timeout.");
    }, 0);
  };




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

              {asset.licitacion && (
                <div className="border-t border-gray-200 py-2 w-full">
                  <p className="text-sm font-semibold text-gray-600">Licitación</p>
                  <p className="text-gray-800 cursor-pointer text-blue-600" onClick={handleShowProveedor}>
                    {asset.licitacion.nombre}
                  </p>
                </div>
              )}

              {showProveedorModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                    {/* Encabezado */}
                    <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                      Detalles del Proveedor
                    </h2>

                    {/* Contenido con Espaciado */}
                    <div className="space-y-4 text-gray-800">
                      <p><strong>📌 Nombre de Empresa:</strong> {asset.licitacion?.proveedor?.nombreEmpresa || "No disponible"}</p>
                      <p><strong>👤 Nombre de Vendedor:</strong> {asset.licitacion?.proveedor?.vendedor || "No disponible"}</p>
                      <p><strong>📞 Teléfono de Empresa:</strong> {asset.licitacion?.proveedor?.telefonoEmpresa || "No disponible"}</p>
                      <p><strong>📱 Teléfono del Proveedor:</strong> {asset.licitacion?.proveedor?.telefonoProveedor || "No disponible"}</p>
                      <p><strong>✉️ Email:</strong> {asset.licitacion?.proveedor?.email || "No disponible"}</p>
                    </div>

                    {/* Botón de Cerrar */}
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setShowProveedorModal(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition-all duration-300"
                      >
                        Cerrar
                      </button>
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
                      {/* 3) Envuelve el código de barras en un div con ID */}
                      <div id="barcode-container" className="mt-2 inline-block bg-white p-2">
                        <img
                          src={barcodeUrl}
                          alt={`Código de barras para ${asset.numPlaca}`}
                          className="w-60 h-20 object-contain"
                        />
                      </div>
                      <p className="text-sm font-semibold text-gray-800 mt-2">
                        Número de Placa: {asset.numPlaca}
                      </p>

                      {/* Botón para descargar en JPG */}
                      <button
                        onClick={handleDownloadBarcode}
                        className="bg-blue-500 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-300 mt-2"
                      >
                        Descargar Código de Barras (JPG)
                      </button>
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
      )
      }

      {
        isEditModalOpen && (
          <FormularioEditarActivo
            asset={asset}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveEdit}
          />
        )
      }
    </div >
  );
};

export default DetalleComponent;
