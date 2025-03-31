import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Select from 'react-select';
import { Licitacion, UpdateLicitacionDTO } from '../../types/licitacion';
import { useLeyes } from '../../hooks/useLey';
import { useProveedores } from '../../hooks/useProveedor';
import { Moneda } from '../../types/moneda';

interface EditLicitacionFormProps {
  licitacion: Licitacion;
  onSave: (id: number, updatedData: UpdateLicitacionDTO) => Promise<void>;
  onCancel: () => void;
}

const EditLicitacion: React.FC<EditLicitacionFormProps> = ({ licitacion, onSave, onCancel }) => {
  const { leyes, loading: leyesLoading } = useLeyes();
  const { proveedores, loading: proveedoresLoading } = useProveedores();
  const [moneda, setMoneda] = useState(licitacion.moneda);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, setValue, formState: { errors }, reset } = useForm<UpdateLicitacionDTO>();

  // Inicializar valores del formulario cuando la licitación esté disponible
  useEffect(() => {
    reset({
      numActa: licitacion.numActa,
      numLicitacion: licitacion.numLicitacion,
      nombre: licitacion.nombre,
      monto: licitacion.monto,
      moneda: licitacion.moneda,
      descripcion: licitacion.descripcion,
      fecha: licitacion.fecha ? licitacion.fecha.split('T')[0] : '',
      idProveedor: licitacion.idProveedor,
      idLey: licitacion.idLey,
    });
  }, [licitacion, reset]);

  const onSubmit: SubmitHandler<UpdateLicitacionDTO> = async (data) => {
    setIsSubmitting(true);
    try {
      await onSave(licitacion.id, {
        ...data,
        fecha: new Date(`${data.fecha}T00:00:00`),
      });
    } catch (error) {
      console.error('Error al guardar la licitación:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonMonedaSwitch = () => {
    const nuevaMoneda = moneda === Moneda.COLON ? Moneda.DOLAR : Moneda.COLON;
    setMoneda(nuevaMoneda);
    setValue("moneda", nuevaMoneda);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl font-['DM Sans']">
        <h2 className="text-lg font-bold mb-4">Editar Licitación</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          {/* Número de Acta */}
          <div className="mb-4">
            <label className="block mb-1">
              Número de Acta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('numActa', { required: 'El número de acta es requerido' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.numActa && <span className="text-red-500 text-sm">{errors.numActa.message}</span>}
          </div>
          {/* Número de Licitación */}
          <div className="mb-4">
            <label className="block mb-1">
              Número de Licitación <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('numLicitacion', { required: 'El número de licitación es requerido' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.numLicitacion && <span className="text-red-500 text-sm">{errors.numLicitacion.message}</span>}
          </div>
          {/* Nombre */}
          <div className="mb-4">
            <label className="block mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('nombre', { required: 'El nombre es requerido' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre.message}</span>}
          </div>
          {/* Monto */}
          <div className="mb-4">
            <label className="block mb-1">
              Monto ({moneda === Moneda.COLON ? "₡" : "$"}) <span className="text-red-500">*</span>
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
            {errors.monto && <span className="text-red-500 text-sm">{errors.monto.message}</span>}
          </div>
          {/* Descripción */}
          <div className="col-span-2 mb-4">
            <label className="block mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('descripcion', { required: 'La descripción es requerida' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.descripcion && <span className="text-red-500 text-sm">{errors.descripcion.message}</span>}
          </div>
          {/* Fecha */}
          <div className="mb-4">
            <label className="block mb-1">
              Fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('fecha', { required: 'La fecha es requerida' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.fecha && <span className="text-red-500 text-sm">{errors.fecha.message}</span>}
          </div>
          {/* Ley Asociada con react-select */}
          <div className="mb-4">
            <label className="block mb-1">
              Ley Asociada <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="idLey"
              render={({ field }) => {
                const options = (leyes || []).map((ley) => ({
                  value: ley.id,
                  label: ley.nombre,
                }));
                const selectedOption = options.find(option => option.value === field.value) || null;
                return (
                  <Select
                    {...field}
                    options={options}
                    value={selectedOption}
                    onChange={(option) => field.onChange(option.value)}
                    isLoading={leyesLoading}
                    placeholder="Seleccionar Ley"
                    classNamePrefix="react-select"
                  />
                );
              }}
            />
            {errors.idLey && <span className="text-red-500 text-sm">{errors.idLey.message}</span>}
          </div>
          {/* Proveedor Asociado con react-select */}
          <div className="mb-4">
            <label className="block mb-1">
              Proveedor Asociado <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="idProveedor"
              render={({ field }) => {
                const options = (proveedores || []).map((proveedor) => ({
                  value: proveedor.id,
                  label: proveedor.vendedor,
                }));
                const selectedOption = options.find(option => option.value === field.value) || null;
                return (
                  <Select
                    {...field}
                    options={options}
                    value={selectedOption}
                    onChange={(option) => field.onChange(option.value)}
                    isLoading={proveedoresLoading}
                    placeholder="Seleccionar Proveedor"
                    classNamePrefix="react-select"
                  />
                );
              }}
            />
            {errors.idProveedor && <span className="text-red-500 text-sm">{errors.idProveedor.message}</span>}
          </div>

          {/* Botones de Acción */}
          <div className="col-span-2 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLicitacion;
