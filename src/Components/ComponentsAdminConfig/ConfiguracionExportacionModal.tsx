// src/Components/ComponentsAdminConfig/ConfiguracionExportacionModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FaCheckCircle } from 'react-icons/fa';

interface ExportConfig {
  tomo: number;
  folioInicial: number;
  activosPorFolio: number;
}

interface ConfiguracionExportacionModalProps {
  onClose: () => void;
}

const ConfiguracionExportacionModal: React.FC<ConfiguracionExportacionModalProps> = ({ onClose }) => {
  const [tomo, setTomo] = useState<string>("1");
  const [folioInicial, setFolioInicial] = useState<string>("1");
  const [activosPorFolio, setActivosPorFolio] = useState<string>("33");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedConfig = localStorage.getItem('exportConfig');
    if (storedConfig) {
      const config: ExportConfig = JSON.parse(storedConfig);
      setTomo(config.tomo.toString());
      setFolioInicial(config.folioInicial.toString());
      setActivosPorFolio(config.activosPorFolio.toString());
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedTomo = tomo.trim() === "" ? 1 : Number(tomo);
    const parsedFolioInicial = folioInicial.trim() === "" ? 1 : Number(folioInicial);
    const parsedActivosPorFolio = activosPorFolio.trim() === "" ? 33 : Number(activosPorFolio);
    const config: ExportConfig = { 
      tomo: parsedTomo, 
      folioInicial: parsedFolioInicial, 
      activosPorFolio: parsedActivosPorFolio 
    };
    localStorage.setItem('exportConfig', JSON.stringify(config));
    setSuccessMessage("Configuración guardada exitosamente.");
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      {/* Contenido del Modal */}
      <div className="bg-white rounded-lg p-6 z-50 shadow-lg relative max-w-md w-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
          <X size={20} />
        </button>
        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md mb-6 flex items-center">
            <FaCheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}
        <h1 className="text-2xl font-bold mb-6">Configuración de Exportación a Excel</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="tomo" className="block text-sm font-medium text-gray-700">
              Número de Tomo
            </label>
            <input
              type="number"
              id="tomo"
              value={tomo}
              onChange={(e) => setTomo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              min={1}
            />
          </div>
          <div>
            <label htmlFor="folioInicial" className="block text-sm font-medium text-gray-700">
              Folio Inicial
            </label>
            <input
              type="number"
              id="folioInicial"
              value={folioInicial}
              onChange={(e) => setFolioInicial(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              min={1}
            />
          </div>
          <div>
            <label htmlFor="activosPorFolio" className="block text-sm font-medium text-gray-700">
              Cantidad de Activos por Folio
            </label>
            <input
              type="number"
              id="activosPorFolio"
              value={activosPorFolio}
              onChange={(e) => setActivosPorFolio(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              min={1}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Guardar Configuración
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfiguracionExportacionModal;
