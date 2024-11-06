import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>(); // Token desde la URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');


  const handleResetPassword = async () => {
    setError('');

    if (!password || !confirmPassword) {
      setError('Por favor, completa todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenRestablecerAcceso: token, // Token de la URL
          contraseña: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la contraseña');
      }

      setError('');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Restablecer Contraseña</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1" htmlFor="password">Nueva Contraseña</label>
          <input
            className="w-full p-3 border rounded-xl"
            type="password"
            id="password"
            placeholder="Ingresa tu nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-bold mb-1" htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            className="w-full p-3 border rounded-xl"
            type="password"
            id="confirmPassword"
            placeholder="Confirma tu nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <button
          className="w-full bg-blue-600 text-white font-bold p-3 rounded-xl"
          onClick={handleResetPassword}
        >
          Restablecer Contraseña
        </button>
      </div>
    </div>
  );
};

export default ResetPassword; 