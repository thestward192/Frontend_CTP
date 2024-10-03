import { useState, useEffect } from 'react';
import { getBarcode } from '../Services/activoService';  // Importa la función de servicio

export const useBarcode = (numPlaca: string) => {
  const [barcodeUrl, setBarcodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch del código de barras usando el servicio
  const fetchBarcode = async (numPlaca: string) => {
    try {
      setLoading(true);
      setError(null);
      const blob = await getBarcode(numPlaca);  // Llama al servicio
      setBarcodeUrl(URL.createObjectURL(blob));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (numPlaca) {
      fetchBarcode(numPlaca);
    }
  }, [numPlaca]);

  return {
    barcodeUrl,
    loading,
    error,
  };
};

export default useBarcode;
