import React, { useState, useEffect } from 'react';
import { usePrestamo } from '../../hooks/usePrestamo';

const ReportesPrestamosComponent: React.FC = () => {
  const { prestamos, loading, error } = usePrestamo();
  const [filteredPrestamos, setFilteredPrestamos] = useState(prestamos);
  const [filterNombre, setFilterNombre] = useState('');
  const [filterPlaca, setFilterPlaca] = useState('');
  const [filterUbicacion, setFilterUbicacion] = useState('');

  // Actualiza los préstamos filtrados cuando se cambia el filtro o los préstamos originales
  useEffect(() => {
    let prestamosFiltrados = prestamos;

    // Filtrar por nombre (prestado por o prestado a)
    if (filterNombre) {
      prestamosFiltrados = prestamosFiltrados.filter((prestamo) =>
        `${prestamo.prestadoPor.nombre} ${prestamo.prestadoPor.apellido_1}`.toLowerCase().includes(filterNombre.toLowerCase()) ||
        `${prestamo.prestadoA.nombre} ${prestamo.prestadoA.apellido_1}`.toLowerCase().includes(filterNombre.toLowerCase())
      );
    }

    // Filtrar por número de placa del activo
    if (filterPlaca) {
      prestamosFiltrados = prestamosFiltrados.filter((prestamo) =>
        prestamo.activo.numPlaca?.toLowerCase().includes(filterPlaca.toLowerCase())
      );
    }

    // Filtrar por ubicación (ubicación actual o nueva)
    if (filterUbicacion) {
      prestamosFiltrados = prestamosFiltrados.filter((prestamo) =>
        prestamo.ubicacion.nombre.toLowerCase().includes(filterUbicacion.toLowerCase()) ||
        prestamo.ubicacionActual.nombre.toLowerCase().includes(filterUbicacion.toLowerCase())
      );
    }

    setFilteredPrestamos(prestamosFiltrados);
  }, [filterNombre, filterPlaca, filterUbicacion, prestamos]);

  return (
    <div className="w-full flex justify-center py-10">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Reporte de Préstamos</h2>

          {/* Filtros */}
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Filtrar por nombre"
              className="border px-3 py-2 rounded-md"
              value={filterNombre}
              onChange={(e) => setFilterNombre(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por número de placa"
              className="border px-3 py-2 rounded-md"
              value={filterPlaca}
              onChange={(e) => setFilterPlaca(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por ubicación"
              className="border px-3 py-2 rounded-md"
              value={filterUbicacion}
              onChange={(e) => setFilterUbicacion(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-red-500">Error al cargar préstamos: {error}</p>}
        {loading ? (
          <p>Cargando préstamos...</p>
        ) : (
          <div className="flex-grow overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">Activo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Número de Placa</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Prestado Por</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Prestado A</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Ubicación Actual</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Ubicación Nueva</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Fecha Préstamo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Fecha Devolución</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrestamos.map((prestamo) => (
                  <tr key={prestamo.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{prestamo.activo.nombre}</td>
                    <td className="px-4 py-2 text-sm">{prestamo.activo.numPlaca || 'Sin placa'}</td>
                    <td className="px-4 py-2 text-sm">{prestamo.prestadoPor.nombre}</td>
                    <td className="px-4 py-2 text-sm">{prestamo.prestadoA.nombre}</td>
                    <td className="px-4 py-2 text-sm">{prestamo.ubicacionActual.nombre}</td>
                    <td className="px-4 py-2 text-sm">{prestamo.ubicacion.nombre}</td>
                    <td className="px-4 py-2 text-sm">{new Date(prestamo.fechaPrestamo).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm">
                      {prestamo.fechaDevolucion
                        ? new Date(prestamo.fechaDevolucion).toLocaleDateString()
                        : 'No devuelto'}
                    </td>
                    <td className="px-4 py-2 text-sm">{prestamo.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportesPrestamosComponent;
