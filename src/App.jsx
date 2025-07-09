import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import RoleSelection from './Componentes/RoleSelection';
import AuthForm from './Componentes/AuthForm';
import PendingApproval from './pages/pending-approval';
import Sidebar from './Componentes/Sidebar';
import PatientSection from './Componentes/PatientSection';
import CalendarSection from './Componentes/CalendarSection';
import ProfileSection from './Componentes/ProfileSection';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('pacientes');
  const [emergencyAccess, setEmergencyAccess] = useState(true);

  // Obtener el rol directamente de la URL
  const searchParams = new URLSearchParams(location.search);
  const userRole = searchParams.get('role'); // 'psychologist' o 'patient'

  const handleAuthSuccess = () => {
    if (userRole === 'psychologist') {
      // Psicólogo: mostrar dashboard directamente
      navigate('/dashboard');
    } else {
      // Paciente: ir a pendiente de aprobación
      navigate('/pending-approval');
    }
  };

  // Ruta para el dashboard del psicólogo
  if (location.pathname === '/dashboard') {
    return (
      <div className="flex h-screen bg-purple-50 relative overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 p-8 overflow-auto relative z-10">
          {activeTab === 'pacientes' && (
            <PatientSection 
              emergencyAccess={emergencyAccess} 
              setEmergencyAccess={setEmergencyAccess} 
            />
          )}
          {activeTab === 'agenda' && <CalendarSection />}
          {activeTab === 'perfil' && <ProfileSection />}
        </div>

        <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
          <img 
            src="/img1.jpg" 
            alt="Decoración"
            className="max-h-[80vh] w-auto opacity-10 object-contain"
          />
        </div>
      </div>
    );
  }

  // Rutas principales
  return (
    <Routes>
      <Route path="/" element={
        <RoleSelection onSelect={(role) => {
          navigate(`/auth?role=${role}`);
        }} />
      } />
      
      <Route path="/auth" element={
        <AuthForm 
          role={userRole} 
          onSuccess={handleAuthSuccess} 
          onBack={() => navigate('/')}
        />
      } />
      
      <Route path="/pending-approval" element={<PendingApproval />} />
      
      {/* Ruta para el dashboard (necesaria para el router) */}
      <Route path="/dashboard" element={null} />
    </Routes>
  );
}