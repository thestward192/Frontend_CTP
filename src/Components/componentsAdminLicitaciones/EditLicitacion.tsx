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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl font-['DM Sans']">
        <h2 className="text-xl font-bold mb-4">Editar Licitación</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          {/* Número de Acta */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">
              Número de Acta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('numActa')}
              className="mt-2 block w-full border p-2 rounded-md shadow-sm"
              placeholder="Ingrese número de acta"
            />
            {errors.numActa && <span className="text-red-500 text-sm">{errors.numActa.message}</span>}
          </div>

          {/* Número de Licitación */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">
              Número de Licitación <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('numLicitacion')}
              className="mt-2 block w-full border p-2 rounded-md shadow-sm"
              placeholder="Ingrese número de licitación"
            />
            {errors.numLicitacion && <span className="text-red-500 text-sm">{errors.numLicitacion.message}</span>}
          </div>

          {/* Nombre */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('nombre')}
              className="mt-2 block w-full border p-2 rounded-md shadow-sm"
              placeholder="Ingrese nombre"
            />
            {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre.message}</span>}
          </div>

          {/* Monto */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">
              Monto ({moneda === Moneda.COLON ? "₡" : "$"}) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step={0.01}
                min="0"
                {...register("monto", {
                  valueAsNumber: true,
                  required: "El monto es requerido",
                  validate: (value) => {
                    const numberValue = Number(value);
                    return (!isNaN(numberValue) && numberValue > 0) || "El monto debe ser mayor que cero";
                  },
                })}
                className={`mt-2 block w-full border p-2 rounded-md shadow-sm ${errors.monto ? "border-red-500" : ""
                  }`}
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
          <div className="form-group col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              {...register('descripcion')}
              className="mt-2 block w-full border p-2 rounded-md shadow-sm"
              placeholder="Ingrese descripción"
            />
            {errors.descripcion && <span className="text-red-500 text-sm">{errors.descripcion.message}</span>}
          </div>

          {/* Fecha */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">
              Fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('fecha')}
              className="mt-2 block w-full border p-2 rounded-md shadow-sm"
            />
            {errors.fecha && <span className="text-red-500 text-sm">{errors.fecha.message}</span>}
          </div>

          {/* Ley Asociada */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">
              Ley Asociada <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="idLey"
              render={({ field, fieldState: { error } }) => {
                const options = (leyes || []).map((ley) => ({
                  value: ley.id,
                  label: ley.nombre,
                }));
                const selectedOption = options.find(option => option.value === field.value) || null;
                return (
                  <>
                    <Select
                      {...field}
                      options={options}
                      value={selectedOption}
                      onChange={(option) => field.onChange(option?.value ?? 0)}
                      isLoading={leyesLoading}
                      placeholder="Seleccionar Ley"
                      classNamePrefix="react-select"
                    />
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </>
                );
              }}
            />
          </div>

          {/* Proveedor Asociado */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">
              Proveedor Asociado <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="idProveedor"
              render={({ field, fieldState: { error } }) => {
                const options = (proveedores || []).map((proveedor) => ({
                  value: proveedor.id,
                  label: proveedor.vendedor,
                }));
                const selectedOption = options.find(option => option.value === field.value) || null;
                return (
                  <>
                    <Select
                      {...field}
                      options={options}
                      value={selectedOption}
                      onChange={(option) => field.onChange(option?.value ?? 0)}
                      isLoading={proveedoresLoading}
                      placeholder="Seleccionar Proveedor"
                      classNamePrefix="react-select"
                    />
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </>
                );
              }}
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row justify-end col-span-2 mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
