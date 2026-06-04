import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useToast } from "../context/ToastContext";
import { Sparkles } from 'lucide-react'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSwitch, setPendingSwitch] = useState(null);
  const { success, error } = useToast();

  // Estados para saber si hay datos en los formularios (simplificado)
  const [hasUnsavedData, setHasUnsavedData] = useState(false);

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      success("Bienvenido de nuevo");
    } catch (err) {
      error(err.response?.data?.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      await register(data.username, data.email, data.password);
      success("Cuenta creada exitosamente");
    } catch (err) {
      error(err.response?.data?.message || "Error al registrarse");
      setLoading(false);
    }
  };

  const handleSwitch = (toLogin) => {
    if (hasUnsavedData) {
      setPendingSwitch(toLogin);
      setShowConfirm(true);
    } else {
      setIsLogin(toLogin);
    }
  };

  const confirmSwitch = () => {
    setIsLogin(pendingSwitch);
    setHasUnsavedData(false);
    setShowConfirm(false);
    setPendingSwitch(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-[#0a0a1a] dark:via-[#12122a] dark:to-[#1a1a2e] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Organiza tus tareas con estilo
          </p>
        </div>
        <div className="glass rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            {isLogin ? "Bienvenido de nuevo" : "Crear cuenta"}
          </h2>
          {isLogin ? (
            <LoginForm
              onSubmit={handleLogin}
              isLoading={loading}
              onDataChange={() => setHasUnsavedData(true)}
            />
          ) : (
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={loading}
              onDataChange={() => setHasUnsavedData(true)}
            />
          )}
          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <button
              onClick={() => handleSwitch(!isLogin)}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmSwitch}
        title="Cambiar formulario"
        message="Hay datos sin guardar en el formulario. ¿Deseas continuar? Se perderán los cambios."
        confirmText="Continuar"
        cancelText="Cancelar"
        type="warning"
      />
    </div>
  );
};

export default AuthPage;
