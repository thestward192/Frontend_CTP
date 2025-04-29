// src/Components/componentsAdminImport/ImportAssetsComponent.tsx

import React, { useState, useRef, useCallback } from 'react';
import ExcelJS from 'exceljs';

interface PayloadActivo {
  numPlaca: string;
  nombre: string;
  descripcion: string;
  marca: string;
  modelo: string;
  serie: string;
  estado: string;
  disponibilidad: string;
  precio: number;
  moneda: string;        // Enviar la moneda como string
  observacion: string;
  // backend necesita ubicacionId (resuelto por nombre) pero nosotros le mandamos ubicacionNombre
  ubicacionNombre: string;
  modoAdquisicion: string;
  licitacionId?: number;
  foto: string;          // campo obligatorio en tu DTO backend
}

interface ImportReportItem {
  fila: number;
  success: boolean;
  error?: string;
  activo?: any;
}

const ImportAssetsComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (f: File | null) => {
    setFile(f);
    if (!f) {
      setPreviewRows([]);
      setAlerts([]);
      return;
    }
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await f.arrayBuffer());
    const sheet = workbook.worksheets[0];

    const rows: string[][] = [];
    const newAlerts: string[] = [];

    sheet.eachRow((row, rowNumber) => {
      const values = row.values as any[];
      // slice(1) para quitar índice, luego slice(1) para saltar cabecera de fila
      rows.push(values.slice(1).map(v => v?.toString().trim() ?? ''));
    });

    // Validación simple: por ejemplo, chequear que la columna Ubicación (índice 7, base 1) exista
    rows.forEach((rowData, idx) => {
      if (idx === 0) return; // saltar cabecera
      if (!rowData[7]) newAlerts.push(`Fila ${idx+1}: Ubicación vacía`);
    });

    setPreviewRows(rows);
    setAlerts(newAlerts.length ? newAlerts : ['Todos los datos válidos']);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleImport = async () => {
    if (previewRows.length <= 1) {
      setAlerts(['No hay datos para importar']);
      return;
    }

    const dtos: PayloadActivo[] = previewRows.slice(1).map((row, i) => ({
      // Según el orden que me diste:
      numPlaca:        row[1] || '',
      nombre:          row[2] || '',
      descripcion:     row[2] || '',
      marca:           row[3] || '',
      modelo:          row[4] || '',
      serie:           row[5] || '',
      estado:          row[6] || 'Bueno',
      disponibilidad:  'Activo',
      precio:          row[9] ? parseFloat(row[9]) : 0,
      moneda:          'CRC',         // o la que uses por defecto
      observacion:     row[10] || '',
      ubicacionNombre: row[7] || '',
      modoAdquisicion: row[8] || 'Compra',
      licitacionId:    undefined,
      foto:            '',
    }));

    try {
      const resp = await fetch('http://localhost:3000/activo/import', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ activos: dtos }),
      });
      if (!resp.ok) throw new Error(await resp.text());
      const { report } = (await resp.json()) as { report: ImportReportItem[] };
      setAlerts(report.map(item =>
        item.success
          ? `Fila ${item.fila} importada correctamente`
          : `Fila ${item.fila}: ${item.error}`
      ));
    } catch (err: any) {
      setAlerts([`Error de importación: ${err.message}`]);
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-8 flex flex-col" style={{ height: 'calc(100vh - 240px)' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Importar Activos</h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Vista Previa */}
          <div className="col-span-8 flex flex-col">
            <div className="text-lg font-semibold mb-2">Vista Previa</div>
            <div className="overflow-auto border rounded-md mb-4 h-80">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    {previewRows[0]?.map((_, idx) => (
                      <th key={idx} className="px-4 py-2 text-gray-600 font-semibold">
                        Col {idx+1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.slice(1).map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-100">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2 text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {!previewRows.slice(1).length && (
                    <tr>
                      <td colSpan={previewRows[0]?.length ?? 1} className="text-center py-10 text-gray-400">
                        Ninguna fila para mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Zona de arrastre / clic */}
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center
                ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'}
                cursor-pointer transition`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {file
                ? <p className="text-gray-700">Archivo: <strong>{file.name}</strong></p>
                : <p className="text-gray-500">Arrastra el archivo aquí o haz click para seleccionar</p>
              }
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </div>
          {/* Alertas */}
          <div className="col-span-4">
            <div className="text-lg font-semibold mb-2">Alertas</div>
            <ul className="space-y-2">
              {alerts.map((alert, i) => (
                <li key={i} className={`flex items-start text-sm ${alert.includes('Fila') ? 'text-red-600' : 'text-green-600'}`}>
                  <span className={`w-2 h-2 mt-1 rounded-full mr-2 ${alert.includes('Fila') ? 'bg-red-600' : 'bg-green-600'}`} />
                  {alert}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Botón importar */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleImport}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Importar Activos
        </button>
      </div>
    </div>
  );
};

export default ImportAssetsComponent;
