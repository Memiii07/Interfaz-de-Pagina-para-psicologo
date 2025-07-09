import { useState, useRef } from 'react';
import { FiUser, FiCalendar, FiPhone, FiMail, FiX, FiEdit, FiSave, FiFileText, FiActivity, FiMessageSquare, FiBarChart2, FiDownload, FiImage, FiSend } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Registra los componentes de Chart.js
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const PatientProfile = ({ patient, onClose }) => {
  const [activeTab, setActiveTab] = useState('medicalHistory');
  const [isEditing, setIsEditing] = useState(false);
  const profileRef = useRef();
  
  // Estados para cada sección
  const [medicalHistory, setMedicalHistory] = useState({
    placeOfBirth: '',
    residence: '',
    address: '',
    sexualOrientation: '',
    religiousOrientation: '',
    occupation: '',
    medicalHistory: '',
    medicalFamilyHistory: '',
    hobbies: '',
    learningMethods: '',
    childhoodSummary: '',
    adolescenceSummary: '',
    adulthoodSummary: '',
    psychologicalBackground: '',
    traumaHistory: ''
  });
  
  const [diagnosis, setDiagnosis] = useState({
    behavior: '',
    personality: '',
    bodyLanguage: '',
    provisionalDiagnosis: patient.provisionalDiagnosis || '',
    finalDiagnosis: patient.diagnosis || '',
    diagnosticCriteria: '',
    recommendedSessions: '',
    diagnosisDate: '',
    nextReviewDate: '',
    status: patient.status || 'en observación'
  });
  
  const [treatment, setTreatment] = useState({
    activities: '',
    advances: '',
    relapse: '',
    sessionDate: '',
    nextSessionGoals: '',
    therapistNotes: '',
    moodRating: ''
  });
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
 const [emotionsConfig, setEmotionsConfig] = useState({
  positive: [
    { id: 1, name: "Felicidad", color: "#4ADE80" }, // Verde
    { id: 2, name: "Calma", color: "#60A5FA" },    // Azul
    { id: 3, name: "Motivación", color: "#FBBF24" }, // Amarillo
    { id: 4, name: "Gratitud", color: "#A78BFA" },  // Morado claro
    { id: 5, name: "Amor", color: "#F87171" }       // Rojo claro
  ],
  negative: [
    { id: 6, name: "Tristeza", color: "#3B82F6" },  // Azul
    { id: 7, name: "Enojo", color: "#EF4444" },     // Rojo
    { id: 8, name: "Ansiedad", color: "#F59E0B" },  // Ámbar
    { id: 9, name: "Frustración", color: "#8B5CF6" }, // Morado
    { id: 10, name: "Soledad", color: "#6B7280" }    // Gris
  ]
});

// Estado para el periodo activo
const [activePeriod, setActivePeriod] = useState('weekly');

// Datos de ejemplo estructurados
const [statsData, setStatsData] = useState({
  weekly: {
    emotions: {
      1: [7, 8, 6, 9, 7, 8, 7], // Felicidad
      2: [6, 7, 5, 8, 6, 7, 6], // Calma
      3: [8, 7, 9, 8, 7, 9, 8], // Motivación
      4: [7, 6, 8, 7, 6, 8, 7], // Gratitud
      5: [6, 7, 5, 8, 6, 7, 6], // Amor
      6: [3, 4, 5, 2, 3, 4, 3], // Tristeza
      7: [2, 3, 4, 1, 2, 3, 2], // Enojo
      8: [5, 4, 6, 3, 5, 4, 6], // Ansiedad
      9: [4, 3, 5, 2, 4, 3, 5], // Frustración
      10: [3, 2, 4, 1, 3, 2, 4] // Soledad
    }
  },
  monthly: {
    emotions: {
      1: [7.2, 7.5, 7.8, 7.1],
      2: [6.8, 7.1, 7.3, 6.9],
      3: [8.1, 8.4, 8.7, 8.2],
      4: [7.0, 7.3, 7.6, 7.1],
      5: [6.9, 7.2, 7.5, 7.0],
      6: [3.5, 3.2, 3.7, 3.1],
      7: [2.8, 3.1, 2.9, 2.5],
      8: [5.1, 4.8, 5.3, 4.9],
      9: [4.2, 3.9, 4.4, 4.0],
      10: [3.3, 3.0, 3.5, 3.1]
    }
  },
  yearly: {
    emotions: {
      1: [7.2, 7.5, 7.8, 7.1, 7.4, 7.6, 7.3, 7.7, 7.5, 7.2, 7.6, 7.4],
      2: [6.8, 7.1, 7.3, 6.9, 7.0, 7.2, 6.9, 7.3, 7.1, 6.8, 7.2, 7.0],
      3: [8.1, 8.4, 8.7, 8.2, 8.5, 8.8, 8.3, 8.7, 8.5, 8.2, 8.6, 8.4],
      4: [7.0, 7.3, 7.6, 7.1, 7.4, 7.7, 7.2, 7.6, 7.4, 7.1, 7.5, 7.3],
      5: [6.9, 7.2, 7.5, 7.0, 7.3, 7.6, 7.1, 7.5, 7.3, 7.0, 7.4, 7.2],
      6: [3.5, 3.2, 3.7, 3.1, 3.6, 3.3, 3.8, 3.2, 3.6, 3.3, 3.7, 3.4],
      7: [2.8, 3.1, 2.9, 2.5, 2.7, 2.8, 2.6, 2.9, 2.7, 2.5, 2.8, 2.6],
      8: [5.1, 4.8, 5.3, 4.9, 5.2, 4.9, 5.4, 5.0, 5.3, 5.0, 5.4, 5.1],
      9: [4.2, 3.9, 4.4, 4.0, 4.3, 4.0, 4.5, 4.1, 4.4, 4.1, 4.5, 4.2],
      10: [3.3, 3.0, 3.5, 3.1, 3.4, 3.1, 3.6, 3.2, 3.5, 3.2, 3.6, 3.3]
    }
  }
});

// Helper functions
const getPeriodLabels = (period) => {
  switch(period) {
    case 'weekly': return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    case 'monthly': return ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    case 'yearly': return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    default: return [];
  }
};

const calculateAverage = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) return 0;
  const sum = data.reduce((a, b) => a + b, 0);
  return sum / data.length;
};

const getDominantEmotion = (type, period) => {
  try {
    const emotions = type === 'positive' ? emotionsConfig.positive : emotionsConfig.negative;
    
    if (!statsData || !statsData[period] || !statsData[period].emotions) {
      return [];
    }

    return emotions
      .filter(emotion => statsData[period].emotions[emotion.id])
      .map(emotion => ({
        ...emotion,
        average: calculateAverage(statsData[period].emotions[emotion.id])
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 1);
  } catch (error) {
    console.error("Error en getDominantEmotion:", error);
    return [];
  }
};

// Función principal para generar el PDF
const generatePDF = async (patient, medicalHistory) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configuración básica
    const title = `HISTORIAL MÉDICO - ${patient.name.toUpperCase()} ${patient.lastName.toUpperCase()}`;
    const date = new Date().toLocaleDateString('es-ES');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const lineHeight = 7;

    // Agregar logo
    try {
      // Cambia esta ruta por la ubicación correcta de tu logo
      const logoResponse = await fetch('/logo-psicocare.png');
      const logoBlob = await logoResponse.blob();
      const logoUrl = URL.createObjectURL(logoBlob);
      
      const logoImg = new Image();
      logoImg.src = logoUrl;
      
      await new Promise((resolve) => {
        logoImg.onload = resolve;
      });

      // Ajusta estos valores según necesites (posición X, posición Y, ancho, alto)
      doc.addImage(logoImg, 'PNG', pageWidth - 40, 10, 30, 30);
    } catch (error) {
      console.warn('No se pudo cargar el logo:', error);
      // Si falla la carga del logo, continuamos sin él
    }

    // Título principal
    doc.setFontSize(16);
    doc.text(title, pageWidth / 2, 20, { align: 'center' });

    // Fecha
    doc.setFontSize(12);
    doc.text(`Generado el: ${date}`, pageWidth / 2, 30, { align: 'center' });

    // Línea divisoria
    doc.setDrawColor(100, 100, 100);
    doc.line(margin, 40, pageWidth - margin, 40);

    // Posición inicial para el contenido
    let yPosition = 50;

    // Función para agregar secciones
    const addSection = (title, content) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(title.toUpperCase(), margin, yPosition);
      yPosition += 10;

      doc.setFont(undefined, 'normal');
      doc.setFontSize(12);
      
      if (typeof content === 'string') {
        const lines = doc.splitTextToSize(content, pageWidth - margin * 2);
        doc.text(lines, margin + 5, yPosition);
        yPosition += lines.length * lineHeight + 5;
      } else if (Array.isArray(content)) {
        content.forEach(item => {
          const lines = doc.splitTextToSize(item, pageWidth - margin * 2 - 10);
          doc.text(lines, margin + 5, yPosition);
          yPosition += lines.length * lineHeight + 5;
        });
      }
    };

    // 1. INFORMACIÓN BÁSICA DEL PACIENTE
    addSection('Información Básica', [
      `Nombre: ${patient.name} ${patient.lastName}`,
      `Edad: ${calculateAge(patient.birthDate)} años`,
      `Cédula: ${patient.ci}`,
      `Fecha de nacimiento: ${new Date(patient.birthDate).toLocaleDateString('es-ES')}`,
      `Género: ${patient.gender}`,
      `Teléfono: ${patient.phone}`,
      `Email: ${patient.email}`,
      `Contacto emergencia: ${patient.emergencyContact}`
    ]);

    // 2. INFORMACIÓN DEMOGRÁFICA
    addSection('Información Demográfica', [
      `Lugar de nacimiento: ${medicalHistory.placeOfBirth || 'No especificado'}`,
      `Residencia: ${medicalHistory.residence || 'No especificado'}`,
      `Dirección: ${medicalHistory.address || 'No especificado'}`,
      `Orientación sexual: ${medicalHistory.sexualOrientation || 'No especificado'}`,
      `Orientación religiosa: ${medicalHistory.religiousOrientation || 'No especificado'}`,
      `Ocupación: ${medicalHistory.occupation || 'No especificado'}`
    ]);

    // 3. HISTORIAL MÉDICO
    if (medicalHistory.medicalHistory) {
      addSection('Historial Médico Personal', medicalHistory.medicalHistory);
    }

    // 4. HISTORIAL MÉDICO FAMILIAR
    if (medicalHistory.medicalFamilyHistory) {
      addSection('Historial Médico Familiar', medicalHistory.medicalFamilyHistory);
    }

    // 5. ANTECEDENTES PSICOLÓGICOS
    if (medicalHistory.psychologicalBackground) {
      addSection('Antecedentes Psicológicos', medicalHistory.psychologicalBackground);
    }

    // 6. HISTORIAL DE TRAUMAS
    if (medicalHistory.traumaHistory) {
      addSection('Historial de Traumas', medicalHistory.traumaHistory);
    }

    // 7. HOBBIES Y MÉTODOS DE APRENDIZAJE
    if (medicalHistory.hobbies || medicalHistory.learningMethods) {
      addSection('Intereses y Aprendizaje', [
        `Hobbies: ${medicalHistory.hobbies || 'No especificado'}`,
        `Métodos de aprendizaje: ${medicalHistory.learningMethods || 'No especificado'}`
      ]);
    }

    // 8. RESUMENES DE VIDA
    addSection('Resúmenes de Vida', [
      `Infancia: ${medicalHistory.childhoodSummary || 'No especificado'}`,
      `Adolescencia: ${medicalHistory.adolescenceSummary || 'No especificado'}`,
      `Adultez: ${medicalHistory.adulthoodSummary || 'No especificado'}`
    ]);

    // Pie de página
    const currentPage = doc.internal.getNumberOfPages();
    for (let i = 1; i <= currentPage; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('CONFIDENCIAL - USO EXCLUSIVO DEL PACIENTE', pageWidth / 2, 287, { align: 'center' });
      doc.text(`Página ${i} de ${currentPage}`, pageWidth / 2, 293, { align: 'center' });
    }

    // Guardar el PDF
    doc.save(`Historial_${patient.name}_${patient.lastName}.pdf`);
    alert('PDF generado con éxito');

  } catch (error) {
    console.error('Error al generar el PDF:', error);
    alert('Ocurrió un error al generar el PDF. Por favor, inténtalo de nuevo.');
  }
};

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: newMessage,
        sender: 'therapist',
        timestamp: new Date().toISOString()
      }]);
      setNewMessage('');
    }
  };

  // 2. Añade un estado para controlar cambios no guardados
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

// 3. Modifica handleSaveChanges para no cerrar el perfil
const handleSaveChanges = () => {
  setIsEditing(false);
  // Marcar que hay cambios guardados pero no aplicados a la tarjeta aún
  setHasUnsavedChanges(true);
  // Aquí podrías agregar lógica para guardar en una API si es necesario
};

// 4. Nueva función para manejar el cierre manual
const handleManualClose = () => {
  if (hasUnsavedChanges) {
    // Crear el objeto de paciente actualizado
    const updatedPatient = {
      ...patient,
      diagnosis: diagnosis.finalDiagnosis,
      provisionalDiagnosis: diagnosis.provisionalDiagnosis,
      status: diagnosis.status
    };
    onClose(updatedPatient);
  } else {
    onClose(null); // Cierra sin cambios
  }
};

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

  const [emergencyAccess, setEmergencyAccess] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4">
      <div 
        ref={profileRef}
        className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in w-full max-w-5xl max-h-[90vh] flex flex-col"
      >
      {/* Header con datos básicos del paciente */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className="relative">
                {patient.photo ? (
                  <img 
                    src={patient.photo} 
                    alt={`${patient.name} ${patient.lastName}`} 
                    className="h-20 w-20 rounded-full object-cover border-4 border-white/20"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-purple-500 flex items-center justify-center border-4 border-white/20">
                    <FiUser size={32} className="text-white" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <FiImage className="text-purple-600" size={14} />
                </button>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">{patient.name} {patient.lastName}</h2>
                <p className="text-purple-200">{calculateAge(patient.birthDate)} años</p>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-300">Cédula:</span>
                    <span>{patient.ci}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-300">Teléfono:</span>
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-300">Email:</span>
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-300">Contacto:</span>
                    <span>{patient.emergencyContact}</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
                onClick={handleManualClose}
                className="text-white hover:text-purple-200 transition-colors"
                >
                <FiX size={24} />
            </button>
          </div>
        </div>
      
      {/* Pestañas de navegación */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'medicalHistory', label: 'Historial Médico', icon: <FiFileText size={16} /> },
              { id: 'diagnosis', label: 'Diagnóstico', icon: <FiActivity size={16} /> },
              { id: 'treatment', label: 'Tratamiento', icon: <FiMessageSquare size={16} /> },
              { id: 'chat', label: 'Chat', icon: <FiMessageSquare size={16} /> },
              { id: 'stats', label: 'Estadísticas', icon: <FiBarChart2 size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'border-b-2 border-purple-600 text-purple-600 bg-white' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      
      {/* Contenido de las pestañas */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Botón de edición (no disponible en chat y estadísticas) */}
          {activeTab !== 'chat' && activeTab !== 'stats' && (
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {activeTab === 'medicalHistory' && 'Historial Médico'}
                {activeTab === 'diagnosis' && 'Diagnóstico'}
                {activeTab === 'treatment' && 'Tratamiento'}
              </h3>
              
              <div className="flex gap-3">
                {activeTab === 'medicalHistory' && (
                    <button 
                        onClick={() => generatePDF(patient, medicalHistory)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all text-sm"
                    >
                        <FiFileText size={14} />
                        Exportar PDF
                    </button>
                )}
                
                {isEditing ? (
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all text-sm"
                  >
                    <FiSave size={14} />
                    Guardar cambios
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all text-sm"
                  >
                    <FiEdit size={14} />
                    Editar
                  </button>
                )}
              </div>
            </div>
          )}
        
        {/* Historial Médico */}
          {activeTab === 'medicalHistory' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lugar de nacimiento</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={medicalHistory.placeOfBirth}
                      onChange={(e) => setMedicalHistory({...medicalHistory, placeOfBirth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ciudad, País"
                    />
                  ) : (
                    <p className="text-gray-800">{medicalHistory.placeOfBirth || 'No especificado'}</p>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Residencia</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={medicalHistory.residence}
                      onChange={(e) => setMedicalHistory({...medicalHistory, residence: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ciudad actual"
                    />
                  ) : (
                    <p className="text-gray-800">{medicalHistory.residence || 'No especificado'}</p>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={medicalHistory.address}
                      onChange={(e) => setMedicalHistory({...medicalHistory, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Dirección completa"
                    />
                  ) : (
                    <p className="text-gray-800">{medicalHistory.address || 'No especificado'}</p>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Orientación sexual</label>
                  {isEditing ? (
                    <select
                      value={medicalHistory.sexualOrientation}
                      onChange={(e) => setMedicalHistory({...medicalHistory, sexualOrientation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar</option>
                      <option value="Heterosexual">Heterosexual</option>
                      <option value="Homosexual">Homosexual</option>
                      <option value="Bisexual">Bisexual</option>
                      <option value="Pansexual">Pansexual</option>
                      <option value="Asexual">Asexual</option>
                      <option value="Otro">Otro</option>
                    </select>
                  ) : (
                    <p className="text-gray-800">{medicalHistory.sexualOrientation || 'No especificado'}</p>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Orientación religiosa</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={medicalHistory.religiousOrientation}
                      onChange={(e) => setMedicalHistory({...medicalHistory, religiousOrientation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Religión o creencias"
                    />
                  ) : (
                    <p className="text-gray-800">{medicalHistory.religiousOrientation || 'No especificado'}</p>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ocupación</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={medicalHistory.occupation}
                      onChange={(e) => setMedicalHistory({...medicalHistory, occupation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Profesión o trabajo"
                    />
                  ) : (
                    <p className="text-gray-800">{medicalHistory.occupation || 'No especificado'}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Historial médico</label>
                  {isEditing ? (
                    <textarea
                      value={medicalHistory.medicalHistory}
                      onChange={(e) => setMedicalHistory({...medicalHistory, medicalHistory: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enfermedades, cirugías, alergias, etc."
                    />
                  ) : (
                    <p className="text-gray-800 whitespace-pre-line">
                      {medicalHistory.medicalHistory || 'No especificado'}
                    </p>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Historial médico familiar</label>
                  {isEditing ? (
                    <textarea
                      value={medicalHistory.medicalFamilyHistory}
                      onChange={(e) => setMedicalHistory({...medicalHistory, medicalFamilyHistory: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enfermedades hereditarias o comunes en la familia"
                    />
                  ) : (
                    <p className="text-gray-800 whitespace-pre-line">
                      {medicalHistory.medicalFamilyHistory || 'No especificado'}
                    </p>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hobbies</label>
                  {isEditing ? (
                    <textarea
                      value={medicalHistory.hobbies}
                      onChange={(e) => setMedicalHistory({...medicalHistory, hobbies: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Actividades de ocio o interés"
                    />
                  ) : (
                    <p className="text-gray-800 whitespace-pre-line">
                      {medicalHistory.hobbies || 'No especificado'}
                    </p>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Métodos de aprendizaje</label>
                  {isEditing ? (
                    <textarea
                      value={medicalHistory.learningMethods}
                      onChange={(e) => setMedicalHistory({...medicalHistory, learningMethods: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Cómo aprende mejor el paciente"
                    />
                  ) : (
                    <p className="text-gray-800 whitespace-pre-line">
                      {medicalHistory.learningMethods || 'No especificado'}
                    </p>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resumen de infancia</label>
                  {isEditing ? (
                    <textarea
                      value={medicalHistory.childhoodSummary}
                      onChange={(e) => setMedicalHistory({...medicalHistory, childhoodSummary: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Eventos importantes durante la infancia"
                    />
                  ) : (
                    <p className="text-gray-800 whitespace-pre-line">
                      {medicalHistory.childhoodSummary || 'No especificado'}
                    </p>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resumen de adolescencia</label>
                  {isEditing ? (
                    <textarea
                      value={medicalHistory.adolescenceSummary}
                      onChange={(e) => setMedicalHistory({...medicalHistory, adolescenceSummary: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Eventos importantes durante la adolescencia"
                    />
                  ) : (
                    <p className="text-gray-800 whitespace-pre-line">
                      {medicalHistory.adolescenceSummary || 'No especificado'}
                    </p>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resumen de adultez</label>
                  {isEditing ? (
                    <textarea
                      value={medicalHistory.adulthoodSummary}
                      onChange={(e) => setMedicalHistory({...medicalHistory, adulthoodSummary: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Eventos importantes durante la adultez"
                    />
                  ) : (
                    <p className="text-gray-800 whitespace-pre-line">
                      {medicalHistory.adulthoodSummary || 'No especificado'}
                    </p>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Antecedentes psicológicos</label>
                  {isEditing ? (
                    <textarea
                      value={medicalHistory.psychologicalBackground}
                      onChange={(e) => setMedicalHistory({...medicalHistory, psychologicalBackground: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Tratamientos psicológicos previos"
                    />
                  ) : (
                    <p className="text-gray-800 whitespace-pre-line">
                      {medicalHistory.psychologicalBackground || 'No especificado'}
                    </p>
                  )}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Historial de traumas</label>
                  {isEditing ? (
                    <textarea
                      value={medicalHistory.traumaHistory}
                      onChange={(e) => setMedicalHistory({...medicalHistory, traumaHistory: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Eventos traumáticos en la vida del paciente"
                    />
                  ) : (
                    <p className="text-gray-800 whitespace-pre-line">
                      {medicalHistory.traumaHistory || 'No especificado'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        
        {/* Diagnóstico */}
{activeTab === 'diagnosis' && (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Comportamiento */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiActivity className="text-purple-600" /> Comportamiento
        </label>
        {isEditing ? (
          <textarea
            value={diagnosis.behavior}
            onChange={(e) => setDiagnosis({...diagnosis, behavior: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ej: Ansiedad en situaciones sociales..."
          />
        ) : (
          <p className="text-gray-800 whitespace-pre-line">
            {diagnosis.behavior || 'No registrado'}
          </p>
        )}
      </div>

      {/* Personalidad */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiUser className="text-purple-600" /> Personalidad
        </label>
        {isEditing ? (
          <textarea
            value={diagnosis.personality}
            onChange={(e) => setDiagnosis({...diagnosis, personality: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ej: Introvertido pero con tendencias impulsivas..."
          />
        ) : (
          <p className="text-gray-800 whitespace-pre-line">
            {diagnosis.personality || 'No registrado'}
          </p>
        )}
      </div>

      {/* Lenguaje Corporal */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiUser className="text-purple-600" /> Lenguaje Corporal
        </label>
        {isEditing ? (
          <textarea
            value={diagnosis.bodyLanguage}
            onChange={(e) => setDiagnosis({...diagnosis, bodyLanguage: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ej: Postura cerrada, contacto visual intermitente..."
          />
        ) : (
          <p className="text-gray-800 whitespace-pre-line">
            {diagnosis.bodyLanguage || 'No registrado'}
          </p>
        )}
      </div>

      {/* Diagnóstico Provisional */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiFileText className="text-purple-600" /> Diagnóstico Provisional
        </label>
        {isEditing ? (
            <textarea
                value={diagnosis.provisionalDiagnosis}
                onChange={(e) => {
                setDiagnosis({...diagnosis, provisionalDiagnosis: e.target.value});
                setHasUnsavedChanges(true);  // <-- Línea nueva
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: Trastorno de ansiedad generalizada (F41.1)"
            />
            ) : (
            <p className="text-gray-800 whitespace-pre-line">
                {diagnosis.provisionalDiagnosis || 'No registrado'}
            </p>
        )}
      </div>

      {/* Diagnóstico Final */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiFileText className="text-purple-600" /> Diagnóstico Final
        </label>
        {isEditing ? (
  <textarea
    value={diagnosis.finalDiagnosis}
    onChange={(e) => {
      setDiagnosis({...diagnosis, finalDiagnosis: e.target.value});
      setHasUnsavedChanges(true);  // <-- Esta es la única línea nueva que necesitas agregar
    }}
    rows={3}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    placeholder="Ej: Trastorno mixto ansioso-depresivo (F41.2)"
  />
) : (
  <p className="text-gray-800 whitespace-pre-line">
    {diagnosis.finalDiagnosis || 'No registrado'}
  </p>
)}
      </div>

      {/* Criterios Diagnósticos */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiFileText className="text-purple-600" /> Criterios Diagnósticos
        </label>
        {isEditing ? (
          <textarea
            value={diagnosis.diagnosticCriteria}
            onChange={(e) => setDiagnosis({...diagnosis, diagnosticCriteria: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ej: DSM-5 Criterio A, B, C..."
          />
        ) : (
          <p className="text-gray-800 whitespace-pre-line">
            {diagnosis.diagnosticCriteria || 'No registrado'}
          </p>
        )}
      </div>

      {/* Sesiones Recomendadas */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiCalendar className="text-purple-600" /> Sesiones Recomendadas
        </label>
        {isEditing ? (
          <input
            type="number"
            min="1"
            value={diagnosis.recommendedSessions}
            onChange={(e) => setDiagnosis({...diagnosis, recommendedSessions: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ej: 12"
          />
        ) : (
          <p className="text-gray-800">
            {diagnosis.recommendedSessions || 'No registrado'}
          </p>
        )}
      </div>

      {/* Fecha de Diagnóstico */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiCalendar className="text-purple-600" /> Fecha de Diagnóstico
        </label>
        {isEditing ? (
          <input
            type="date"
            value={diagnosis.diagnosisDate}
            onChange={(e) => setDiagnosis({...diagnosis, diagnosisDate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-800">
            {diagnosis.diagnosisDate 
              ? new Date(diagnosis.diagnosisDate).toLocaleDateString('es-ES') 
              : 'No registrado'}
          </p>
        )}
      </div>

      {/* Próxima Revisión */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiCalendar className="text-purple-600" /> Próxima Revisión
        </label>
        {isEditing ? (
          <input
            type="date"
            value={diagnosis.nextReviewDate}
            onChange={(e) => setDiagnosis({...diagnosis, nextReviewDate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-800">
            {diagnosis.nextReviewDate 
              ? new Date(diagnosis.nextReviewDate).toLocaleDateString('es-ES') 
              : 'No registrado'}
          </p>
        )}
      </div>

      {/* Estado */}
<div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
    <FiActivity className="text-purple-600" /> Estado
  </label>
  {isEditing ? (
    <select
      value={diagnosis.status}
      onChange={(e) => {
        setDiagnosis({...diagnosis, status: e.target.value});
        setHasUnsavedChanges(true);  // <- Esta es la línea nueva que marca cambios no guardados
      }}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    >
      <option value="en observación">En observación</option>
      <option value="en mejoria">En mejoria</option>
    </select>
  ) : (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
      diagnosis.status === "en mejoria" ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
    }`}>
      {diagnosis.status === "en mejoria" ? "En mejoria" : "En observación"}
    </span>
  )}      
</div>
      {/* Boton de Emergencia */}
<div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Acceso a Botón de Emergencia
  </label>
  <div className="flex items-center gap-4">
    <span className="text-sm">
      {emergencyAccess ? 'Activado' : 'Desactivado'}
    </span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        checked={emergencyAccess}
        onChange={() => setEmergencyAccess(!emergencyAccess)}
        className="sr-only peer" 
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
    </label>
    {emergencyAccess && (
      <span className="text-xs text-green-600">
        El paciente tendrá acceso al botón
      </span>
    )}
  </div>
</div>
    </div>
  </div>
)}
        
        {/* Tratamiento */}
{activeTab === 'treatment' && (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Actividades */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiActivity className="text-purple-600" /> Actividades
        </label>
        {isEditing ? (
          <textarea
            value={treatment.activities}
            onChange={(e) => setTreatment({...treatment, activities: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ej: Ejercicios de respiración, diario emocional..."
          />
        ) : (
          <p className="text-gray-800 whitespace-pre-line">
            {treatment.activities || 'No registrado'}
          </p>
        )}
      </div>

      {/* Avances */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiActivity className="text-purple-600" /> Avances
        </label>
        {isEditing ? (
          <textarea
            value={treatment.advances}
            onChange={(e) => setTreatment({...treatment, advances: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ej: Mejoría en manejo de ansiedad..."
          />
        ) : (
          <p className="text-gray-800 whitespace-pre-line">
            {treatment.advances || 'No registrado'}
          </p>
        )}
      </div>

      {/* Recaídas */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiActivity className="text-purple-600" /> Recaídas
        </label>
        {isEditing ? (
          <textarea
            value={treatment.relapse}
            onChange={(e) => setTreatment({...treatment, relapse: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ej: Episodio de ansiedad el 15/03..."
          />
        ) : (
          <p className="text-gray-800 whitespace-pre-line">
            {treatment.relapse || 'No registrado'}
          </p>
        )}
      </div>

      {/* Fecha de Sesión */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiCalendar className="text-purple-600" /> Fecha de Sesión
        </label>
        {isEditing ? (
          <input
            type="date"
            value={treatment.sessionDate}
            onChange={(e) => setTreatment({...treatment, sessionDate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-800">
            {treatment.sessionDate 
              ? new Date(treatment.sessionDate).toLocaleDateString('es-ES') 
              : 'No registrado'}
          </p>
        )}
      </div>

      {/* Objetivos Próxima Sesión */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiActivity className="text-purple-600" /> Objetivos Próxima Sesión
        </label>
        {isEditing ? (
          <textarea
            value={treatment.nextSessionGoals}
            onChange={(e) => setTreatment({...treatment, nextSessionGoals: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ej: Trabajar en técnicas de relajación..."
          />
        ) : (
          <p className="text-gray-800 whitespace-pre-line">
            {treatment.nextSessionGoals || 'No registrado'}
          </p>
        )}
      </div>

      {/* Notas del Terapeuta */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiFileText className="text-purple-600" /> Notas del Terapeuta
        </label>
        {isEditing ? (
          <textarea
            value={treatment.therapistNotes}
            onChange={(e) => setTreatment({...treatment, therapistNotes: e.target.value})}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Observaciones relevantes..."
          />
        ) : (
          <p className="text-gray-800 whitespace-pre-line">
            {treatment.therapistNotes || 'No registrado'}
          </p>
        )}
      </div>

      {/* Valoración del Estado de Ánimo */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FiActivity className="text-purple-600" /> Estado de Ánimo (1-10)
        </label>
        {isEditing ? (
          <div>
            <input
              type="range"
              min="1"
              max="10"
              value={treatment.moodRating}
              onChange={(e) => setTreatment({...treatment, moodRating: e.target.value})}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 (Bajo)</span>
              <span>10 (Alto)</span>
            </div>
            <div className="text-center mt-2">
              <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {treatment.moodRating || '5'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${(treatment.moodRating || 5) * 10}%` }}
              ></div>
            </div>
            <span className="text-gray-800 font-medium">
              {treatment.moodRating || '5'}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
)}
        
        {/* Chat */}
{activeTab === 'chat' && (
  <div className="flex flex-col h-[500px] border border-gray-200 rounded-lg bg-gray-50">
    {/* Encabezado del chat */}
    <div className="bg-purple-600 text-white p-3 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FiMessageSquare size={18} />
        <h3 className="font-medium">Chat con {patient.name}</h3>
      </div>
      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
        {messages.length} mensajes
      </span>
    </div>

    {/* Área de mensajes */}
    <div className="flex-1 p-4 overflow-y-auto space-y-3">
      {messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "therapist" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] md:max-w-[60%] px-4 py-2 rounded-lg ${
                message.sender === "therapist"
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-1 text-right">
                {new Date(message.timestamp).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-gray-500">
          <FiMessageSquare size={48} className="opacity-30 mb-4" />
          <p>No hay mensajes aún.</p>
          <p className="text-sm">Envía un mensaje para iniciar la conversación.</p>
        </div>
      )}
    </div>

    {/* Input de mensaje */}
    <div className="border-t border-gray-200 p-3 bg-white rounded-b-lg">
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className={`p-2 rounded-full ${
            newMessage.trim()
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          } transition-colors`}
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  </div>
)}
    {/* Estadísticas */}
{activeTab === 'stats' && (
  <div className="space-y-8">
    {/* Selector de Periodo - Estilo conservado */}
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-sm font-medium text-gray-700">Periodo:</span>
        <button 
          onClick={() => setActivePeriod('weekly')}
          className={`px-3 py-1 rounded-full text-sm ${
            activePeriod === 'weekly' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Semanal
        </button>
        <button 
          onClick={() => setActivePeriod('monthly')}
          className={`px-3 py-1 rounded-full text-sm ${
            activePeriod === 'monthly' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Mensual
        </button>
        <button 
          onClick={() => setActivePeriod('yearly')}
          className={`px-3 py-1 rounded-full text-sm ${
            activePeriod === 'yearly' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Anual
        </button>
      </div>
    </div>

    {/* Gráfico de Emociones Positivas - Estilo conservado */}
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FiBarChart2 className="text-green-500" /> Emociones Positivas
      </h3>
      
      {/* Leyenda de emociones positivas */}
      <div className="flex flex-wrap gap-4 mb-4">
        {emotionsConfig.positive.map(emotion => (
          <div key={emotion.name} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: emotion.color }}
            />
            <span className="text-gray-700">{emotion.name}</span>
          </div>
        ))}
      </div>
      
      <div className="h-64">
        <Bar
          data={{
            labels: getPeriodLabels(activePeriod),
            datasets: emotionsConfig.positive.map(emotion => ({
              label: emotion.name,
              data: statsData[activePeriod].emotions[emotion.id],
              backgroundColor: emotion.color,
              borderRadius: 6
            }))
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 10,
                ticks: { stepSize: 2 }
              }
            },
            plugins: {
              legend: { display: false }
            }
          }}
        />
      </div>
    </div>

    {/* Gráfico de Emociones Negativas - Estilo conservado */}
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FiBarChart2 className="text-red-500" /> Emociones Negativas
      </h3>
      
      {/* Leyenda de emociones negativas */}
      <div className="flex flex-wrap gap-4 mb-4">
        {emotionsConfig.negative.map(emotion => (
          <div key={emotion.name} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: emotion.color }}
            />
            <span className="text-gray-700">{emotion.name}</span>
          </div>
        ))}
      </div>
      
      <div className="h-64">
        <Bar
          data={{
            labels: getPeriodLabels(activePeriod),
            datasets: emotionsConfig.negative.map(emotion => ({
              label: emotion.name,
              data: statsData[activePeriod].emotions[emotion.id],
              backgroundColor: emotion.color,
              borderRadius: 6
            }))
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 10,
                ticks: { stepSize: 2 }
              }
            },
            plugins: {
              legend: { display: false }
            }
          }}
        />
      </div>
    </div>

    {/* Tendencias Mensuales (Gráfico combinado) - Estilo conservado */}
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FiActivity className="text-purple-600" /> Tendencias {activePeriod === 'weekly' ? 'Semanales' : activePeriod === 'monthly' ? 'Mensuales' : 'Anuales'}
      </h3>
      
      {/* Leyenda para el gráfico de tendencias */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center text-sm">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: emotionsConfig.positive[0].color }}
          />
          <span className="text-gray-700">{emotionsConfig.positive[0].name} (Positiva)</span>
        </div>
        <div className="flex items-center text-sm">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: emotionsConfig.negative[2].color }}
          />
          <span className="text-gray-700">{emotionsConfig.negative[2].name} (Negativa)</span>
        </div>
      </div>
      
      <div className="h-64">
        <Line
          data={{
            labels: getPeriodLabels(activePeriod),
            datasets: [
              {
                label: `${emotionsConfig.positive[0].name} (Positiva)`,
                data: statsData[activePeriod].emotions[emotionsConfig.positive[0].id],
                borderColor: emotionsConfig.positive[0].color,
                tension: 0.3
              },
              {
                label: `${emotionsConfig.negative[2].name} (Negativa)`,
                data: statsData[activePeriod].emotions[emotionsConfig.negative[2].id],
                borderColor: emotionsConfig.negative[2].color,
                tension: 0.3
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, max: 10 }
            },
            plugins: {
              legend: { display: false }
            }
          }}
        />
      </div>
      <div className="mt-3 text-sm text-gray-500">
        <p>Comparativa entre la emoción positiva más fuerte y la negativa más frecuente.</p>
      </div>
    </div>

    {/* Resumen de Progreso - Estilo conservado */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <h4 className="font-medium text-green-800 mb-2">Emoción Positiva Dominante</h4>
        {getDominantEmotion('positive', activePeriod).map(emotion => (
          <div key={emotion.id} className="mb-3 last:mb-0">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: emotion.color }}
              ></div>
              <span className="font-bold">{emotion.name}</span>
              <span className="ml-auto text-lg font-bold text-green-600">
                {calculateAverage(statsData[activePeriod].emotions[emotion.id]).toFixed(1)}/10
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ 
                  width: `${calculateAverage(statsData[activePeriod].emotions[emotion.id]) * 10}%` 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-red-50 p-4 rounded-lg border border-red-100">
        <h4 className="font-medium text-red-800 mb-2">Emoción Negativa a Trabajar</h4>
        {getDominantEmotion('negative', activePeriod).map(emotion => (
          <div key={emotion.id} className="mb-3 last:mb-0">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: emotion.color }}
              ></div>
              <span className="font-bold">{emotion.name}</span>
              <span className="ml-auto text-lg font-bold text-red-600">
                {calculateAverage(statsData[activePeriod].emotions[emotion.id]).toFixed(1)}/10
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ 
                  width: `${calculateAverage(statsData[activePeriod].emotions[emotion.id]) * 10}%` 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

        
      </div>
    </div>
    </div>
  );
};

export default PatientProfile;