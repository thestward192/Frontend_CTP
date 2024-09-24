import React, { useState } from 'react';
import { Licitacion } from '../../types/licitacion';
import { useLeyes } from '../../hooks/useLey';
import { useProveedores } from '../../hooks/useProveedor';

interface FormularioLicitacionProps {
  onClose: () => void;
  onSubmit: (licitacion: Licitacion) => void;
}

const FormularioLicitacion: React.FC<FormularioLicitacionProps> = ({ onClose, onSubmit }) => {
  const { leyes, loading: loadingLeyes, error: errorLeyes } = useLeyes();
  const { proveedores, loading: loadingProveedores, error: errorProveedores } = useProveedores();

  const [licitacion, setLicitacion] = useState<Omit<Licitacion, 'id'>>({
    numActa: undefined,
    numLicitacion: undefined,
    nombre: '',
    monto: undefined,
    descripcion: '',
    fecha: '',
    idProveedor: 0,
    idLey: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLicitacion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(licitacion);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl"> {/* Cambié a max-w-xl para hacerlo más estrecho */}
        <h2 className="text-xl font-bold mb-4">Agregar Licitación</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4"> {/* Ajusté gap a 4 para hacer más compacto */}
          <div className="form-group">
            <label htmlFor="numActa" className="block text-sm font-medium text-gray-700">Número de Acta</label>
            <input
              type="number"
              id="numActa"
              name="numActa"
              value={licitacion.numActa ?? ''}
              onChange={handleChange}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Ingrese número de acta"
            />
          </div>

          <div className="form-group">
            <label htmlFor="numLicitacion" className="block text-sm font-medium text-gray-700">Número de Licitación</label>
            <input
              type="number"
              id="numLicitacion"
              name="numLicitacion"
              value={licitacion.numLicitacion ?? ''}
              onChange={handleChange}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Ingrese número de licitación"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={licitacion.nombre}
              onChange={handleChange}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Ingrese nombre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="monto" className="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              id="monto"
              name="monto"
              value={licitacion.monto ?? ''}
              onChange={handleChange}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Ingrese monto"
            />
          </div>

          <div className="form-group col-span-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              value={licitacion.descripcion}
              onChange={handleChange}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Ingrese descripción"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={licitacion.fecha}
              onChange={handleChange}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="idProveedor" className="block text-sm font-medium text-gray-700">Proveedor</label>
            <select
              id="idProveedor"
              name="idProveedor"
              value={licitacion.idProveedor}
              onChange={handleChange}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="" disabled>Seleccione Proveedor</option>
              {loadingProveedores ? (
                <option>Cargando proveedores...</option>
              ) : errorProveedores ? (
                <option>Error al cargar proveedores</option>
              ) : (
                proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>{proveedor.nombreProveedor}</option>
                ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="idLey" className="block text-sm font-medium text-gray-700">Ley</label>
            <select
              id="idLey"
              name="idLey"
              value={licitacion.idLey}
              onChange={handleChange}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="" disabled>Seleccione Ley</option>
              {loadingLeyes ? (
                <option>Cargando leyes...</option>
              ) : errorLeyes ? (
                <option>Error al cargar leyes</option>
              ) : (
                leyes.map((ley) => (
                  <option key={ley.id} value={ley.id}>{ley.nombre}</option>
                ))
              )}
            </select>
          </div>

          <div className="flex justify-end col-span-2 mt-4 space-x-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>


        </form>
      </div>
    </div>
  );
};

export default FormularioLicitacion;
