import React, { useEffect } from 'react';
import { usePrestamo } from '../../hooks/usePrestamo';

interface HistorialPrestamosProps {
  activoId: number;
}

const HistorialPrestamos: React.FC<HistorialPrestamosProps> = ({ activoId }) => {
  const { prestamos, fetchPrestamosByActivo, loading } = usePrestamo();

  useEffect(() => {
    if (activoId) {
      fetchPrestamosByActivo(activoId);
    }
  }, [activoId]);

  return (
    <div className="w-full min-h-[600px] flex flex-col">
      <h2 className="text-xl font-bold mb-4">Historial de Préstamos</h2>

      <div className="flex-grow flex flex-col">
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500">Cargando historial...</p>
          </div>
        ) : prestamos.length > 0 ? (
          <div className="flex-grow overflow-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">Prestador</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Receptor</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Desde (Ubicación Actual)</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Hacia (Nueva Ubicación)</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Fecha Préstamo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Fecha Devolución</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.map((prestamo) => (
                  <tr key={prestamo.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">
                      {prestamo.prestadoPor
                        ? `${prestamo.prestadoPor.nombre} ${prestamo.prestadoPor.apellido_1}`
                        : 'Desconocido'}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {prestamo.prestadoA
                        ? `${prestamo.prestadoA.nombre} ${prestamo.prestadoA.apellido_1}`
                        : 'Desconocido'}
                    </td>
                    <td className="px-4 py-2 text-sm">{prestamo.ubicacionActual?.nombre || 'Desconocida'}</td>
                    <td className="px-4 py-2 text-sm">{prestamo.ubicacion?.nombre || 'Desconocida'}</td>
                    <td className="px-4 py-2 text-sm">{new Date(prestamo.fechaPrestamo).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm">
                      {prestamo.fechaDevolucion && prestamo.fechaDevolucion !== prestamo.fechaPrestamo ? (
                        new Date(prestamo.fechaDevolucion).toLocaleDateString()
                      ) : (
                        'No devuelto'
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-green-800">{prestamo.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500">No hay historial de préstamos para este activo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialPrestamos;
