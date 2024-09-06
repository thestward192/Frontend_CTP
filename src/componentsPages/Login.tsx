import React from 'react';
import logo from 'C:/Documentos/Universidad/Tercer Año/II Semestre/Inge II/Sistema Control de Activos/Frontend_CTP/src/assets/images-removebg-preview (1).png';
import backgroundPattern from 'C:/Documentos/Universidad/Tercer Año/II Semestre/Inge II/Sistema Control de Activos/Frontend_CTP/src/assets/Opera Captura de pantalla_2024-09-04_125315_www.figma.com.png';
import { useNavigate } from 'react-router-dom';




const Login: React.FC = () => {

  const navigate = useNavigate(); // Inicializa useNavigate


    return (
      <div className="flex flex-col md:flex-row h-screen w-full">
      {/* Panel izquierdo */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-4">ACCESO</h1>
          <p className="text-center text-neutral-600 mb-8">
            Control de Activos CTP Hojancha
          </p>

          {/* Logo debajo del texto */}
          <div className="flex justify-center mb-6">
            <img
              className="w-48 h-auto"
              src={logo}  // Usando la imagen importada
              alt="Logo CTP Hojancha"
            />
          </div>

          {/* Inputs */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1" htmlFor="cedula">
              Cédula
            </label>
            <input
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
              type="text"
              id="cedula"
              placeholder="Ingresa tu cédula"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {/* Botón de registro */}
          <button
      className="w-full bg-gradient-to-r from-blue-700 to-indigo-900 text-white font-bold p-3 rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-800"
      onClick={() => navigate('/MenuAdmin')} // Redirige a /MenuAdmin cuando se haga clic
    >   Entrar </button>

          {/* Footer con correo */}
          <div className="text-xs text-center mt-4 text-gray-500">
            En caso de no tener cuenta Registrarse
          </div>

          {/* Opción de logeo con MEP */}
          <div className="mt-6 flex justify-center">
            <button className="text-blue-700 font-bold text-xs border rounded-xl p-2 w-full md:w-2/3 border-gray-300"onClick={() => navigate('/Register')}>
              Registarse
            </button>
          </div>
        </div>
      </div>

      {/* Panel derecho con patrón ondulado */}
      <div
        className="relative w-full md:w-1/2 bg-cover bg-center flex justify-center items-center"
        style={{
          backgroundImage: `url(${backgroundPattern})`,
          backgroundSize: 'cover',
        }}
      >
        <h1 className="text-white text-4xl font-bold text-center z-10">
          CONTROL DE ACTIVOS CTP HOJANCHA
        </h1>
      </div>
    </div>
    );
};

export default Login;
