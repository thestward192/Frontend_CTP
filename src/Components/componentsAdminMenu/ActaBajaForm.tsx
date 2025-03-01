import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ActaBajaForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [razonBaja, setRazonBaja] = useState('');
  const [fechaBaja, setFechaBaja] = useState('');
  const [empresaReciclaje, setEmpresaReciclaje] = useState('');
  const [metodoDesecho, setMetodoDesecho] = useState('');

  const generarPDF = () => {
    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(18);
    doc.text('Acta de Baja de Bienes', 20, 20);

    // Subtítulo de los datos
    doc.setFontSize(12);
    doc.text('Detalles de la Baja', 20, 40);

    // Contenido del acta
    doc.setFontSize(10);
    doc.text(`Razón de la baja: ${razonBaja}`, 20, 50);
    doc.text(`Fecha de la baja: ${fechaBaja}`, 20, 60);
    doc.text(`Empresa de Reciclaje/Destrucción: ${empresaReciclaje}`, 20, 70);
    doc.text(`Método de Desecho: ${metodoDesecho}`, 20, 80);

    // Espacios para las firmas
    const y = 90;
    doc.setFontSize(10);

    doc.text('__________________________', 20, y + 30);
    doc.text('Director', 20, y + 35);

    doc.text('__________________________', 80, y + 30);
    doc.text('Presidente de la Junta', 80, y + 35);

    doc.text('__________________________', 140, y + 30);
    doc.text('Representante de la Empresa', 140, y + 35);

    // Guardar PDF
    doc.save('Acta_de_Baja.pdf');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-lg font-bold mb-4">Generar Acta de Baja</h2>
        
        <label className="block text-sm font-medium mb-2">Razón de la Baja</label>
        <select
          value={razonBaja}
          onChange={(e) => setRazonBaja(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="">Seleccione una opción</option>
          <option value="Inservibilidad">Inservibilidad</option>
          <option value="Caducidad">Caducidad</option>
          <option value="Obsolesencia">Obsolesencia</option>
        </select>

        <label className="block text-sm font-medium mb-2">Fecha de Baja</label>
        <input
          type="date"
          value={fechaBaja}
          onChange={(e) => setFechaBaja(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        <label className="block text-sm font-medium mb-2">Empresa de Reciclaje o Destrucción</label>
        <input
          type="text"
          value={empresaReciclaje}
          onChange={(e) => setEmpresaReciclaje(e.target.value)}
          placeholder="Ingrese el nombre de la empresa"
          className="w-full p-2 border rounded-md mb-4"
        />

        <label className="block text-sm font-medium mb-2">Método de Desecho</label>
        <input
          type="text"
          value={metodoDesecho}
          onChange={(e) => setMetodoDesecho(e.target.value)}
          placeholder="Ingrese el método de desecho"
          className="w-full p-2 border rounded-md mb-4"
        />

        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={generarPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Generar Acta de Baja
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActaBajaForm;
