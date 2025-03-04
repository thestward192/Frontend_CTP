import React from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Licencia } from '../../types/licencia';
import { useLeyes } from '../../hooks/useLey';
import { useLicencias } from '../../hooks/useLicencia';

interface EditLicenciaProps {
  licencia: Licencia;
  onClose: () => void;
}

const EditLicencia: React.FC<EditLicenciaProps> = ({ licencia, onClose }) => {
  const { updateLicencia } = useLicencias();
  const { leyes, loading: leyesLoading, error: leyesError } = useLeyes();

  const { handleSubmit, control, formState: { errors } } = useForm<Licencia>({
    defaultValues: {
      id: licencia.id,
      nombre: licencia.nombre,
      descripcion: licencia.descripcion,
      codigoLicencia: licencia.codigoLicencia,
      modoAdquisicion: licencia.modoAdquisicion,
      leyId: licencia.leyId || undefined,
      vigenciaFin: licencia.vigenciaFin,
      vigenciaInicio: licencia.vigenciaInicio,
    },
  });

  const modoAdquisicion = useWatch({
    control,
    name: 'modoAdquisicion',
    defaultValue: licencia.modoAdquisicion,
  });

  const onSubmit = async (data: Licencia) => {
    try {
      await updateLicencia({ id: data.id, licencia: data });
      onClose();
    } catch (error) {
      console.error('Error al actualizar la licencia:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Editar Licencia</h2>
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
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full border p-2 rounded-md"
                    disabled={leyesLoading || leyesError !== null}
                    defaultValue="" // Esto asegura que "Seleccione una ley" sea el valor por defecto
                  >
                    <option value="" disabled hidden>
                      Seleccione una ley
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
              {leyesError && <p className="text-red-500 text-sm mt-1">Error al cargar las leyes.</p>}
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1">Vigencia de Inicio</label>
              <Controller
                name="vigenciaInicio"
                control={control}
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    value={field.value ?  new Date(field.value).toISOString().split('T')[0] : ''}
                    className={`w-full border p-2 rounded-md ${errors.vigenciaInicio ? 'border-red-500' : ''}`}
                  />
                )}
              />
              {errors.vigenciaInicio && <p className="text-red-500 text-sm">{errors.vigenciaInicio.message}</p>}
          </div>

          <div className="mb-4">
              <label className="block mb-1">Vigencia de Fin</label>
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

export default EditLicencia;
