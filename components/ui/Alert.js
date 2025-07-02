// components/ui/Alert.js
/**
 * Alert Component
 *
 * Displays notifications and alerts with different severity levels.
 */

import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const Alert = ({
  type = 'info',
  title,
  message,
  onClose = null,
  className = ''
}) => {
  const config = {
    success: {
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-400',
      icon: CheckCircle,
    },
    error: {
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-500/20',
      textColor: 'text-red-400',
      icon: XCircle,
    },
    warning: {
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-500/20',
      textColor: 'text-yellow-400',
      icon: AlertCircle,
    },
    info: {
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-500/20',
      textColor: 'text-blue-400',
      icon: Info,
    },
  };

  const { bgColor, borderColor, textColor, icon: Icon } = config[type];

  return (
    <div className={`
      ${bgColor} ${borderColor}
      border rounded-lg p-4 animate-fade-in
      ${className}
    `}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${textColor} mt-0.5 flex-shrink-0`} />

        <div className="flex-1">
          {title && (
            <h4 className={`font-medium ${textColor} mb-1`}>{title}</h4>
          )}
          {message && (
            <p className="text-gray-300 text-sm">{message}</p>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
