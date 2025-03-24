import ExcelJS from 'exceljs';
import { Activo } from '../types/activo';

export const useExportToExcel = () => {
  const exportToExcel = async (selectedActivos: Activo[]) => {
    // Leer la configuración almacenada (o usar valores por defecto)
    const storedConfig = localStorage.getItem('exportConfig');
    let config = { tomo: 1, folioInicial: 1, activosPorFolio: 33 };
    if (storedConfig) {
      try {
        config = JSON.parse(storedConfig);
      } catch (error) {
        console.error('Error al parsear la configuración de exportación', error);
      }
    }
    const { tomo, folioInicial, activosPorFolio } = config;

    if (selectedActivos.length === 0) {
      alert('No has seleccionado ningún activo.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    let folioCounter = folioInicial;

    // Dividir los activos en grupos según la cantidad configurada
    const activosChunks: Activo[][] = [];
    for (let i = 0; i < selectedActivos.length; i += activosPorFolio) {
      activosChunks.push(selectedActivos.slice(i, i + activosPorFolio));
    }

    // Definir el estilo de borde, casteando "thin" al tipo adecuado
    const borderStyle = {
      top: { style: 'thin' as ExcelJS.BorderStyle },
      left: { style: 'thin' as ExcelJS.BorderStyle },
      bottom: { style: 'thin' as ExcelJS.BorderStyle },
      right: { style: 'thin' as ExcelJS.BorderStyle },
    };

    for (const activos of activosChunks) {
      const worksheet = workbook.addWorksheet(`Folio${folioCounter}`);

      // Agregar fila de encabezados
      const headerRow = worksheet.addRow([
        'Registrado en',
        'No. Identificación',
        'Descripción',
        'Marca',
        'Modelo',
        'Serie',
        'Estado',
        'Ubicación',
        'Modo de Adquisición',
        'Precio',
        'Observaciones',
      ]);

      // Aplicar formato a la fila de encabezados
      headerRow.eachCell!((cell) => {
        cell.font = { bold: true };
        cell.border = borderStyle;
      });

      // Agregar datos y aplicar bordes
      activos.forEach((activo, index) => {
        const registradoEn = `${tomo}, ${folioCounter}, ${index + 1}`;
        const ubicacionNombre = activo.ubicacion?.nombre || 'Ubicación desconocida';
        let modoAdquisicion = activo.modoAdquisicion;
        if (modoAdquisicion === 'Ley' && activo.licitacion?.ley) {
          modoAdquisicion = activo.licitacion.ley.numLey || 'Ley desconocida';
        } else if (modoAdquisicion === 'Donacion') {
          modoAdquisicion = 'Donación';
        }

        const row = worksheet.addRow([
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
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = borderStyle;
        });
      });

      // Ajuste automático de ancho de columnas según el contenido
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell!({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : '';
          maxLength = Math.max(maxLength, cellValue.length);
        });
        // Se establece un ancho mínimo de 10 y se agrega un poco de espacio extra
        column.width = maxLength < 10 ? 10 : maxLength + 2;
      });

      folioCounter++;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ActivosExportados.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return { exportToExcel };
};
