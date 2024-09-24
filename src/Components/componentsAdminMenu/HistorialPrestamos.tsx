import React from 'react';

const HistorialPrestamos: React.FC = () => {
  return (
    <div className="w-full h-full">
      <h2 className="text-xl font-bold mb-4">Historial de Préstamos</h2>
      <div className="overflow-auto max-h-[300px]">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-gray-600 font-semibold">Prestador</th>
              <th className="px-4 py-2 text-gray-600 font-semibold">Receptor</th>
              <th className="px-4 py-2 text-gray-600 font-semibold">Tiempo</th>
              <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 text-sm">Ana</td>
              <td className="px-4 py-2 text-sm">Pablo</td>
              <td className="px-4 py-2 text-sm">3 Días</td>
              <td className="px-4 py-2 text-sm text-green-800">En Préstamo</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-sm">Ana</td>
              <td className="px-4 py-2 text-sm">Pablo</td>
              <td className="px-4 py-2 text-sm">3 Días</td>
              <td className="px-4 py-2 text-sm text-red-800">No Devuelto</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-sm">Marco</td>
              <td className="px-4 py-2 text-sm">Ana</td>
              <td className="px-4 py-2 text-sm">1 Día</td>
              <td className="px-4 py-2 text-sm text-green-800">Devuelto</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialPrestamos;
