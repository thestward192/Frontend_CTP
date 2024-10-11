import { useState } from 'react';
import ExcelJS from 'exceljs';
import { Activo } from '../types/activo'; // Ajusta la ruta según tu proyecto
import { getUbicacionById } from '../services/ubicacionService'; // Ajusta la ruta
import { getLeyById } from '../services/leyService'; // Ajusta la ruta

export const useExportToExcel = () => {
  const [tomo, setTomo] = useState<number | null>(null);

  const exportToExcel = async (selectedActivos: Activo[]) => {
    if (!tomo) {
      alert('Por favor, introduce el número de tomo.');
      return;
    }

    if (selectedActivos.length === 0) {
      alert('No has seleccionado ningún activo.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    let folioCounter = 1;

    // Dividimos los activos en grupos de 33 por hoja
    const activosChunks = [];
    for (let i = 0; i < selectedActivos.length; i += 33) {
      activosChunks.push(selectedActivos.slice(i, i + 33));
    }

    // Recorremos los chunks de activos para crear las hojas
    for (const activos of activosChunks) {
      const worksheet = workbook.addWorksheet(`Folio${folioCounter}`);

      // Añadimos los encabezados
      worksheet.addRow([
        'Registrado en', 'No. Identificación', 'Descripción', 'Marca', 'Modelo', 'Serie',
        'Estado', 'Ubicación', 'Modo de Adquisición', 'Precio', 'Observaciones',
      ]);

      for (const [index, activo] of activos.entries()) {
        const registradoEn = `${tomo}, ${folioCounter}, ${index + 1}`;

        // Obtener la ubicación por ubicacionId
        let ubicacionNombre = 'Ubicación desconocida';
        if (activo.ubicacionId) {
          try {
            console.log(`Obteniendo ubicación para ID: ${activo.ubicacionId}`);
            const ubicacion = await getUbicacionById(activo.ubicacionId);
            console.log(`Datos de la ubicación obtenidos:`, ubicacion);
            ubicacionNombre = ubicacion?.nombre || 'Ubicación desconocida';
          } catch (error) {
            console.error(`Error al obtener la ubicación con ID ${activo.ubicacionId}:`, error);
          }
        }

        // Si el modo de adquisición es "Ley", obtener el nombre de la ley
        let modoAdquisicion = activo.modoAdquisicion;
        if (activo.modoAdquisicion === 'Ley' && activo.leyId) {
          try {
            const ley = await getLeyById(activo.leyId);
            modoAdquisicion = ley?.nombre || 'Ley desconocida';
          } catch (error) {
            console.error(`Error al obtener la ley con ID ${activo.leyId}:`, error);
          }
        }

        // Añadir la fila con los datos del activo
        worksheet.addRow([
          registradoEn,
          activo.numPlaca,
          activo.descripcion,
          activo.marca,
          activo.modelo,
          activo.serie,
          activo.estado,
          ubicacionNombre, // Usamos el nombre de la ubicación
          modoAdquisicion, // Usamos el nombre de la ley si es "Ley"
          activo.precio,
          activo.observacion,
        ]);
      }

      folioCounter++;
    }

    // Guardar el archivo Excel
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