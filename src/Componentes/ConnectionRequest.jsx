// components/ConnectionRequest.js
import { useState } from 'react';
import { FiUser, FiX, FiCheck, FiClock } from 'react-icons/fi';

export default function ConnectionRequest({ request, onAccept, onReject }) {
  return (
    <div className={`border rounded-lg p-4 mb-4 ${
      request.status === 'pending' ? 'border-purple-200 bg-purple-50' :
      request.status === 'accepted' ? 'border-green-200 bg-green-50' :
      'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-800">{request.patientName}</h4>
          <div className="text-sm text-gray-500">Email: {request.patientEmail}</div>
          <div className="text-sm text-gray-500">Teléfono: {request.patientPhone}</div>
          <div className="flex items-center text-xs text-gray-400 mt-1">
            <FiClock className="mr-1" size={12} />
            {request.requestedAt}
          </div>
        </div>
        
        {request.status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => onReject(request.id)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Rechazar"
            >
              <FiX size={18} />
            </button>
            <button
              onClick={() => onAccept(request.id)}
              className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors"
              title="Aceptar"
            >
              <FiCheck size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}