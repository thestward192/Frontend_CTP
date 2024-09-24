import React, { useState } from 'react';
import { useProveedores } from '../../hooks/useProveedor';

interface FormularioProveedorProps {
  onClose: () => void;
}

const FormularioProveedor: React.FC<FormularioProveedorProps> = ({ onClose }) => {
  const { handleSubmitProveedor } = useProveedores(); // Usamos la función para agregar proveedor
  const [formData, setFormData] = useState({
    nombreProveedor: '',
    nombreEmpresa: '',
    telefonoProveedor: 0,
    telefonoEmpresa: 0,
    email: '',
  });
  const [alertaVisible, setAlertaVisible] = useState(false); // Estado para controlar la visibilidad de la alerta

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await handleSubmitProveedor(formData); // Usamos CreateProveedor sin id
    if (success) {
      setAlertaVisible(true); // Mostrar alerta de éxito
      setTimeout(() => {
        setAlertaVisible(false); // Ocultar la alerta después de 1.5 segundos
        onClose(); // Cerrar modal si el proveedor se creó con éxito
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] relative">
        {alertaVisible && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
            <p>Proveedor creado exitosamente</p>
          </div>
        )}
        <h2 className="text-lg font-bold mb-4">Agregar Proveedor</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nombre del Proveedor</label>
            <input
              type="text"
              name="nombreProveedor"
              value={formData.nombreProveedor}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="Nombre del Proveedor"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Nombre de la Empresa</label>
            <input
              type="text"
              name="nombreEmpresa"
              value={formData.nombreEmpresa}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="Nombre de la Empresa"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Teléfono del Proveedor</label>
            <input
              type="text"
              name="telefonoProveedor"
              value={formData.telefonoProveedor}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="Teléfono del Proveedor"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Teléfono de la Empresa</label>
            <input
              type="text"
              name="telefonoEmpresa"
              value={formData.telefonoEmpresa}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="Teléfono de la Empresa"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="Correo Electrónico"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioProveedor;
