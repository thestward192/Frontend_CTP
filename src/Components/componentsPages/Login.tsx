import React, { useState, useRef } from 'react';
import logo from '../../assets/images-removebg-preview (1).png';
import backgroundPattern from '../../assets/Opera Captura de pantalla_2024-09-04_125315_www.figma.com.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const recaptchaRef = useRef<ReCAPTCHA>(null); // Declaramos correctamente la referencia

  const handleLogin = async () => {
    try {
      setError(''); // Limpiar cualquier error previo

      // Validar que los campos no estén vacíos
      if (!email || !password) {
        setError('Por favor, completa todos los campos');
        return;
      }

      if (!recaptchaToken) {
        setError('Por favor, verifica que no eres un robot.');
        return;
      }

      // Enviar la solicitud de login al backend junto con el token de reCAPTCHA
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          contraseña: password,
          recaptchaToken, // Incluir el token de reCAPTCHA en la solicitud
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Credenciales inválidas');
        } else {
          throw new Error(`Error en el servidor: ${response.statusText}`);
        }
      }

      const data = await response.json();

      // Verifica si realmente tienes el token
      if (!data.access_token) {
        throw new Error('No se recibió el token de autenticación');
      }

      login(data.access_token); // Autenticar y guardar el token

      try {
        const payload = JSON.parse(atob(data.access_token.split('.')[1]));

        // Dependiendo del rol, redirigir al lugar correcto
        if (payload.role === 'Administrador') {
          navigate('/MenuAdmin'); // Redirigir al menú del administrador
        } else if (payload.role === 'Docente') {
          navigate('/MenuDocente'); // Redirigir al menú del docente
        } else {
          setError('No tienes permisos para acceder a esta área.');
          localStorage.removeItem('token'); // Elimina el token si no es un rol permitido
        }
      } catch (err) {
        throw new Error('Error al decodificar el token');
      }
    } catch (err: any) {
      console.error('Error durante el inicio de sesión:', err);
      setError(err.message || 'Credenciales inválidas o error en el servidor');
    }
  };

  // Manejar la validación del reCAPTCHA
  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token); // Guardar el token generado por reCAPTCHA
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-4">ACCESO</h1>
          <p className="text-center text-neutral-600 mb-8">Control de Activos CTP Hojancha</p>
          <div className="flex justify-center mb-6">
            <img className="w-48 h-auto" src={logo} alt="Logo CTP Hojancha" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="email">Correo</label>
            <input
              className="w-full p-3 border rounded-xl"
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-1" htmlFor="password">Contraseña</label>
            <input
              className="w-full p-3 border rounded-xl"
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <ReCAPTCHA
            ref={recaptchaRef}  // Enlazar el reCAPTCHA con el ref
            sitekey="6LeRsGQqAAAAAFtDED1WeA7IxGjm3aOsNGLGlnEH"  // Clave pública de reCAPTCHA
            onChange={handleRecaptchaChange}  // Manejar el cambio de token cuando el usuario valida el reCAPTCHA
          />

          <button
            className="w-full bg-gradient-to-r from-blue-700 to-indigo-900 text-white font-bold p-3 rounded-xl"
            onClick={handleLogin}
          >
            Entrar
          </button>

          {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
      </div>

      <div
        className="relative w-full md:w-1/2 bg-cover bg-center flex justify-center items-center"
        style={{ backgroundImage: `url(${backgroundPattern})`, backgroundSize: 'cover' }}
      >
        <h1 className="text-white text-4xl font-bold text-center z-10">CONTROL DE ACTIVOS CTP HOJANCHA</h1>
      </div>
    </div>
  );
};

export default Login;