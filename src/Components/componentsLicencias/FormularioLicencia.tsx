import React from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { CreateLicenciaDTO } from '../../types/licencia';
import { useLicitaciones } from '../../hooks/useLicitacion';


interface FormularioLicenciaProps {
  onClose: () => void;
  onSave: (licencia: CreateLicenciaDTO) => Promise<void>;
}

const FormularioLicencia: React.FC<FormularioLicenciaProps> = ({ onClose, onSave }) => {
  const {licitaciones, error, loading } = useLicitaciones();
  const { handleSubmit, control, formState: { errors } } = useForm<CreateLicenciaDTO>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      codigoLicencia: '',
      modoAdquisicion: 'Ley',
      licitacionId: undefined,
      vigenciaInicio: undefined,
      vigenciaFin: undefined,
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
              <label className="block mb-1">Licitación</label>
              <Controller
                name="licitacionId"
                control={control}
                rules={{ required: 'Debe seleccionar una licitación' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full border p-2 rounded-md"
                    disabled={loading || error !== null}
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Seleccione una Licitación
                    </option>
                    {licitaciones?.map((licitacion) => (
                      <option key={licitacion.id} value={licitacion.id.toString()}>
                        {licitacion.nombre}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.licitacionId && <p className="text-red-500 text-sm">{errors.licitacionId.message}</p>}
              {error && <p className="text-red-500 text-sm mt-1">Error al cargar las Licitaciones.</p>}
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
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FormularioLicencia;