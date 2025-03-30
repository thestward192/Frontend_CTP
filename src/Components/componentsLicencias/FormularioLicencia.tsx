import React from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Select, { GroupBase, SingleValue } from 'react-select';
import { CreateLicenciaDTO } from '../../types/licencia';
import { useLicitaciones } from '../../hooks/useLicitacion';
import { OptionType } from '../../types/proveedor';

interface FormularioLicenciaProps {
  onClose: () => void;
  onSave: (licencia: CreateLicenciaDTO) => Promise<void>;
}

const FormularioLicencia: React.FC<FormularioLicenciaProps> = ({ onClose, onSave }) => {
  const { licitaciones, error, loading } = useLicitaciones();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateLicenciaDTO>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      codigoLicencia: '',
      modoAdquisicion: 'Ley',
      licitacionId: undefined,
      vigenciaInicio: undefined,
      vigenciaFin: undefined,
    },
  });

  // Obtenemos el valor de "modoAdquisicion" para condicionar el campo de Licitación
  const modoAdquisicion = useWatch({
    control,
    name: 'modoAdquisicion',
    defaultValue: 'Ley',
  });

  const onSubmit = async (data: CreateLicenciaDTO) => {
    await onSave(data);
    onClose();
  };

  // Mapea las licitaciones a opciones para react‑select
  const licitacionOptions: OptionType[] = (licitaciones || []).map((licitacion) => ({
    value: licitacion.id,
    label: licitacion.nombre,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Agregar Licencia</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Nombre de la Licencia */}
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

          {/* Descripción */}
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

          {/* Código de la Licencia */}
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

          {/* Modo de Adquisición */}
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

          {/* Campo de Licitación solo si el modo es "Ley" */}
          {modoAdquisicion === 'Ley' && (
            <div className="mb-4">
              <label className="block mb-1">Licitación</label>
              <Controller
                name="licitacionId"
                control={control}
                rules={{ required: 'Debe seleccionar una licitación' }}
                render={({ field, fieldState: { error: fieldError } }) => {
                  const currentValue = field.value as number | undefined;
                  return (
                    <>
                      <Select<OptionType, false, GroupBase<OptionType>>
                        options={licitacionOptions}
                        placeholder="Seleccione una Licitación"
                        value={licitacionOptions.find(option => option.value === currentValue) || null}
                        onChange={(selectedOption: SingleValue<OptionType>) => {
                          field.onChange(selectedOption?.value);
                        }}
                        isDisabled={loading || error !== null}
                        className="mt-2"
                        classNamePrefix="react-select"
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            borderColor: state.isFocused ? '#2563EB' : '#D1D5DB', // azul cuando está enfocado, gris de base
                            boxShadow: state.isFocused ? '0 0 0 1px #2563EB' : 'none',
                            '&:hover': {
                              borderColor: state.isFocused ? '#2563EB' : '#9CA3AF',
                            },
                            minHeight: '2.5rem',
                            height: '2.5rem',
                          }),
                          valueContainer: (provided) => ({
                            ...provided,
                            padding: '0 0.5rem',
                          }),
                          input: (provided) => ({
                            ...provided,
                            margin: 0,
                            padding: 0,
                          }),
                          indicatorsContainer: (provided) => ({
                            ...provided,
                            height: '2.5rem',
                          }),
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                            maxHeight: '200px', // limita la altura para mostrar scroll
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                              ? '#2563EB'
                              : state.isFocused
                                ? '#EFF6FF'
                                : 'white',
                            color: state.isSelected ? 'white' : 'black',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#E0F2FE',
                            },
                          }),
                        }}
                      />
                      {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>}
                    </>
                  );
                }}
              />
              {error && <p className="text-red-500 text-sm mt-1">Error al cargar las Licitaciones.</p>}
            </div>
          )}



          {/* Vigencia Inicio */}
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
          </div>

          {/* Vigencia Fin */}
          <div className="mb-4">
            <label className="block mb-1">Vigencia Fin</label>
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
