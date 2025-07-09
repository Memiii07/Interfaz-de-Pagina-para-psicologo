import { useState, useEffect } from 'react';
import { FiEdit, FiMail, FiPhone, FiCopy, FiMapPin, FiAward, FiSave } from "react-icons/fi";
import { QRCodeSVG } from 'qrcode.react';

export default function ProfileSection() {
  // Función para generar un código de 6 dígitos
  const generateUniqueCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Datos iniciales con código único
  const initialData = {
    name: "Dra. María Pérez",
    specialty: "Psicología Clínica",
    specialty2: "Terapia Cognitivo-Conductual",
    license: "MP 12345",
    email: "maria@psicocare.com",
    phone: "+57 310 123 4567",
    address: "Calle 123 #45-67, Consultorio 302, Bogotá",
    photo: "/avatar-profesional.jpg",
    uniqueCode: generateUniqueCode()
  };

  const [psychologist, setPsychologist] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const connectionCode = psychologist.uniqueCode;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPsychologist(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Aquí iría la lógica para guardar en tu backend
    // IMPORTANTE: Asegúrate de que el backend mantenga el mismo uniqueCode
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(connectionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // En producción, deberías obtener este código de tu backend
  useEffect(() => {
    // Simulación: obtenemos el código del localStorage (en una app real sería una API call)
    const storedCode = localStorage.getItem('psychologistUniqueCode');
    if (storedCode) {
      setPsychologist(prev => ({ ...prev, uniqueCode: storedCode }));
    } else {
      const newCode = generateUniqueCode();
      localStorage.setItem('psychologistUniqueCode', newCode);
      setPsychologist(prev => ({ ...prev, uniqueCode: newCode }));
    }
  }, []);

  return (
    <div className="flex justify-center items-start h-full">
      <div className="w-full max-w-3xl bg-purple-50 rounded-xl shadow-lg p-8 border border-purple-100">
        {!isEditing ? (
          /* MODO VISUALIZACIÓN */
          <>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Columna izquierda - Información */}
              <div className="flex-1 flex flex-col">
                <div className="flex flex-col items-center lg:items-start mb-6">
                  <img 
                    src={psychologist.photo} 
                    alt="Foto profesional" 
                    className="w-32 h-32 rounded-lg object-cover border-4 border-white shadow-md mb-4 transition-transform duration-300 hover:scale-105"
                  />
                  <h2 className="text-xl font-bold text-purple-800 mb-1">{psychologist.name}</h2>
                  
                  <div className="mb-4 text-center lg:text-left">
                    <div className="flex items-center gap-2 text-purple-600">
                      <FiAward />
                      <p>{psychologist.specialty}</p>
                    </div>
                    {psychologist.specialty2 && (
                      <div className="flex items-center gap-2 text-purple-600">
                        <FiAward />
                        <p>{psychologist.specialty2}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2 hover:text-purple-700 transition-colors duration-200">
                    <FiMail className="text-purple-500 mt-1" />
                    <span>{psychologist.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 hover:text-purple-700 transition-colors duration-200">
                    <FiPhone className="text-purple-500" />
                    <span>{psychologist.phone}</span>
                  </div>
                  
                  <div className="flex items-start gap-2 hover:text-purple-700 transition-colors duration-200">
                    <FiMapPin className="text-purple-500 mt-1" />
                    <p>{psychologist.address}</p>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Código y QR */}
              <div className="flex-1 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Código de conexión</h3>
                <div className="transition-transform duration-300 hover:scale-105">
                  <QRCodeSVG 
                    value={connectionCode} 
                    size={140}
                    fgColor="#7e22ce"
                    bgColor="#faf5ff"
                    className="mb-4"
                  />
                </div>
                <div className="w-full bg-white rounded-lg p-4 shadow-inner border border-purple-200 transition-all duration-300 hover:border-purple-400">
                  <p className="text-2xl font-bold text-center font-mono tracking-widest text-purple-800">
                    {connectionCode}
                  </p>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="mt-3 flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 transition-colors duration-200"
                >
                  <FiCopy size={14} />
                  {copied ? '¡Copiado!' : 'Copiar código'}
                </button>
              </div>
            </div>

            <button 
              onClick={() => setIsEditing(true)}
              className="mt-8 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all duration-300 flex justify-center items-center gap-2 hover:shadow-md"
            >
              <FiEdit size={16} />
              Editar perfil
            </button>
          </>
        ) : (
          /* MODO EDICIÓN */
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Columna izquierda - Formulario */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col items-center">
                  <img 
                    src={psychologist.photo} 
                    alt="Foto profesional" 
                    className="w-32 h-32 rounded-lg object-cover border-4 border-white shadow-md mb-4 transition-transform duration-300 hover:scale-105"
                  />
                  <label className="cursor-pointer text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1 transition-colors duration-200">
                    <FiEdit size={14} />
                    Cambiar foto
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setPsychologist(prev => ({ ...prev, photo: event.target.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={psychologist.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-purple-200 border-opacity-50 rounded-lg bg-white hover:border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Especialidad Principal</label>
                  <input
                    type="text"
                    name="specialty"
                    value={psychologist.specialty}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-purple-200 border-opacity-50 rounded-lg bg-white hover:border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Segunda Especialidad</label>
                  <input
                    type="text"
                    name="specialty2"
                    value={psychologist.specialty2}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-purple-200 border-opacity-50 rounded-lg bg-white hover:border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={psychologist.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-purple-200 border-opacity-50 rounded-lg bg-white hover:border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={psychologist.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-purple-200 border-opacity-50 rounded-lg bg-white hover:border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Dirección</label>
                  <textarea
                    name="address"
                    value={psychologist.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-purple-200 border-opacity-50 rounded-lg bg-white hover:border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Columna derecha - Código (solo lectura) */}
              <div className="flex-1 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Código de conexión</h3>
                <div className="transition-transform duration-300 hover:scale-105">
                  <QRCodeSVG 
                    value={connectionCode}
                    size={140}
                    fgColor="#7e22ce"
                    bgColor="#faf5ff"
                    className="mb-4"
                  />
                </div>
                <div className="w-full bg-white rounded-lg p-4 shadow-inner border border-purple-200 transition-all duration-300 hover:border-purple-400">
                  <p className="text-2xl font-bold text-center font-mono tracking-widest text-purple-800">
                    {connectionCode}
                  </p>
                </div>
                <p className="text-xs text-purple-600 mt-2 text-center">
                  Este código es único y permanente.<br />
                  Compártelo con tus pacientes para que puedan conectarse contigo.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 hover:shadow-md transition-all duration-300 flex items-center gap-2"
              >
                <FiSave size={16} />
                Guardar cambios
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}