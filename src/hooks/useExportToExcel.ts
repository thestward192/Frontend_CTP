import { useState } from 'react';
import ExcelJS from 'exceljs';
import { Activo } from '../types/activo'; // Ajusta la ruta según tu proyecto

export const useExportToExcel = () => {
  const [tomo, setTomo] = useState<number | null>(null);

  const exportToExcel = async (selectedActivos: Activo[]) => {
    const finalTomo = tomo !== null ? tomo : 1;

    if (selectedActivos.length === 0) {
      alert('No has seleccionado ningún activo.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    let folioCounter = 1;

    const activosChunks = [];
    for (let i = 0; i < selectedActivos.length; i += 33) {
      activosChunks.push(selectedActivos.slice(i, i + 33));
    }

    for (const activos of activosChunks) {
      const worksheet = workbook.addWorksheet(`Folio${folioCounter}`);

      worksheet.addRow([
        'Registrado en', 'No. Identificación', 'Descripción', 'Marca', 'Modelo',
        'Serie', 'Estado', 'Ubicación', 'Modo de Adquisición', 'Precio', 'Observaciones',
      ]);

      for (const [index, activo] of activos.entries()) {
        const registradoEn = `${finalTomo}, ${folioCounter}, ${index + 1}`;

        // Obtenemos el nombre de la ubicación directamente del objeto activo
        const ubicacionNombre = activo.ubicacion?.nombre || 'Ubicación desconocida';

        // Verificamos el modo de adquisición y mostramos el número de ley si es por licitación
        let modoAdquisicion = activo.modoAdquisicion;

        if (modoAdquisicion === 'Ley' && activo.licitacion?.ley) {
          modoAdquisicion = activo.licitacion.ley.numLey || 'Ley desconocida';
        } else if (modoAdquisicion === 'Donacion') {
          modoAdquisicion = 'Donación';
        }

        worksheet.addRow([
          registradoEn,
          activo.numPlaca,
          activo.descripcion,
          activo.marca,
          activo.modelo,
          activo.serie,
          activo.estado,
          ubicacionNombre,
          modoAdquisicion,
          activo.precio,
          activo.observacion,
        ]);
      }

      folioCounter++;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ActivosExportados.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return { tomo, setTomo, exportToExcel };
};