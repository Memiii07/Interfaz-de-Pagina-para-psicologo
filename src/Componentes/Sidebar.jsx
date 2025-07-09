import { useState } from 'react';
import { 
  FiUser, 
  FiCalendar,
  FiClipboard
} from "react-icons/fi";

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-56 bg-white shadow-xl flex flex-col h-full border-r border-gray-200">
      {/* Logo*/}
      <div className="p-4 border-b border-gray-200 flex justify-center">
        <div className="flex items-center gap-3">
          <img 
            src="/logo-psicocare.png" 
            alt="Logo PsicoCare" 
            className="h-16 w-auto object-contain"
          />
          <span className="font-bold text-xl text-gray-800 hidden md:inline">PsicoCare</span>
        </div>
      </div>
      {/* Navegación*/}
      <nav className="flex-1 flex flex-col p-3 mt-4 space-y-2">
        <button
          onClick={() => setActiveTab('perfil')}
          className={`flex items-center w-full p-4 rounded-xl transition-all 
            ${activeTab === 'perfil'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-700 hover:bg-purple-50'
            }`}
        >
          <FiUser className="text-3xl min-w-[44px]" />
          <span className="ml-3 text-lg font-medium">Perfil</span>
        </button>
        
        <button
          onClick={() => setActiveTab('pacientes')}
          className={`flex items-center w-full p-4 rounded-xl transition-all 
            ${activeTab === 'pacientes'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-700 hover:bg-purple-50'
            }`}
        >
          <FiClipboard className="text-3xl min-w-[44px]" />
          <span className="ml-3 text-lg font-medium">Pacientes</span>
        </button>
        
        <button
          onClick={() => setActiveTab('agenda')}
          className={`flex items-center w-full p-4 rounded-xl transition-all 
            ${activeTab === 'agenda'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-700 hover:bg-purple-50'
            }`}
        >
          <FiCalendar className="text-3xl min-w-[44px]" />
          <span className="ml-3 text-lg font-medium">Agenda</span>
        </button>
      </nav>
    </div>
  );
}