import React, { useState } from 'react';
import { useActivos } from '../../hooks/useActivo'; // Hook para obtener activos
import { useAuth } from '../../hooks/AuthContext'; // Hook de autenticación para obtener la ubicación del docente
 // Hook para manejar préstamos
import { Ubicacion } from '../../types/ubicacion'; // Tipos
import { usePrestamo } from '../../hooks/usePrestamo';

interface SolicitarPrestamoProps {
  onClose: () => void;
  ubicaciones: Ubicacion[]; // Ubicaciones disponibles
}

const SolicitarPrestamo: React.FC<SolicitarPrestamoProps> = ({ onClose, ubicaciones }) => {
  const [activoId, setActivoId] = useState<number | null>(null);
  const [ubicacionDestinoId, setUbicacionDestinoId] = useState<number | null>(null);

  // Usamos el hook de activos para obtener todos los activos sin filtrar por ubicación
  const { activos, loading, error } = useActivos();

  // Obtenemos el contexto del usuario autenticado (Docente)
  const { ubicaciones: ubicacionesDocente } = useAuth(); // Esto debe incluir todas las ubicaciones del Docente

  // Hook para solicitar préstamo
  const { solicitarPrestamo, isLoadingSolicitarPrestamo, isErrorSolicitarPrestamo, isSuccessSolicitarPrestamo, errorSolicitarPrestamo } = usePrestamo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activoId && ubicacionDestinoId) {
      // Verificamos que las ubicaciones existan y que los activos estén definidos antes de intentar acceder a ellos
      const ubicacionOrigenId = ubicaciones?.find((ubicacion) => 
        ubicacion?.activos?.some((activo) => activo.id === activoId)
      )?.id || 0;
  
      // Solicitamos el préstamo y enviamos la ubicación destino seleccionada por el docente
      solicitarPrestamo({
        activo_id: activoId,
        ubicacion_origen_id: ubicacionOrigenId,
        ubicacion_destino_id: ubicacionDestinoId,
      });
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Solicitar Préstamo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Seleccionar Activo</label>
            {loading ? (
              <p>Cargando activos...</p>
            ) : (
              <select
                className="py-2 px-4 rounded-lg w-full"
                value={activoId || ''}
                onChange={(e) => setActivoId(Number(e.target.value))}
              >
                <option value="" disabled>-- Seleccione un activo --</option>
                {activos.map((activo) => (
                  <option key={activo.id} value={activo.id}>
                    {activo.nombre} (ID: {activo.id}) - Ubicación: {activo.ubicacionId}
                  </option>
                ))}
              </select>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Seleccionar Ubicación de Destino</label>
            <select
              className="py-2 px-4 rounded-lg w-full"
              value={ubicacionDestinoId || ''}
              onChange={(e) => setUbicacionDestinoId(Number(e.target.value))}
            >
              <option value="" disabled>-- Seleccione ubicación destino --</option>
              {ubicacionesDocente.map((ubicacion) => (
                <option key={ubicacion.id} value={ubicacion.id}>
                  {ubicacion.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-300 py-2 px-4 rounded-lg"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              disabled={isLoadingSolicitarPrestamo}
            >
              {isLoadingSolicitarPrestamo ? 'Solicitando...' : 'Solicitar Préstamo'}
            </button>
          </div>

          {isSuccessSolicitarPrestamo && <p className="text-green-500 mt-4">Préstamo solicitado con éxito.</p>}
          {isErrorSolicitarPrestamo && <p className="text-red-500 mt-4">Error al solicitar el préstamo: {errorSolicitarPrestamo?.message || 'Ha ocurrido un error.'}</p>}
        </form>
      </div>
    </div>
  );
};

export default SolicitarPrestamo;
