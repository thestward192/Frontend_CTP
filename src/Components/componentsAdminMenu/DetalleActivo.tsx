import React from 'react';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';

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
  const handleEliminar = (id: string) => {
    console.log('Eliminar activo', id);
    // Lógica para eliminar el activo
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-8 space-y-8 overflow-auto" style={{ maxHeight: '80vh' }}>
      <div className="flex justify-between items-start w-full">
        <div className="flex items-start space-x-8 w-full">
          {/* Imagen del activo */}
          <div className="flex-shrink-0">
            <img src={asset.foto} alt="Foto del Activo" className="w-40 h-40 object-cover rounded-lg" />
          </div>
          {/* Datos del activo en una fila */}
          <div className="grid grid-cols-2 gap-6 text-sm leading-6 w-full">
            <div>
              <p><strong>No. Identificador:</strong> {asset.id}</p>
              <p><strong>Descripción:</strong> {asset.descripcion}</p>
              <p><strong>Marca:</strong> {asset.marca}</p>
              <p><strong>Modelo:</strong> {asset.modelo}</p>
            </div>
            <div>
              <p><strong>Serie:</strong> {asset.serie}</p>
              <p><strong>Estado:</strong> {asset.estado}</p>
              <p><strong>Ubicación:</strong> {asset.ubicacion}</p>
              <p><strong>Modo de Adquisición:</strong> {asset.modoAdquisicion}</p>
              <p><strong>Precio:</strong> {asset.precio}</p>
              <p><strong>Observación:</strong> {asset.observacion}</p>
            </div>
          </div>
        </div>

        {/* Botón de eliminar */}
        <button
          onClick={() => handleEliminar(asset.id)}
          className="bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-700 transition flex items-center"
        >
          <FaTrash className="mr-2" /> Eliminar Activo
        </button>
      </div>

      {/* Botón para volver a la tabla */}
      <button
        onClick={onBack}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition flex items-center"
      >
        <FaArrowLeft className="mr-2" /> Volver a la tabla principal
      </button>

      {/* Historial de Préstamos */}
      <div className="mt-4 w-full">
        <h2 className="text-xl font-bold">Historial Préstamos</h2>
        <div className="mt-4 space-y-4 overflow-y-auto max-h-40">
          {/* Ejemplo de cada préstamo */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p><strong>Ana</strong></p>
            <p>Prestador: Ana Laboratorio#1</p>
            <p>Prestada: Pablo Laboratorio#2</p>
            <p>Tiempo: 3 Días</p>
            <p><strong>Estado: En Préstamo</strong></p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p><strong>Pablo</strong></p>
            <p>Prestador: Ana Laboratorio#1</p>
            <p>Prestada: Pablo Laboratorio#2</p>
            <p>Tiempo: 3 Días</p>
            <p><strong>Estado: No Devuelto</strong></p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p><strong>Marco</strong></p>
            <p>Prestador: Ana Laboratorio#1</p>
            <p>Prestada: Pablo Laboratorio#2</p>
            <p>Tiempo: 3 Días</p>
            <p><strong>Estado: Devuelto</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleComponent;
