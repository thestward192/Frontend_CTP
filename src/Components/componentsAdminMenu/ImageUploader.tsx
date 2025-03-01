import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploaderProps {
  onUpload: (url: string) => void; // Función para enviar la URL al formulario padre
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true); // Mostramos indicador de carga

    try {
      const API_KEY = "72ed131d25c00042a2e6426f0075d669"; // Reemplázala con tu clave de ImgBB 
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setImageUrl(data.data.url);
        onUpload(data.data.url); // Enviamos la URL al formulario padre
      } else {
        console.error("Error al subir imagen", data);
      }
    } catch (error) {
      console.error("Error en la subida", error);
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 border border-gray-300 rounded-lg shadow-md">
      <div
        {...getRootProps()}
        className="w-full p-6 border-2 border-dashed border-blue-500 bg-white rounded-lg text-center cursor-pointer hover:bg-blue-50 transition"
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-blue-500 font-semibold">📤 Subiendo imagen...</p>
        ) : (
          <p className="text-gray-600">📂 Arrastra y suelta una imagen aquí, o haz clic para seleccionar una.</p>
        )}
      </div>

      {imageUrl && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">✅ Imagen subida correctamente</p>
          <img src={imageUrl} alt="Imagen subida" className="mt-2 w-40 h-40 object-cover rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
