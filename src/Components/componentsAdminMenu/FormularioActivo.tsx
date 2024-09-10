import React, { useState } from 'react';

const FormularioActivo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    noIdentificacion: '',
    descripcion: '',
    marca: '',
    modelo: '',
    serie: '',
    ubicacion: '',
    modoAdquisicion: '',
    precio: '',
    observacion: '',
    foto: null,
  });

  // Manejar los cambios de los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Manejar la carga de la imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        foto: e.target.files[0],
      });
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // Aquí puedes manejar la lógica para crear el activo
    onClose(); // Cierra el modal después de enviar el formulario
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg w-[1000px] max-h-[750px] overflow-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Agregar Activo</h2>
        <form onSubmit={handleSubmit}>

          {/* Área de Carga de la Foto con No. Identificación y Marca a la izquierda */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col space-y-6">
              <div className="mb-6">
                <label className="block mb-2 font-medium">No. Identificación</label>
                <input
                  type="text"
                  name="noIdentificacion"
                  value={formData.noIdentificacion}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-md"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-medium">Marca</label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center items-center">
              <div className="w-[300px] h-[150px] border-dashed border-2 border-gray-300 rounded-md flex items-center justify-center">
                <label className="text-center text-gray-500">
                  <input type="file" className="hidden" onChange={handleFileChange} />
                  <span className="text-blue-600 cursor-pointer">Subir una imagen</span> o arrastrar aquí
                </label>
              </div>
            </div>
          </div>

          {/* Campos del Formulario */}
          <div className="grid grid-cols-3 gap-8">
            <div className="mb-6">
              <label className="block mb-2 font-medium">Modelo</label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Serie</label>
              <input
                type="text"
                name="serie"
                value={formData.serie}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Ubicación</label>
              <select
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
                required
              >
                <option value="">Seleccione una ubicación</option>
                <option value="Laboratorio 1">Laboratorio 1</option>
                <option value="Laboratorio 2">Laboratorio 2</option>
                <option value="Oficina Central">Oficina Central</option>
              </select>
            </div>

            <div className="mb-6 col-span-3">
              <label className="block mb-2 font-medium">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Modo de Adquisición</label>
              <input
                type="text"
                name="modoAdquisicion"
                value={formData.modoAdquisicion}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Precio</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
                required
              />
            </div>

            <div className="mb-6 col-span-3">
              <label className="block mb-2 font-medium">Observación</label>
              <textarea
                name="observacion"
                value={formData.observacion}
                onChange={handleChange}
                className="w-full border p-3 rounded-md"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="sticky bottom-0 bg-white pt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioActivo;
