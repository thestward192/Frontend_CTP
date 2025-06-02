import { Activo } from '../../types/activo';
import { useActivos } from '../../hooks/useActivo';
import FormularioEditarActivo from './FormularioEditarActivo';
import { FaEdit, FaFileExport, FaTrash, FaFilePdf } from 'react-icons/fa';
import { X } from 'lucide-react';
import HistorialPrestamos from './HistorialPrestamos';
import { useState } from 'react';
import useBarcode from '../../hooks/useBarcode';
import { useExportToExcel } from '../../hooks/useExportToExcel';
import ActaBajaForm from './ActaBajaForm';
import html2canvas from 'html2canvas';
import { useLeyes } from '../../hooks/useLey';

interface DetalleComponentProps {
  asset: Activo;
  onBack: () => void;
}

const DetalleComponent: React.FC<DetalleComponentProps> = ({
  asset,
  onBack,
}) => {
  // Estados locales
  const [activeTab, setActiveTab] = useState<'detalle' | 'historial'>('detalle');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActaFormOpen, setIsActaFormOpen] = useState(false);
  const [showProveedorModal, setShowProveedorModal] = useState(false);

  // Hook para activos
  const { handleUpdateActivo, updateDisponibilidadActivoMutation } = useActivos();
  // Hook para generar código de barras
  const { barcodeUrl, loading: barcodeLoading, error: barcodeError } = useBarcode(
    asset.numPlaca?.toString() || ''
  );
  // Hook para exportar a Excel
  const { exportToExcel } = useExportToExcel();

  // Hook para obtener detalles de Ley
  const {
    selectedLey,
    getLeyDetails,
    loading: leyLoading,
    error: leyError,
  } = useLeyes();

  // Mensajes de estado
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Cuando el usuario hace clic en “Licitación”, abrimos el modal y pedimos la Ley
  const handleShowProveedor = async () => {
    setShowProveedorModal(true);

    // Si existe la licitación, pedimos detalles de la Ley asociada
    if (asset.licitacion && asset.licitacion.id) {
      await getLeyDetails(asset.licitacion.id);
    }
  };

  // Función para editar
  const handleEditar = () => {
    setIsEditModalOpen(true);
  };

  // Función para exportar a Excel
  const handleExportar = () => {
    exportToExcel([asset]);
  };

  // Función para descargar el código de barras como JPG
  const handleDownloadBarcode = async () => {
    const element = document.getElementById('barcode-container');
    if (!element) return;
    const canvas = await html2canvas(element);
    const dataUrl = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `barcode_${asset.numPlaca || 'unknown'}.jpg`;
    link.click();
  };

  // Función para cambiar disponibilidad (dar de baja)
  const handleUpdateDisponibilidad = async (id: number) => {
    if (asset.disponibilidad === 'Dado de Baja') {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }
    try {
      await updateDisponibilidadActivoMutation.mutateAsync(id);
      setShowCompletedMessage(true);
      setTimeout(() => setShowCompletedMessage(false), 3000);
      setShowDeleteConfirmation(false);
    } catch {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  // Función para guardar la edición
  const handleSaveEdit = async (updatedData: Partial<Activo>) => {
    try {
      if (asset.id) {
        await handleUpdateActivo({ id: asset.id, data: updatedData });
        setIsEditModalOpen(false);
        onBack();
      }
    } catch (error) {
      console.error('Error al guardar los cambios del activo:', error);
    }
  };

  // Cuando el modal se cierra, resetear cualquier estado local
  const handleClose = () => {
    setShowProveedorModal(false);
    setIsEditModalOpen(false);
    setIsActaFormOpen(false);
    setShowDeleteConfirmation(false);
    onBack();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      ></div>

      {/* Contenedor principal */}
      <div className="bg-white rounded-lg p-6 relative overflow-auto max-h-[90vh] w-[90vw] max-w-6xl">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Detalle del Activo
          </h1>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Pestañas (Detalle / Historial) */}
        <div className="border-b pb-2 mb-2">
          <nav className="flex space-x-4">
            <button
              className={`px-3 py-1 font-bold text-sm transition-colors duration-300 ${
                activeTab === 'detalle'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('detalle')}
            >
              Detalle
            </button>
            <button
              className={`px-3 py-1 font-bold text-sm transition-colors duration-300 ${
                activeTab === 'historial'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('historial')}
            >
              Historial de Préstamos
            </button>
          </nav>
        </div>

        {/* Botones de acción arriba */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={handleEditar}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md flex items-center text-sm transition-all duration-300"
          >
            <FaEdit className="mr-1" /> Editar
          </button>
          <button
            onClick={handleExportar}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-md flex items-center text-sm transition-all duration-300"
          >
            <FaFileExport className="mr-1" /> Exportar
          </button>
          
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md flex items-center text-sm"
          >
            <FaTrash className="mr-1" /> Dar de baja
          </button>
        </div>

        {/* Contenido de la pestaña “Detalle” o “Historial” */}
        {activeTab === 'detalle' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna Izquierda */}
              <div className="space-y-4">
                {/* Imagen del activo */}
                <img
                  src={asset.foto}
                  alt="Foto del Activo"
                  className="mx-auto w-3/4 h-auto object-contain rounded-md shadow-sm border border-gray-200"
                />

                {/* Ubicación / Licitación */}
                <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
                  <h2 className="text-base font-semibold text-gray-700 mb-3">
                    Ubicación / Licitación
                  </h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Ubicación
                      </p>
                      <p className="text-gray-800">
                        {asset.ubicacion?.nombre || 'Desconocida'}
                      </p>
                    </div>
                    {asset.licitacion && (
                      <div>
                        <p className="text-xs font-medium text-gray-600">
                          Licitación
                        </p>
                        <p
                          className="text-blue-600 cursor-pointer"
                          onClick={handleShowProveedor}
                        >
                          {asset.licitacion.nombre}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Estado / Precio */}
                <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
                  <h2 className="text-base font-semibold text-gray-700 mb-3">
                    Estado y Precio
                  </h2>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Estado
                      </p>
                      <p className="text-gray-800">{asset.estado}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Disponibilidad
                      </p>
                      <p className="text-gray-800">{asset.disponibilidad}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Precio
                      </p>
                      <p className="text-gray-800">
                        {/*
                          1. Si asset.precio es null/undefined => “N/A”
                          2. Si asset.precio === 0 => “Donación”
                          3. En otro caso => lo formateamos con toLocaleString
                        */}
                        {asset.precio == null
                          ? 'N/A'
                          : asset.precio === 0
                          ? 'Donación'
                          : (asset.moneda === 'CRC' ? '₡' : '$') +
                            asset.precio.toLocaleString('es-CR', {
                              style: 'currency',
                              currency:
                                asset.moneda === 'CRC' ? 'CRC' : 'USD',
                            })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="space-y-4">
                {/* Datos Básicos */}
                <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
                  <h2 className="text-base font-semibold text-gray-700 mb-3">
                    Datos Básicos
                  </h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Identificador
                      </p>
                      <p className="text-gray-800">{asset.numPlaca}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">Marca</p>
                      <p className="text-gray-800">{asset.marca}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">Modelo</p>
                      <p className="text-gray-800">
                        {asset.modelo || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">Serie</p>
                      <p className="text-gray-800">
                        {asset.serie || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Descripción / Observación */}
                <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
                  <h2 className="text-base font-semibold text-gray-700 mb-3">
                    Descripción / Observación
                  </h2>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Descripción
                      </p>
                      <p className="text-gray-800">
                        {asset.descripcion || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Observación
                      </p>
                      <p className="text-gray-800">
                        {asset.observacion || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Código de Barras */}
                <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
                  <h2 className="text-base font-semibold text-gray-700 mb-3">
                    Código de Barras
                  </h2>
                  {barcodeLoading ? (
                    <p className="text-sm">Cargando código de barras...</p>
                  ) : barcodeError ? (
                    <p className="text-sm text-red-500">Error: {barcodeError}</p>
                  ) : barcodeUrl ? (
                    <div className="flex flex-col items-start">
                      <div
                        id="barcode-container"
                        className="bg-white p-2 mb-2"
                      >
                        <img
                          src={barcodeUrl}
                          alt={`Código de barras para ${asset.numPlaca}`}
                          className="w-56 h-16 object-contain"
                        />
                      </div>
                      <p className="text-xs font-medium text-gray-800 mb-2">
                        Placa: {asset.numPlaca}
                      </p>
                      <button
                        onClick={handleDownloadBarcode}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-md text-xs transition-all duration-300"
                      >
                        Descargar (JPG)
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        ) : (
          <HistorialPrestamos activoId={asset.id!} />
        )}

        {/* ------------------------------------------------------------
            Modal de “Proveedor + Ley” (un solo modal para ambos)
        ------------------------------------------------------------ */}
        {showProveedorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
            <div className="bg-white p-6 rounded-md shadow-lg w-80 max-h-[80vh] overflow-y-auto">
              {/* Título del modal */}
              <h2 className="text-base font-semibold text-gray-700 border-b pb-2 mb-3">
                Detalles del Proveedor
              </h2>

              {/* Sección Proveedor */}
              <div className="space-y-2 text-gray-800 text-xs mb-4">
                <p>
                  <strong>Empresa:</strong>{' '}
                  {asset.licitacion?.proveedor?.nombreEmpresa || 'No disponible'}
                </p>
                <p>
                  <strong>Vendedor:</strong>{' '}
                  {asset.licitacion?.proveedor?.vendedor || 'No disponible'}
                </p>
                <p>
                  <strong>Teléfono Empresa:</strong>{' '}
                  {asset.licitacion?.proveedor?.telefonoEmpresa || 'No disponible'}
                </p>
                <p>
                  <strong>Teléfono Proveedor:</strong>{' '}
                  {asset.licitacion?.proveedor?.telefonoProveedor ||
                    'No disponible'}
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  {asset.licitacion?.proveedor?.email || 'No disponible'}
                </p>
              </div>

              {/* Sección Ley */}
              <div className="space-y-2 text-gray-800 text-xs">
                <h3 className="text-base font-semibold text-gray-700 border-b pb-2 mb-3">
                  Fuente Financiera
                </h3>

                {leyLoading ? (
                  <p className="text-gray-600 text-xs">Cargando información de Ley...</p>
                ) : leyError ? (
                  <p className="text-red-500 text-xs">Error al cargar la Ley.</p>
                ) : selectedLey ? (
                  <>
                    <p>
                      <strong>Num. Ley:</strong> {selectedLey.numLey}
                    </p>
                    <p>
                      <strong>Nombre:</strong> {selectedLey.nombre}
                    </p>
                    <p>
                      <strong>Detalle:</strong> {selectedLey.detalle}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-600 text-xs">No hay datos de Ley disponibles.</p>
                )}
              </div>

              {/* Botón Cerrar */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowProveedorModal(false)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md transition-all duration-300 text-xs"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------
            Modal de Confirmación “Dar de baja”
        ------------------------------------------------------------ */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center z-[60]">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowDeleteConfirmation(false)}
            ></div>
            <div className="bg-white p-8 rounded-lg shadow-lg w-[400px] relative">
              <h2 className="text-lg font-bold mb-4">Dar de Baja el Activo</h2>
              <p>¿Seguro quieres marcar este activo como "Dado de baja"?</p>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  onClick={() => handleUpdateDisponibilidad(asset.id!)}
                >
                  Confirmar
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------
            Toasts de confirmación / error
        ------------------------------------------------------------ */}
        {showCompletedMessage && (
          <div className="fixed top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulse z-[70]">
            Activo marcado como Dado de baja.
          </div>
        )}

        {showErrorMessage && (
          <div className="fixed top-10 right-10 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-slideInOutAndPulseError z-[70]">
            El Activo ya está Dado de baja.
          </div>
        )}

        {/* ------------------------------------------------------------
            Modales Adicionales (Acta, Editar)
        ------------------------------------------------------------ */}
        {isActaFormOpen && (
          <div className="z-[60]">
            <ActaBajaForm onClose={() => setIsActaFormOpen(false)} />
          </div>
        )}
        {isEditModalOpen && (
          <div className="z-[60]">
            <FormularioEditarActivo
              asset={asset}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleSaveEdit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleComponent;
