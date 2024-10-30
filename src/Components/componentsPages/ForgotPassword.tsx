import React, { useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Error al enviar la solicitud');

      setMessage('Se ha enviado un enlace de restablecimiento a tu correo.');
    } catch (err: any) {
      setError(err.message || 'Error al enviar la solicitud');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">¿Olvidaste tu Contraseña?</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1" htmlFor="email">Correo Electrónico</label>
          <input
            className="w-full p-3 border rounded-xl"
            type="email"
            id="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {message && <div className="text-green-500 mb-4">{message}</div>}

        <button
          className="w-full bg-blue-600 text-white font-bold p-3 rounded-xl"
          onClick={handleForgotPassword}
        >
          Enviar Enlace
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
