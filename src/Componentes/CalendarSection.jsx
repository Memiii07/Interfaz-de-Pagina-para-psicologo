import { useState } from 'react';
import { FiClock, FiEdit2, FiUser, FiX, FiCalendar, FiPlus, FiSave, FiMessageSquare } from "react-icons/fi";

export default function CalendarSection() {
  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      patient: "Ana López", 
      date: "2023-05-20T10:00", 
      duration: 60,
      type: "Evaluación",
      status: "Confirmada",
      notes: "Evaluación inicial"
    },
    {  
      id: 2, 
      patient: "Carlos Méndez", 
      date: "2023-05-20T16:00", 
      duration: 30,
      type: "Seguimiento",
      status: "Programada",
      notes: "Seguimiento tratamiento"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentAppointment, setCurrentAppointment] = useState({
    patient: "",
    date: "",
    duration: 30,
    type: "Evaluación",
    status: "Programada",
    notes: ""
  });

  const appointmentTypes = ["Evaluación", "Seguimiento", "Emergencia", "Otro"];
  const appointmentStatuses = ["Programada", "Confirmada", "Completada", "Cancelada", "No asistió"];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setAppointments(appointments.map(app => 
        app.id === editingId ? { ...currentAppointment, id: editingId } : app
      ));
    } else {
      const newId = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
      setAppointments([...appointments, { ...currentAppointment, id: newId }]);
    }
    
    closeModal();
  };

  const openEditModal = (appointment) => {
    setCurrentAppointment(appointment);
    setEditingId(appointment.id);
    setShowModal(true);
  };

  const openNewModal = () => {
    setCurrentAppointment({
      patient: "",
      date: "",
      duration: 30,
      type: "Evaluación",
      status: "Programada",
      notes: ""
    });
    setEditingId(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Confirmada": return "bg-green-100 text-green-800";
      case "Programada": return "bg-blue-100 text-blue-800";
      case "Completada": return "bg-purple-100 text-purple-800";
      case "Cancelada": return "bg-red-100 text-red-800";
      case "No asistió": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case "Evaluación": return "bg-indigo-100 text-indigo-800";
      case "Seguimiento": return "bg-teal-100 text-teal-800";
      case "Emergencia": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-800">Agenda</h2>
        <button 
          onClick={openNewModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 hover:shadow-md"
        >
          <FiPlus size={16} />
          <span>Nueva Cita</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-purple-50 p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-purple-800">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          <span className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            {appointments.length} citas hoy
          </span>
        </div>

        {appointments.map(app => {
          const { date, time } = formatDate(app.date);
          
          return (
            <div 
              key={app.id} 
              className="p-4 border-b hover:bg-purple-50 group transition-colors duration-150"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg text-purple-600 mt-1">
                    <FiClock size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 flex items-center gap-2">
                      <FiUser size={16} className="text-gray-400" />
                      {app.patient}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        {date} • {time}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(app.type)}`}>
                        {app.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {app.duration} min
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(app)}
                    className="text-purple-600 hover:text-purple-800 p-2 rounded-full hover:bg-purple-100 transition-colors duration-200"
                  >
                    <FiEdit2 size={18} />
                  </button>
                </div>
              </div>
              
              {app.notes && (
                <p className="text-sm text-purple-700 mt-3 pl-11 flex items-start gap-2">
                  <span className="font-medium">Notas:</span> 
                  {app.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal para nueva/edición de cita */}
      {showModal && (
        <div className="fixed inset-0 z-50">
          {/* Fondo con desenfoque mejorado */}
          <div 
            className="fixed inset-0 backdrop-blur-md bg-white/10"
            onClick={closeModal}
          />
          
          {/* Contenido del modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-all duration-300 transform animate-pop-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-5 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl">
                      {editingId ? 'Editar Cita' : 'Programar Nueva Cita'}
                    </h3>
                    <p className="text-purple-100 text-sm mt-1">
                      {editingId ? 'Actualice los detalles de la cita' : 'Complete los detalles de la cita'}
                    </p>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="text-purple-100 hover:text-white p-1 rounded-full hover:bg-purple-700/30 transition-all duration-200"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-purple-900 mb-1.5 flex items-center">
                      <FiUser className="mr-2" size={16} />
                      Paciente
                    </label>
                    <input
                      type="text"
                      name="patient"
                      value={currentAppointment.patient}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border-0 border-b-2 border-purple-100 bg-purple-50/30 focus:border-purple-500 focus:ring-0 rounded-t-lg transition-all duration-300 placeholder-purple-300"
                      placeholder="Nombre del paciente"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-purple-900 mb-1.5 flex items-center">
                        <FiCalendar className="mr-2" size={16} />
                        Fecha y Hora
                      </label>
                      <input
                        type="datetime-local"
                        name="date"
                        value={currentAppointment.date}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border-0 border-b-2 border-purple-100 bg-purple-50/30 focus:border-purple-500 focus:ring-0 rounded-t-lg transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-900 mb-1.5">
                        Duración
                      </label>
                      <div className="relative">
                        <select
                          name="duration"
                          value={currentAppointment.duration}
                          onChange={handleInputChange}
                          className="w-full p-3 border-0 border-b-2 border-purple-100 bg-purple-50/30 focus:border-purple-500 focus:ring-0 rounded-t-lg appearance-none transition-all duration-300"
                        >
                          <option value="30">30 minutos</option>
                          <option value="45">45 minutos</option>
                          <option value="60">60 minutos</option>
                          <option value="90">90 minutos</option>
                        </select>
                        <div className="absolute right-3 top-3.5 text-purple-400 pointer-events-none">
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-purple-900 mb-1.5">
                        Tipo de Cita
                      </label>
                      <select
                        name="type"
                        value={currentAppointment.type}
                        onChange={handleInputChange}
                        className="w-full p-3 border-0 border-b-2 border-purple-100 bg-purple-50/30 focus:border-purple-500 focus:ring-0 rounded-t-lg transition-all duration-300"
                      >
                        {appointmentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-900 mb-1.5">
                        Estado
                      </label>
                      <select
                        name="status"
                        value={currentAppointment.status}
                        onChange={handleInputChange}
                        className="w-full p-3 border-0 border-b-2 border-purple-100 bg-purple-50/30 focus:border-purple-500 focus:ring-0 rounded-t-lg transition-all duration-300"
                      >
                        {appointmentStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-900 mb-1.5 flex items-center">
                      <FiMessageSquare className="mr-2" size={16} />
                      Notas Adicionales
                    </label>
                    <textarea
                      name="notes"
                      value={currentAppointment.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border-2 border-purple-100 bg-purple-50/30 focus:border-purple-500 focus:ring-0 rounded-lg transition-all duration-300 placeholder-purple-300"
                      placeholder="Escriba cualquier observación importante..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg hover:from-purple-700 hover:to-purple-500 shadow-md hover:shadow-lg transition-all duration-300 font-medium flex items-center gap-2"
                  >
                    {editingId ? <FiSave size={18} /> : <FiPlus size={18} />}
                    <span>{editingId ? 'Guardar Cambios' : 'Agendar Cita'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}