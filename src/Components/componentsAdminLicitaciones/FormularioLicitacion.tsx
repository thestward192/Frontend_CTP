import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Licitacion } from '../../types/licitacion';
import { useLeyes } from '../../hooks/useLey';
import { useProveedores } from '../../hooks/useProveedor';
import { Moneda } from '../../types/moneda';

interface FormularioLicitacionProps {
  onClose: () => void;
  onLicitacionCreated: () => void;
  onSubmit: (licitacion: Omit<Licitacion, 'id'>) => void;
}

const FormularioLicitacion: React.FC<FormularioLicitacionProps> = ({ onClose, onSubmit, onLicitacionCreated }) => {
  const { leyes, loading: leyesLoading } = useLeyes();
  const { proveedores, loading: proveedoresLoading } = useProveedores();
  const [moneda, setMoneda] = useState<Moneda>(Moneda.COLON);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Omit<Licitacion, 'id'>>({
    defaultValues: {
      numActa: undefined,
      numLicitacion: undefined,
      nombre: '',
      monto: undefined,
      moneda: Moneda.COLON,
      descripcion: '',
      fecha: new Date(),
      idProveedor: '', 
      idLey: '',
    },
  });

  const onSubmitForm: SubmitHandler<Omit<Licitacion, 'id'>> = (data) => {
    onSubmit({
      ...data,
      fecha: new Date(`${data.fecha}T00:00:00`),
    });
    onLicitacionCreated(); 
    onClose(); 
  };

  const handleButtonMonedaSwitch = () => {
    const nuevaMoneda = moneda === Moneda.COLON ? Moneda.DOLAR : Moneda.COLON;
    setMoneda(nuevaMoneda);
    setValue("moneda", nuevaMoneda);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Agregar Licitación</h2>
        <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-2 gap-4">
          {/* Número de Acta */}
          <div className="form-group">
            <label htmlFor="numActa" className="block text-sm font-medium text-gray-700">Número de Acta</label>
            <input
              type="number"
              id="numActa"
              {...register('numActa', { required: 'El número de acta es requerido' })}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Ingrese número de acta"
            />
            {errors.numActa && <span className="text-red-500">{errors.numActa.message}</span>}
          </div>

          {/* Número de Licitación */}
          <div className="form-group">
            <label htmlFor="numLicitacion" className="block text-sm font-medium text-gray-700">Número de Licitación</label>
            <input
              type="number"
              id="numLicitacion"
              {...register('numLicitacion', { required: 'El número de licitación es requerido' })}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Ingrese número de licitación"
            />
            {errors.numLicitacion && <span className="text-red-500">{errors.numLicitacion.message}</span>}
          </div>

          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              id="nombre"
              {...register('nombre', { required: 'El nombre es requerido' })}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Ingrese nombre"
            />
            {errors.nombre && <span className="text-red-500">{errors.nombre.message}</span>}
          </div>

          {/* Monto */}
          <div className="form-group">
            <label htmlFor="monto" className="block text-sm font-medium text-gray-700">
              Monto ({moneda === Moneda.COLON ? "₡" : "$"})
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step={0.01}
                id="monto"
                {...register("monto", { required: "El monto es requerido" })}
                className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Ingrese monto"
              />
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 opacity-75 hover:opacity-100"
                onClick={handleButtonMonedaSwitch}
              >
                {moneda === Moneda.COLON ? "CRC" : "USD"}
              </button>
            </div>
            {errors.monto && <span className="text-red-500">{errors.monto.message}</span>}
          </div>

          {/* Campo oculto para enviar la moneda */}
          <input type="hidden" {...register("moneda")} value={moneda} />

          {/* Descripción */}
          <div className="form-group col-span-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              id="descripcion"
              {...register('descripcion', { required: 'La descripción es requerida' })}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Ingrese descripción"
            />
            {errors.descripcion && <span className="text-red-500">{errors.descripcion.message}</span>}
          </div>

          {/* Fecha */}
          <div className="form-group">
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              id="fecha"
              {...register('fecha', { required: 'La fecha es requerida' })}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.fecha && <span className="text-red-500">{errors.fecha.message}</span>}
          </div>

          {/* Selección de Ley */}
          <div className="form-group">
            <label htmlFor="ley" className="block text-sm font-medium text-gray-700">Ley</label>
            <select
              id="ley"
              {...register('idLey', { required: 'Debe seleccionar una ley' })}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
              disabled={leyesLoading}
            >
              <option value="" disabled>Seleccione una Ley</option>
              {(leyes || []).map((ley) => (
                <option key={ley.id} value={ley.id}>
                  {ley.nombre}
                </option>
              ))}
            </select>
            {errors.idLey && <span className="text-red-500">{errors.idLey.message}</span>}
          </div>

          {/* Selección de Proveedor */}
          <div className="form-group">
            <label htmlFor="proveedor" className="block text-sm font-medium text-gray-700">Proveedor</label>
            <select
              id="proveedor"
              {...register('idProveedor', { required: 'Debe seleccionar un proveedor' })}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
              disabled={proveedoresLoading}
            >
              <option value="" disabled>Seleccione un Proveedor</option>
              {(proveedores || []).map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.vendedor}
                </option>
              ))}
            </select>
            {errors.idProveedor && <span className="text-red-500">{errors.idProveedor.message}</span>}
          </div>

          {/* Botones de Acción */}
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