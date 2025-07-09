import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiAward, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

export default function AuthForm({ role, onSuccess, onBack }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado unificado para todos los campos
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    lastName: '',
    phone: '',
    ci: '',
    // Campos de psicólogo
    specialty: '',
    licenseNumber: '',
    secondarySpecialty: '',
    address: '',
    // Campos de paciente
    birthDate: '',
    gender: '',
    emergencyContact: '',
    psychologistCode: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Guardar datos según rol
      localStorage.setItem('userData', JSON.stringify({
        ...formData,
        role
      }));

      if (role === 'psychologist') {
        onSuccess(); // Va al dashboard
      } else {
        navigate('/pending-approval'); // Paciente a espera de aprobación
      }

    } catch (err) {
      setError('Error en el proceso. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Corregido: Ahora permite escribir con normalidad
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Cabecera */}
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack}
            className="text-purple-600 hover:text-purple-800 mr-2"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-purple-800">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'} como {role === 'psychologist' ? 'Psicólogo' : 'Paciente'}
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
            <FiAlertCircle /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos básicos (siempre visibles) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Correo electrónico"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Contraseña"
              required
              minLength="6"
            />
          </div>

          {/* Campos adicionales SOLO en registro */}
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nombre"
                    required
                  />
                </div>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Apellido"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Teléfono"
                  required
                />
              </div>

              <input
                type="text"
                name="ci"
                value={formData.ci}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Cédula"
                required
              />

              {role === 'psychologist' ? (
                <>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiAward className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Especialidad principal"
                      required
                    />
                  </div>

                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Número de licencia"
                    required
                  />

                  <input
                    type="text"
                    name="secondarySpecialty"
                    value={formData.secondarySpecialty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Especialidad secundaria (opcional)"
                  />

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Dirección"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccione género</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Otro">Otro</option>
                  </select>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Contacto de emergencia"
                      required
                    />
                  </div>

                  <input
                    type="text"
                    name="psychologistCode"
                    value={formData.psychologistCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Código del psicólogo (6 dígitos)"
                    required
                    pattern="[0-9]{6}"
                    title="Debe contener 6 dígitos"
                  />
                </>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-medium text-white ${
              isSubmitting ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
            } transition-colors`}
          >
            {isSubmitting ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-purple-600 hover:underline"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}