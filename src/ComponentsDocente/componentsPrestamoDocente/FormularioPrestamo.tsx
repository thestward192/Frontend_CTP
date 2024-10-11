import React, { useState, useEffect } from 'react';
import { Activo } from '../../types/activo';
import { useAuth } from '../../hooks/AuthContext';  // Importar el contexto de autenticación
import { usePrestamo } from '../../hooks/usePrestamo';  // Hook personalizado para manejar préstamos

interface FormularioPrestamoProps {
  activo: Activo;
  onSubmit: () => void;
  onCancel: () => void;
}

const FormularioPrestamo: React.FC<FormularioPrestamoProps> = ({ activo, onSubmit, onCancel }) => {
  const { usuarioId, isAuthenticated } = useAuth();  // Usar AuthContext para obtener usuarioId y el estado de autenticación
  const { handleCreatePrestamo } = usePrestamo();  // Función para crear un préstamo
  const [docentes, setDocentes] = useState<any[]>([]);
  const [ubicacionesDocente, setUbicacionesDocente] = useState<any[]>([]);  // Ubicaciones del docente seleccionado
  const [selectedDocente, setSelectedDocente] = useState<number | null>(null);
  const [selectedUbicacion, setSelectedUbicacion] = useState<number | null>(null);
  const [fechaDevolucion, setFechaDevolucion] = useState('');  // Fecha de devolución ingresada por el usuario
  const [error, setError] = useState<string | null>(null);

  // Función para cargar los docentes desde el backend
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Token no encontrado. Por favor, inicia sesión.');
      return;
    }

    // Obtener la lista de docentes desde la API
    fetch('http://localhost:3000/user/docentes', {
      headers: {
        Authorization: `Bearer ${token}`,  // Agregar el token en el header
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setDocentes(data))
      .catch((error) => {
        console.error('Error fetching docentes:', error);
        setError('Hubo un problema al cargar los docentes. Verifica la API.');
      });
  }, []);

  // Cargar las ubicaciones del docente seleccionado
  useEffect(() => {
    if (selectedDocente) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:3000/user/${selectedDocente}/ubicaciones`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Token necesario para la autenticación
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setUbicacionesDocente(data);  // Establecer las ubicaciones del docente seleccionado
            setSelectedUbicacion(data[0]?.id);  // Establecer la primera ubicación por defecto
          }
        })
        .catch((error) => {
          console.error('Error fetching ubicaciones:', error);
          setError('Hubo un problema al cargar las ubicaciones del docente.');
        });
    }
  }, [selectedDocente]);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');

    // Verificar si el usuario está autenticado y si hay un ID de usuario disponible
    if (!isAuthenticated || !usuarioId) {
      setError('No se encontró el token de autenticación o el usuario. Por favor, inicia sesión.');
      return;
    }

    if (!selectedDocente || !selectedUbicacion || !fechaDevolucion) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Ubicación actual del activo
    const ubicacionActualId = activo.ubicacion?.id;

    const prestamoData = {
      activoId: activo.id,
      prestadoPorId: usuarioId,  // Usar el usuarioId desde el AuthContext
      prestadoAId: selectedDocente,
      ubicacionId: selectedUbicacion,  // Nueva ubicación a la que se prestará el activo
      ubicacionActualId,  // Ubicación actual de donde se presta el activo
      fechaPrestamo: new Date(),  // Fecha actual para la fecha de préstamo
      fechaDevolucion: new Date(fechaDevolucion),  // Fecha de devolución seleccionada por el usuario
    };

    try {
      const response = await fetch('http://localhost:3000/prestamos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,  // Asegurarse de enviar el token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prestamoData),
      });

      if (!response.ok) {
        throw new Error(`Error al crear el préstamo: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Préstamo creado con éxito:', data);
      onSubmit();
    } catch (err) {
      console.error('Error creando el préstamo:', err);
      setError('Hubo un problema al crear el préstamo. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Prestar Activo</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Selección del docente */}
        <label className="block mb-2">Docente</label>
        <select
          className="w-full mb-4 p-2 border rounded"
          value={selectedDocente || ''}
          onChange={(e) => setSelectedDocente(Number(e.target.value))}
        >
          <option value="">Seleccione un docente</option>
          {docentes.map((docente) => (
            <option key={docente.id} value={docente.id}>
              {docente.nombre} {docente.apellido_1}
            </option>
          ))}
        </select>

        {/* Selección de la ubicación */}
        <label className="block mb-2">Ubicación del docente</label>
        <select
          className="w-full mb-4 p-2 border rounded"
          value={selectedUbicacion || ''}
          onChange={(e) => setSelectedUbicacion(Number(e.target.value))}
        >
          <option value="">Seleccione una ubicación</option>
          {ubicacionesDocente.map((ubicacion) => (
            <option key={ubicacion.id} value={ubicacion.id}>
              {ubicacion.nombre}
            </option>
          ))}
        </select>

        {/* Fecha de devolución */}
        <label className="block mb-2">Fecha de devolución</label>
        <input
          type="date"
          className="w-full mb-4 p-2 border rounded"
          value={fechaDevolucion}
          onChange={(e) => setFechaDevolucion(e.target.value)}
        />

        <div className="flex justify-between">
          <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={onCancel}>
            Cancelar
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleSubmit}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormularioPrestamo;