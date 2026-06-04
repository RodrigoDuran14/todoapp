import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = (msg, duration) => addToast(msg, 'success', duration);
  const error = (msg, duration) => addToast(msg, 'error', duration);
  const warning = (msg, duration) => addToast(msg, 'warning', duration);
  const info = (msg, duration) => addToast(msg, 'info', duration);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Componente de contenedor de toasts
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

// Componente individual de toast
const ToastItem = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle size={18} className="text-green-500" />,
    error: <AlertCircle size={18} className="text-red-500" />,
    warning: <AlertTriangle size={18} className="text-yellow-500" />,
    info: <Info size={18} className="text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm animate-slide-in ${bgColors[toast.type]}`}>
      {icons[toast.type]}
      <span className="text-sm text-gray-700 dark:text-gray-200">{toast.message}</span>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <X size={14} />
      </button>
    </div>
  );
};