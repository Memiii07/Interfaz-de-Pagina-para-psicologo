import { useNavigate } from 'react-router-dom';
import { FiUser, FiHeart } from 'react-icons/fi';

export default function RoleSelection({ onSelect }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">PsicoHelp</h1>
        
        <div className="grid grid-cols-1 gap-4 mt-6">
          <button 
            onClick={() => onSelect('psychologist')}
            className="w-full bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700"
          >
            <div className="flex items-center justify-center gap-3">
              <FiUser size={20} />
              <span>Soy Psicólogo</span>
            </div>
          </button>
          
          <button 
            onClick={() => onSelect('patient')}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700"
          >
            <div className="flex items-center justify-center gap-3">
              <FiHeart size={20} />
              <span>Soy Paciente</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}