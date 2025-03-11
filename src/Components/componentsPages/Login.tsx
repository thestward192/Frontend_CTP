import React, { useState, useRef } from 'react';
import logo from '../../assets/images-removebg-preview (1).png';
import backgroundPattern from '../../assets/Opera Captura de pantalla_2024-09-04_125315_www.figma.com.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Agregamos el toggle del sidebar (dashboard)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogin = async () => {
    try {
      setError('');
      if (!email || !password) {
        setError('Por favor, completa todos los campos');
        return;
      }
      if (!recaptchaToken) {
        setError('Por favor, verifica que no eres un robot.');
        return;
      }
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          contraseña: password,
          recaptchaToken,
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
      if (!data.access_token) {
        throw new Error('No se recibió el token de autenticación');
      }
      login(data.access_token);
      try {
        const payload = JSON.parse(atob(data.access_token.split('.')[1]));
        if (payload.role === 'Administrador') {
          navigate('/MenuAdmin');
        } else if (payload.role === 'Docente') {
          navigate('/MenuDocente');
        } else {
          setError('No tienes permisos para acceder a esta área.');
          localStorage.removeItem('token');
        }
      } catch (err) {
        throw new Error('Error al decodificar el token');
      }
    } catch (err: any) {
      console.error('Error durante el inicio de sesión:', err);
      setError(err.message || 'Credenciales inválidas o error en el servidor');
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="relative w-full h-screen flex overflow-hidden">

      {/* Overlay para móviles cuando el sidebar está abierto */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Contenido principal: se desplaza a la derecha en desktop si el sidebar está abierto */}
      <div
        className="flex-1 relative z-10 bg-white overflow-hidden transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? '16rem' : '0' }}
      >
        <div className="flex flex-col md:flex-row h-screen w-full">
          {/* Formulario de login */}
          <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8">
            <div className="max-w-md w-full">
              <h1 className="text-3xl font-bold text-center mb-4">ACCESO</h1>
              <p className="text-center text-neutral-600 mb-8">
                Control de Activos CTP Hojancha
              </p>
              <div className="flex justify-center mb-6">
                <img className="w-48 h-auto" src={logo} alt="Logo CTP Hojancha" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1" htmlFor="email">
                  Correo
                </label>
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
                <label className="block text-sm font-bold mb-1" htmlFor="password">
                  Contraseña
                </label>
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
                ref={recaptchaRef}
                sitekey="6LeRsGQqAAAAAFtDED1WeA7IxGjm3aOsNGLGlnEH"
                onChange={handleRecaptchaChange}
              />

              <button
                className="w-full bg-gradient-to-r from-blue-700 to-indigo-900 text-white font-bold p-3 rounded-xl mt-4"
                onClick={handleLogin}
              >
                Entrar
              </button>

              {error && <div className="text-red-500 mt-4">{error}</div>}
            </div>
          </div>

          {/* Imagen de fondo y mensaje (lado derecho) */}
          <div
            className="relative w-full md:w-1/2 bg-cover bg-center flex justify-center items-center"
            style={{ backgroundImage: `url(${backgroundPattern})` }}
          >
            <h1 className="text-white text-4xl font-bold text-center z-10">
              CONTROL DE ACTIVOS CTP HOJANCHA
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
