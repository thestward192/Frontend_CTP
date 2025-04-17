import { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';
import { Licitacion } from '../../types/licitacion';
import { useLeyes } from '../../hooks/useLey';
import { useProveedores } from '../../hooks/useProveedor';
import { Moneda } from '../../types/moneda';
import { OptionType } from '../../types/proveedor';

interface FormularioLicitacionProps {
  onClose: () => void;
  onLicitacionCreated: () => void;
  onSubmit: (licitacion: Omit<Licitacion, 'id'>) => void;
}

interface FormData extends Omit<Licitacion, 'id'> {}

const FormularioLicitacion: React.FC<FormularioLicitacionProps> = ({ onClose, onSubmit, onLicitacionCreated }) => {
  const { leyes, loading: leyesLoading } = useLeyes('En Servicio');
  const { proveedores, loading: proveedoresLoading } = useProveedores('En Servicio');
  const [moneda, setMoneda] = useState<Moneda>(Moneda.COLON);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<Omit<Licitacion, 'id'>>({
    defaultValues: {
      numActa: '',
      numLicitacion: '',
      nombre: '',
      moneda: Moneda.COLON,
      descripcion: '',
      fecha: new Date(),
      idProveedor: 0,
      idLey: 0,
    },
  });

  const onSubmitForm: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    try {
      onSubmit({
        ...data,
        fecha: new Date(`${data.fecha}T00:00:00`),
      });
      onLicitacionCreated();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonMonedaSwitch = () => {
    const nuevaMoneda = moneda === Moneda.COLON ? Moneda.DOLAR : Moneda.COLON;
    setMoneda(nuevaMoneda);
    setValue("moneda", nuevaMoneda);
  };

  // Preparamos las opciones para react-select
  const leyOptions = (leyes || []).map(ley => ({
    value: ley.id,
    label: ley.nombre,
  }));

  const proveedorOptions = (proveedores || []).map(proveedor => ({
    value: proveedor.id,
    label: proveedor.vendedor,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl font-['DM Sans']">
        <h2 className="text-xl font-bold mb-4">Agregar Licitación</h2>
        <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-2 gap-4">
          {/* Número de Acta */}
          <div className="form-group">
            <label htmlFor="numActa" className="block text-sm font-medium text-gray-700">
              Número de Acta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="numActa"
              {...register('numActa', { required: 'El número de acta es requerido' })}
              className="mt-2 block w-full border p-2 rounded-md shadow-sm"
              placeholder="Ingrese número de acta"
            />
            {errors.numActa && <span className="text-red-500 text-sm">{errors.numActa.message}</span>}
          </div>

          {/* Número de Licitación */}
          <div className="form-group">
            <label htmlFor="numLicitacion" className="block text-sm font-medium text-gray-700">
              Número de Licitación <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="numLicitacion"
              {...register('numLicitacion', { required: 'El número de licitación es requerido' })}
              className="mt-2 block w-full border p-2 rounded-md shadow-sm"
              placeholder="Ingrese número de licitación"
            />
            {errors.numLicitacion && <span className="text-red-500 text-sm">{errors.numLicitacion.message}</span>}
          </div>

          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              {...register('nombre', { required: 'El nombre es requerido' })}
              className="mt-2 block w-full border p-2 rounded-md shadow-sm"
              placeholder="Ingrese nombre"
            />
            {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre.message}</span>}
          </div>

          {/* Monto */}
          <div className="form-group">
            <label htmlFor="monto" className="block text-sm font-medium text-gray-700">
              Monto ({moneda === Moneda.COLON ? "₡" : "$"}) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step={0.01}
                id="monto"
                {...register("monto", { required: "El monto es requerido" })}
                className="mt-2 block w-full border p-2 rounded-md shadow-sm"
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

          {/* Campo oculto para la moneda */}
          <input type="hidden" {...register("moneda")} value={moneda} />

          {/* Descripción (NO obligatoria) */}
          <div className="form-group col-span-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="descripcion"
              {...register('descripcion')}
              className="mt-2 block w-full border p-2 rounded-md shadow-sm"
              placeholder="Ingrese descripción"
            />
            {errors.descripcion && <span className="text-red-500 text-sm">{errors.descripcion.message}</span>}
          </div>

          {/* Fecha */}
          <div className="form-group">
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
              Fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="fecha"
              {...register('fecha', { required: 'La fecha es requerida' })}
              className="mt-2 block w-full border p-2 rounded-md shadow-sm"
            />
            {errors.fecha && <span className="text-red-500 text-sm">{errors.fecha.message}</span>}
          </div>

          {/* Selección de Ley */}
          <div className="form-group">
            <label htmlFor="ley" className="block text-sm font-medium text-gray-700"> Ley <span className="text-red-500">*</span></label>
            <Controller
              control={control}
              name="idLey"
              rules={{ required: 'Debe seleccionar una ley' }}
              render={({ field, fieldState: { error } }) => {
                // El valor actual en el formulario
                const currentValue = field.value; // number | undefined

                return (
                  <>
                    <Select<OptionType>
                      options={leyOptions}
                      isLoading={leyesLoading}
                      placeholder="Seleccione una Ley"
                      // Con esto, el dropdown mostrará la opción seleccionada correctamente
                      value={leyOptions.find((op) => op.value === currentValue) || null}
                      // Cuando se seleccione una opción, actualiza el form
                      onChange={(selectedOption) => {
                        // selectedOption puede ser "null" en caso de clear, así que validamos
                        field.onChange(selectedOption?.value ?? 0);
                      }}
                    />
                    {error && <span className="text-red-500">{error.message}</span>}
                  </>
                );
              }}
            />
          </div>


          {/* Selección de Proveedor */}
          <div className="form-group">
            <label htmlFor="proveedor" className="block text-sm font-medium text-gray-700"> Proveedor <span className="text-red-500">*</span></label>
            <Controller
              control={control}
              name="idProveedor"
              rules={{ required: 'Debe seleccionar un proveedor' }}
              render={({ field, fieldState: { error } }) => {
                const currentValue = field.value; // number | undefined

                return (
                  <>
                    <Select<OptionType>
                      options={proveedorOptions}
                      isLoading={proveedoresLoading}
                      placeholder="Seleccione un Proveedor"
                      value={proveedorOptions.find((op) => op.value === currentValue) || null}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value ?? 0);
                      }}
                    />
                    {error && <span className="text-red-500">{error.message}</span>}
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
              className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onClose}
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

export default FormularioLicitacion;

