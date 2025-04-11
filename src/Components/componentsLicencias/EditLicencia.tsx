import React from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Select, { GroupBase, SingleValue } from 'react-select';
import { Licencia } from '../../types/licencia';
import { useLicencias } from '../../hooks/useLicencia';
import { useLicitaciones } from '../../hooks/useLicitacion';

interface EditLicenciaProps {
  licencia: Licencia;
  onClose: () => void;
}

interface OptionType {
  value: number;
  label: string;
}

const EditLicencia: React.FC<EditLicenciaProps> = ({ licencia, onClose }) => {
  const { updateLicencia } = useLicencias();
  const { licitaciones, loading: licitacionesLoading, error: licitacionesError } = useLicitaciones();

  const { handleSubmit, control, formState: { errors } } = useForm<Licencia>({
    defaultValues: {
      id: licencia.id,
      nombre: licencia.nombre,
      descripcion: licencia.descripcion,
      codigoLicencia: licencia.codigoLicencia,
      modoAdquisicion: licencia.modoAdquisicion,
      // Convertimos el id a string, para que coincida con el valor del select
      licitacionId: licencia.licitacion ? licencia.licitacion.id.toString() : '',
      vigenciaInicio: licencia.vigenciaInicio,
      vigenciaFin: licencia.vigenciaFin,
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

  // Mapear las licitaciones a opciones para react‑select
  const licitacionOptions: OptionType[] = (licitaciones || []).map((licitacion) => ({
    value: licitacion.id,
    label: licitacion.nombre,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Editar Licencia</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Nombre de la Licencia */}
          <div className="mb-4">
            <label className="block mb-1">Nombre de la Licencia <span className="text-red-500">*</span></label>
            <Controller
              name="nombre"
              control={control}
              rules={{
                required: 'Este campo es obligatorio',
                maxLength: { value: 100, message: 'El nombre no puede tener más de 100 caracteres' }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Nombre de la Licencia"
                  className={`w-full border p-2 rounded-md ${errors.nombre ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label className="block mb-1">Descripción <span className="text-red-500">*</span></label>
            <Controller
              name="descripcion"
              control={control}
              rules={{ required: 'Este campo es obligatorio' }}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Descripción"
                  className={`w-full border p-2 rounded-md ${errors.descripcion ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion.message}</p>}
          </div>

          {/* Código de la Licencia */}
          <div className="mb-4">
            <label className="block mb-1">Código de la Licencia <span className="text-red-500">*</span></label>
            <Controller
              name="codigoLicencia"
              control={control}
              rules={{
                required: 'Este campo es obligatorio',
                maxLength: { value: 50, message: 'El código no puede tener más de 50 caracteres' }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Código de la Licencia"
                  className={`w-full border p-2 rounded-md ${errors.codigoLicencia ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.codigoLicencia && <p className="text-red-500 text-sm">{errors.codigoLicencia.message}</p>}
          </div>

          {/* Modo de Adquisición */}
          <div className="mb-4">
            <label className="block mb-1">Modo de Adquisición <span className="text-red-500">*</span></label>
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

          {/* Campo de Licitación solo si el modo es "Ley" */}
          {modoAdquisicion === 'Ley' && (
            <div className="mb-4">
              <label className="block mb-1">Licitación <span className="text-red-500">*</span></label>
              <Controller
                name="licitacionId"
                control={control}
                rules={{ required: 'Debe seleccionar una licitación' }}
                render={({ field, fieldState: { error } }) => {
                  const currentValue = field.value ? Number(field.value) : undefined;
                  return (
                    <>
                      <Select<OptionType, false, GroupBase<OptionType>>
                        isSearchable
                        options={licitacionOptions}
                        placeholder="Seleccione una Licitación"
                        value={licitacionOptions.find(option => option.value === currentValue) || null}
                        onChange={(selectedOption: SingleValue<OptionType>) =>
                          field.onChange(selectedOption ? selectedOption.value : undefined)
                        }
                        isDisabled={licitacionesLoading || licitacionesError !== null}
                        menuPortalTarget={undefined}
                        menuPlacement="auto"
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            backgroundColor: 'white',
                            maxHeight: 200,
                          }),
                          menuList: (provided) => ({
                            ...provided,
                            backgroundColor: 'white',
                          }),
                        }}
                        className="mt-2"
                        classNamePrefix="react-select"
                      />
                      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </>
                  );
                }}
              />
              {licitacionesError && (
                <p className="text-red-500 text-sm mt-1">
                  Error al cargar las licitaciones.
                </p>
              )}
            </div>
          )}

          {/* Vigencia de Inicio */}
          <div className="mb-4">
            <label className="block mb-1">Vigencia de Inicio <span className="text-red-500">*</span></label>
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
          </div>

          {/* Vigencia de Fin */}
          <div className="mb-4">
            <label className="block mb-1">Vigencia de Fin <span className="text-red-500">*</span></label>
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

export default EditLicencia;
