import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Licitacion, UpdateLicitacionDTO } from '../../types/licitacion';
import { useLeyes } from '../../hooks/useLey';
import { useProveedores } from '../../hooks/useProveedor';

interface EditLicitacionFormProps {
  licitacion: Licitacion;
  onSave: (id: number, updatedData: UpdateLicitacionDTO) => void;
  onCancel: () => void;
}

const EditLicitacion: React.FC<EditLicitacionFormProps> = ({ licitacion, onSave, onCancel }) => {
  const { leyes, loading: leyesLoading } = useLeyes();
  const { proveedores, loading: proveedoresLoading } = useProveedores();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdateLicitacionDTO>();

  // Uso de useEffect para inicializar los valores cuando licitacion está disponible
  useEffect(() => {
    reset({
      numActa: licitacion.numActa,
      numLicitacion: licitacion.numLicitacion,
      nombre: licitacion.nombre,
      monto: licitacion.monto,
      descripcion: licitacion.descripcion,
      fecha: licitacion.fecha ? licitacion.fecha.split('T')[0] : '', 
      idProveedor: licitacion.idProveedor,
      idLey: licitacion.idLey,
    });
  }, [licitacion, reset]);

  const onSubmit: SubmitHandler<UpdateLicitacionDTO> = (data) => {
    onSave(licitacion.id, {
      ...data,
      fecha: new Date(`${data.fecha}T00:00:00`), // Esto asegura que la fecha se guarde correctamente
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-lg font-bold mb-4">Editar Licitación</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block mb-1">Número de Acta</label>
            <input
              type="number"
              {...register('numActa', { required: 'El número de acta es requerido' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.numActa && <span className="text-red-500">{errors.numActa.message}</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Número de Licitación</label>
            <input
              type="number"
              {...register('numLicitacion', { required: 'El número de licitación es requerido' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.numLicitacion && <span className="text-red-500">{errors.numLicitacion.message}</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              {...register('nombre', { required: 'El nombre es requerido' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.nombre && <span className="text-red-500">{errors.nombre.message}</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Monto</label>
            <input
              type="number"
              {...register('monto', { required: 'El monto es requerido' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.monto && <span className="text-red-500">{errors.monto.message}</span>}
          </div>
          <div className="col-span-2 mb-4">
            <label className="block mb-1">Descripción</label>
            <textarea
              {...register('descripcion', { required: 'La descripción es requerida' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.descripcion && <span className="text-red-500">{errors.descripcion.message}</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Fecha</label>
            <input
              type="date"
              {...register('fecha', { required: 'La fecha es requerida' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.fecha && <span className="text-red-500">{errors.fecha.message}</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Ley Asociada</label>
            <select
              {...register('idLey', { required: 'Debe seleccionar una ley' })}
              className="w-full border p-2 rounded-md"
              disabled={leyesLoading}
            >
              <option value="" disabled>Seleccionar Ley</option>
              {(leyes || []).map((ley) => (
                <option key={ley.id} value={ley.id}>
                  {ley.nombre}
                </option>
              ))}
            </select>
            {errors.idLey && <span className="text-red-500">{errors.idLey.message}</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Proveedor Asociado</label>
            <select
              {...register('idProveedor', { required: 'Debe seleccionar un proveedor' })}
              className="w-full border p-2 rounded-md"
              disabled={proveedoresLoading}
            >
              <option value="" disabled>Seleccionar Proveedor</option>
              {(proveedores || []).map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombreProveedor}
                </option>
              ))}
            </select>
            {errors.idProveedor && <span className="text-red-500">{errors.idProveedor.message}</span>}
          </div>
          <div className="col-span-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLicitacion;
