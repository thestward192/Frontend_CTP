import React from 'react';

interface Prestamo {
  id: number;
  activo: string;
  de: string;
  para: string;
  fecha: string;
  estado: 'En préstamo' | 'Devuelto';
}

const prestamos: Prestamo[] = [
  {
    id: 1,
    activo: 'Laptop Dell XPS 13',
    de: 'John Doe',
    para: 'Jane Smith',
    fecha: '2024-09-25',
    estado: 'En préstamo',
  },
  {
    id: 2,
    activo: 'Proyector Epson',
    de: 'Alice Johnson',
    para: 'Bob Brown',
    fecha: '2024-09-20',
    estado: 'Devuelto',
  },
  {
    id: 3,
    activo: 'iPad Pro',
    de: 'Chris Evans',
    para: 'Natalie Portman',
    fecha: '2024-09-22',
    estado: 'En préstamo',
  },
];

const TablePrestamosDocente: React.FC = () => {
  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="table-container w-full max-w-full bg-white shadow-lg rounded-lg p-8 relative"
        style={{ height: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex-grow overflow-y-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600 font-semibold">Activo</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">De</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Para</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Fecha</th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((prestamo) => (
                <tr key={prestamo.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 text-sm">{prestamo.activo}</td>
                  <td className="px-4 py-2 text-sm">{prestamo.de}</td>
                  <td className="px-4 py-2 text-sm">{prestamo.para}</td>
                  <td className="px-4 py-2 text-sm">{prestamo.fecha}</td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-3 py-1 rounded-md text-sm ${prestamo.estado === 'En préstamo' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                    >
                      {prestamo.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablePrestamosDocente;
