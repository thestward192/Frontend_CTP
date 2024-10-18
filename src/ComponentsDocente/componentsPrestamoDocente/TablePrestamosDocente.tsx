import React, { useEffect, useState } from 'react';
import { usePrestamo } from '../../hooks/usePrestamo';
import { useAuth } from '../../hooks/AuthContext';
import PrestamoModal from './PrestamoModal'; // Componente para mostrar el modal

const TablePrestamosDocente: React.FC = () => {
  const { prestamos, loading, fetchPrestamosByUbicacion, fetchPrestamosByUsuario, handleUpdatePrestamoEstado, handleDeletePrestamo } = usePrestamo();
  const { ubicaciones, isAuthenticated, usuarioId } = useAuth();
  const [activeTab, setActiveTab] = useState<'hechos' | 'recibidos'>('hechos');
  const [selectedPrestamo, setSelectedPrestamo] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'hechos') {
        fetchPrestamosByUsuario(usuarioId);
      } else if (ubicaciones.length > 0) {
        fetchPrestamosByUbicacion(ubicaciones[0].id);
      }
    }
  }, [activeTab, ubicaciones, isAuthenticated, usuarioId]);

  const handleSelectPrestamo = (prestamo: any) => {
    setSelectedPrestamo(prestamo);
  };

  const handleCloseModal = () => {
    setSelectedPrestamo(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este préstamo?')) {
      await handleDeletePrestamo(id);
    }
  };

  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column' }}
      >
        {/* Pestañas */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-6 py-2 font-bold text-sm transition-colors duration-300 ${activeTab === 'hechos' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('hechos')}
          >
            Préstamos Hechos
          </button>
          <button
            className={`px-6 py-2 font-bold text-sm transition-colors duration-300 ${activeTab === 'recibidos' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('recibidos')}
          >
            Préstamos Recibidos
          </button>
        </div>

        {/* Contenido de las pestañas */}
        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div>Cargando préstamos...</div>
          ) : activeTab === 'hechos' ? (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">Activo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Prestado A</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Fecha de Préstamo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.map((prestamo) => (
                  <tr key={prestamo.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{prestamo.activo?.nombre || 'Sin nombre'}</td>
                    <td className="px-4 py-2 text-sm">{prestamo.prestadoA?.nombre || 'Desconocido'}</td>
                    <td className="px-4 py-2 text-sm">{new Date(prestamo.fechaPrestamo).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-3 py-1 rounded-md text-sm ${prestamo.estado === 'En préstamo' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                      >
                        {prestamo.estado}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2" onClick={() => handleSelectPrestamo(prestamo)}>Ver Detalles</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded-md" onClick={() => handleDelete(prestamo.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">Activo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Prestado Por</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Fecha de Préstamo</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.map((prestamo) => (
                  <tr key={prestamo.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm">{prestamo.activo?.nombre || 'Sin nombre'}</td>
                    <td className="px-4 py-2 text-sm">{prestamo.prestadoPor?.nombre || 'Desconocido'}</td>
                    <td className="px-4 py-2 text-sm">{new Date(prestamo.fechaPrestamo).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-3 py-1 rounded-md text-sm ${prestamo.estado === 'En préstamo' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                      >
                        {prestamo.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal para actualizar estado del préstamo */}
        {selectedPrestamo && activeTab === 'hechos' && (
          <PrestamoModal
            prestamo={selectedPrestamo}
            onClose={handleCloseModal}
            onUpdateEstado={handleUpdatePrestamoEstado}
          />
        )}
      </div>
    </div>
  );
};

export default TablePrestamosDocente;