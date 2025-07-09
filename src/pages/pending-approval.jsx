import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Cambiado por useNavigate
import { FiClock, FiCheckCircle } from 'react-icons/fi';

export default function PendingApproval() {
  const navigate = useNavigate(); // Reemplaza useRouter

  // Simulación: Verificación de aprobación (backend real lo hará)
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Verificando estado de aprobación...");
      // navigate('/dashboard'); // Descomenta cuando integres backend
    }, 30000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-100 p-4 rounded-full">
            <FiClock className="text-purple-600 text-3xl" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-purple-800 mb-4">Esperando Aprobación</h1>
        <p className="text-gray-600 mb-6">
          Tu solicitud de vinculación con el psicólogo está siendo revisada.
          Te notificaremos por correo electrónico cuando hayas sido aprobado.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-left">
          <div className="flex items-start gap-3">
            <FiCheckCircle className="text-blue-500 mt-1 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Hemos enviado una notificación al psicólogo para que revise tu solicitud.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}