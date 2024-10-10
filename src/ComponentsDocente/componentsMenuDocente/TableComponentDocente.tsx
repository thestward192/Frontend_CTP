import React, { useState, useEffect } from 'react';
import { useActivos } from '../../hooks/useActivo';
import { useAuth } from '../../hooks/AuthContext';
import DetalleActivoDocente from './DetalleActivoDocente';
import SolicitarPrestamo from './SolicitarPrestamo'; // Importamos el nuevo componente
import { Activo } from '../../types/activo'; // Asegúrate de tener un tipo definido para Activo


const TableComponentDocente: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { activos, loading, fetchActivosByUbicacion } = useActivos();
  const { ubicaciones } = useAuth();
  const [selectedUbicacion, setSelectedUbicacion] = useState<number | null>(null);
  const [selectedActivo, setSelectedActivo] = useState<Activo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrestamoModalOpen, setIsPrestamoModalOpen] = useState(false); // Para manejar el modal del préstamo

  const [filterEstado, setFilterEstado] = useState('');
  const [filterMarca, setFilterMarca] = useState('');
  const [filterNombre, setFilterNombre] = useState('');

  useEffect(() => {
    if (ubicaciones && ubicaciones.length > 0 && selectedUbicacion === null) {
      const defaultUbicacionId = ubicaciones[0].id;
      setSelectedUbicacion(defaultUbicacionId);
      fetchActivosByUbicacion(defaultUbicacionId);
    }
  }, [ubicaciones, selectedUbicacion]);
  

  useEffect(() => {
    if (selectedUbicacion !== null) {
      fetchActivosByUbicacion(selectedUbicacion);
    }
  }, [selectedUbicacion]);
  

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUbicacionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUbicacion(parseInt(event.target.value, 10));
  };

  const handleRowClick = (activo: Activo) => {
    setSelectedActivo(activo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openPrestamoModal = () => {
    setIsPrestamoModalOpen(true); // Abrir el modal para solicitar préstamo
  };

  const closePrestamoModal = () => {
    setIsPrestamoModalOpen(false); // Cerrar el modal
  };

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const filteredActivos = activos.filter(activo =>
    (filterEstado === '' || activo.estado === filterEstado) &&
    (filterMarca === '' || activo.marca.toLowerCase().includes(filterMarca.toLowerCase())) &&
    (filterNombre === '' || activo.nombre.toLowerCase().includes(filterNombre.toLowerCase()))
  );



  const paginatedData = filteredActivos.slice(startIndex, startIndex + itemsPerPage);

  

  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="text-lg font-semibold text-black mr-4">Seleccione una ubicación:</div>
            <select
              className="py-2 px-4 rounded-lg shadow bg-gray-200 text-gray-800"
              value={selectedUbicacion || ''}
              onChange={handleUbicacionSelect}
            >
              <option value="" disabled>-- Seleccione --</option>
              {ubicaciones.map((ubicacion) => (
                <option key={ubicacion.id} value={ubicacion.id}>
                  {ubicacion.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <input
              type="text"
              className="py-2 px-4 rounded-lg shadow bg-gray-200 text-gray-800"
              placeholder="Filtrar por nombre"
              value={filterNombre}
              onChange={(e) => setFilterNombre(e.target.value)}
            />
            <input
              type="text"
              className="py-2 px-4 rounded-lg shadow bg-gray-200 text-gray-800"
              placeholder="Filtrar por marca"
              value={filterMarca}
              onChange={(e) => setFilterMarca(e.target.value)}
            />
            <select
              className="py-2 px-4 rounded-lg shadow bg-gray-200 text-gray-800"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
              <option value="Dañado">Dañado</option>
            </select>
          </div>

          {/* Botón para abrir el modal de Solicitar Préstamo */}
          <button
            onClick={openPrestamoModal}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Solicitar Préstamo
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div>Cargando activos...</div>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-gray-600 font-semibold">No. Identificador</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Marca</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Serie</th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowClick(row)}
                  >
                    <td className="px-4 py-2 text-sm">{row.id}</td>
                    <td className="px-4 py-2 text-sm">{row.nombre}</td>
                    <td className="px-4 py-2 text-sm">{row.marca}</td>
                    <td className="px-4 py-2 text-sm">{row.serie}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-3 py-1 rounded-md text-sm ${row.estado === 'Bueno' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {row.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-600">Total de Activos: {filteredActivos.length}</p>
          </div>
          <div className="flex space-x-1">
            <button
              className="px-3 py-1 bg-gray-200 rounded-md"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            
            {Array.from({ length: Math.ceil(filteredActivos.length / itemsPerPage) }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 bg-gray-200 rounded-md"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredActivos.length / itemsPerPage)}
            >
              &gt;
            </button>
          </div>
        </div>

        {isModalOpen && selectedActivo && (
          <DetalleActivoDocente
            activo={selectedActivo}
            onClose={closeModal}
          />
        )}

        {isPrestamoModalOpen && (
          <SolicitarPrestamo onClose={closePrestamoModal} ubicaciones={[ubicaciones]}  />
        )}
      </div>
    </div>
  );
};

export default TableComponentDocente;
