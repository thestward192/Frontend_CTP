import React, { useState } from 'react';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import FormularioDocente from './FormularioDocente'; // Importamos el formulario
import DetailDocente from './DetailDocente'; // Importamos el componente de detalles

interface Docente {
  imagen: string;
  nombre: string;
  apellido: string;
  email: string;
  ubicacion: string;
}

const DocentesComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la apertura del modal de creación
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null); // Estado para manejar el docente seleccionado

  const [docentes, setDocentes] = useState<Docente[]>([
    {
      imagen: 'https://randomuser.me/api/portraits/men/1.jpg',
      nombre: 'Carlos',
      apellido: 'Mendez',
      email: 'carlos.mendez@example.com',
      ubicacion: 'Oficina Central',
    },
    // Otros docentes...
  ]);

  const handleAddDocente = (data: Docente) => {
    setDocentes([...docentes, data]); // Agregar un nuevo docente
  };

  const handleViewDetails = (docente: Docente) => {
    setSelectedDocente(docente); // Mostrar detalles del docente seleccionado
  };

  const handleEdit = () => {
    console.log('Editar docente', selectedDocente);
  };

  return (
    <div className="w-full flex justify-center py-10">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Docentes</h2>

          {/* Botón para añadir más docentes */}
          <button
            className="bg-blue-600 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center space-x-1 text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />
            <span>Agregar Docente</span>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600 font-semibold">Imagen</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Nombre</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Apellido</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Email</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Ubicación</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {docentes.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 text-sm">
                    <img src={row.imagen} alt={`${row.nombre} ${row.apellido}`} className="w-10 h-10 rounded-full object-cover" />
                  </td>
                  <td className="px-4 py-2 text-sm">{row.nombre}</td>
                  <td className="px-4 py-2 text-sm">{row.apellido}</td>
                  <td className="px-4 py-2 text-sm">{row.email}</td>
                  <td className="px-4 py-2 text-sm">{row.ubicacion}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex space-x-2">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center"
                        onClick={() => handleViewDetails(row)}
                      >
                        <FaEye className="mr-1" />
                      </button>
                      <button className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md flex items-center">
                        <FaTrash className="mr-1" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-600">Mostrando 1 a {docentes.length} de {docentes.length} entradas</p>
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-gray-200 rounded-md">&lt;</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md">&gt;</button>
          </div>
        </div>
      </div>

      {/* Modal para agregar docente */}
      {isModalOpen && <FormularioDocente onClose={() => setIsModalOpen(false)} onSubmit={handleAddDocente} />}

      {/* Modal para ver detalles del docente */}
      {selectedDocente && (
        <DetailDocente
          docente={selectedDocente}
          onClose={() => setSelectedDocente(null)}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default DocentesComponent;
