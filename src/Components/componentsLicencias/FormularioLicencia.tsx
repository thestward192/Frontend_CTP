import React from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useLeyes } from '../../hooks/useLey';
import { CreateLicenciaDTO } from '../../types/licencia';

interface FormularioLicenciaProps {
  onClose: () => void;
  onSave: (licencia: CreateLicenciaDTO) => Promise<void>;
}

const FormularioLicencia: React.FC<FormularioLicenciaProps> = ({ onClose, onSave }) => {
  const { leyes, loading: loadingLeyes, error: errorLeyes } = useLeyes();
  const { handleSubmit, control, formState: { errors } } = useForm<CreateLicenciaDTO>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      codigoLicencia: '',
      modoAdquisicion: 'Ley',
      leyId: undefined, // Inicializar como undefined
      vigenciaInicio: undefined,
      vigenciaFin: undefined,
    },
  });

  const modoAdquisicion = useWatch({
    control,
    name: 'modoAdquisicion',
    defaultValue: 'Ley',
  });

  const onSubmit = async (data: CreateLicenciaDTO) => {
    await onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Agregar Licencia</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1">Nombre de la Licencia</label>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'Este campo es obligatorio' }}
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full border p-2 rounded-md ${errors.nombre ? 'border-red-500' : ''}`}
                  placeholder="Nombre de la Licencia"
                />
              )}
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Descripción</label>
            <Controller
              name="descripcion"
              control={control}
              rules={{ required: 'Este campo es obligatorio' }}
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full border p-2 rounded-md ${errors.descripcion ? 'border-red-500' : ''}`}
                  placeholder="Descripción"
                />
              )}
            />
            {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Código de la Licencia</label>
            <Controller
              name="codigoLicencia"
              control={control}
              rules={{ required: 'Este campo es obligatorio' }}
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full border p-2 rounded-md ${errors.codigoLicencia ? 'border-red-500' : ''}`}
                  placeholder="Código de la Licencia"
                />
              )}
            />
            {errors.codigoLicencia && <p className="text-red-500 text-sm">{errors.codigoLicencia.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Modo de Adquisición</label>
            <Controller
              name="modoAdquisicion"
              control={control}
              rules={{ required: 'Este campo es obligatorio' }}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full border p-2 rounded-md ${errors.modoAdquisicion ? 'border-red-500' : ''}`}
                >
                  <option value="Ley">Ley</option>
                  <option value="Donación">Donación</option>
                </select>
              )}
            />
            {errors.modoAdquisicion && <p className="text-red-500 text-sm">{errors.modoAdquisicion.message}</p>}
          </div>

          {modoAdquisicion === 'Ley' && (
            <div className="mb-4">
              <label className="block mb-1">Ley</label>
              <Controller
                name="leyId"
                control={control}
                rules={{ required: 'Debe Seleccionar una Ley' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full border p-2 rounded-md"
                    disabled={loadingLeyes || errorLeyes !== null}
                    defaultValue="" // Esto asegura que "Seleccione una ley" sea el valor por defecto
                  >
                    <option value="" disabled hidden>
                      Seleccione una Ley
                    </option>
                    {leyes?.map((ley) => (
                      <option key={ley.id} value={ley.id.toString()}>
                        {ley.nombre}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.leyId && <p className="text-red-500 text-sm">{errors.leyId.message}</p>}
              {errorLeyes && <p className="text-red-500 text-sm mt-1">Error al cargar las leyes.</p>}
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1">Vigencia Inicio</label>
            <Controller
              name="vigenciaInicio"
              control={control}
              rules={{ required: 'Este campo es obligatorio' }}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                  className={`w-full border p-2 rounded-md ${errors.vigenciaInicio ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.vigenciaInicio && <p className="text-red-500 text-sm">{errors.vigenciaInicio.message}</p>}

            <label className="block mb-1 mt-4">Vigencia Fin</label>
            <Controller

              name="vigenciaFin"
              control={control}
              rules={{ required: 'Este campo es obligatorio' }}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                  className={`w-full border p-2 rounded-md ${errors.vigenciaFin ? 'border-red-500' : ''}`}
                />
              )}

            />

            {errors.vigenciaFin && <p className="text-red-500 text-sm">{errors.vigenciaFin.message}</p>}

          </div>



          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
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

export default FormularioLicencia;
