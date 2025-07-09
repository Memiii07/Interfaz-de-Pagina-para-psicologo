import { useState } from 'react';
import { FiUser, FiClipboard, FiX, FiCheck, FiClock, FiCalendar, FiPhone, FiMail, FiBell, FiTrash2 } from "react-icons/fi";
import PatientProfile from './PatientProfile';

export default function PatientSection({ emergencyAccess, setEmergencyAccess }) {
  // Estados para pacientes y solicitudes
  const [patients, setPatients] = useState([
    { 
      id: 1, 
      ci: '1234567890',
      name: "Ana", 
      lastName: "López",
      birthDate: "1995-05-15",
      phone: "+573101234567",
      email: "ana@example.com",
      gender: "Femenino",
      emergencyContact: "Carlos López - +573001234567",
      lastSession: "15/05/2023", 
      diagnosis: "Trastorno de ansiedad generalizada",
      status: "en mejoria",
      provisionalDiagnosis: "",
      sessions: 12,
      notes: "Responde bien a la terapia cognitiva",
      photo: null
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);

  // Función para eliminar paciente
  const handleDeletePatient = (patientId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      setPatients(patients.filter(patient => patient.id !== patientId));
    }
  };

  // Calcular edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-purple-800">Mis Pacientes</h2>
      </div>

      {/* Tarjetas de Pacientes con botón de eliminar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {patients.map(patient => (
          <div key={patient.id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 relative">
            {/* Botón de eliminar */}
            <button 
              onClick={() => handleDeletePatient(patient.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Eliminar paciente"
            >
              <FiTrash2 size={16} />
            </button>

            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-full text-purple-600 mt-1">
                {patient.photo ? (
                  <img 
                    src={patient.photo} 
                    alt={`${patient.name} ${patient.lastName}`} 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <FiUser size={18} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">{patient.name} {patient.lastName}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {calculateAge(patient.birthDate)} años • {patient.lastSession}
                </p>
                
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Diagnóstico:</p>
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {patient.diagnosis || patient.provisionalDiagnosis || "Sin diagnóstico"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                patient.status === "en mejoria" ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {patient.status === "en mejoria" ? "En mejoria" : "En observación"}
              </span>
              
              <button 
                onClick={() => setSelectedPatient(patient)}
                className="text-xs text-purple-600 hover:text-purple-800 hover:underline"
              >
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para el perfil del paciente */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm overflow-y-auto">
          <div className="container mx-auto py-8">
            <PatientProfile 
              patient={selectedPatient} 
              onClose={(updatedPatient) => {
                if (updatedPatient) {
                  setPatients(patients.map(p => 
                    p.id === updatedPatient.id ? updatedPatient : p
                  ));
                }
                setSelectedPatient(null);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}