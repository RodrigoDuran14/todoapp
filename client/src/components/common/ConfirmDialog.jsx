import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Eliminar', cancelText = 'Cancelar', type = 'danger' }) => {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const colorClasses = {
    danger: { button: 'bg-red-600 hover:bg-red-700', icon: 'text-red-600' },
    warning: { button: 'bg-yellow-600 hover:bg-yellow-700', icon: 'text-yellow-600' },
    info: { button: 'bg-blue-600 hover:bg-blue-700', icon: 'text-blue-600' },
  };
  const current = colorClasses[type] || colorClasses.danger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-scaleIn">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className={current.icon} size={24} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">{cancelText}</button>
          <button onClick={() => { onConfirm(); onClose(); }} className={`px-4 py-2 rounded-lg text-white transition ${current.button}`}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;