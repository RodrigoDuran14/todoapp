import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import { jwtDecode } from 'jwt-decode'; // ya no es necesario si leemos usuario desde /me

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión al cargar la app (sin token, la cookie se envía automática)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await authAPI.getMe(); // endpoint /api/auth/me
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    // El backend guarda la cookie. El usuario nos llega en data.user
    setUser(data.user);
  };

  const register = async (username, email, password) => {
    const { data } = await authAPI.register({ username, email, password });
    setUser(data.user);
  };

  const logout = async () => {
    await authAPI.logout(); // backend debe limpiar la cookie
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};