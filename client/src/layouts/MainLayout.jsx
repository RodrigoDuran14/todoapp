import { Outlet, Link } from "react-router-dom";
import { Moon, Sun, LayoutDashboard, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-[#0a0a1a] dark:via-[#12122a] dark:to-[#1a1a2e] transition-colors duration-300">
      {/* Navbar (sin cambios) */}
      <nav className="sticky top-0 z-50 glass border-b border-indigo-200/30 dark:border-indigo-800/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition">
                <span className="text-white text-lg font-bold">✓</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </Link>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:scale-105 transition"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition"
                >
                  <LayoutDashboard size={16} />
                  <span>Admin</span>
                </Link>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {user?.username?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                  {user?.username}
                </span>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:scale-105 transition"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1 max-w-5xl mx-auto w-full py-6 sm:py-8 px-4">
        <Outlet />
      </main>

      {/* Footer modernizado */}
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 border-t border-indigo-200/30 dark:border-indigo-800/30 mt-8">
        <div className="max-w-5xl mx-auto px-4">
          <p className="mb-2">✨ TaskFlow — Organiza tu día con estilo ✨</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
            {/* Logo: en móvil se muestra después del eslogan, en escritorio a la izquierda del copyright */}
            <div className="flex justify-center sm:justify-start order-2 sm:order-1">
              <Link to="https://rodrigodurandev.vercel.app" target="_blank" >
                <img
                  src={
                    darkMode
                      ? "/logocortoblancosinfondo.png"
                      : "/logocortosinfondo.png"
                  }
                  alt="TaskFlow Logo"
                  className="h-15 w-auto opacity-80 hover:opacity-100 transition"
                />
              </Link>
            </div>
            {/* Copyright: en móvil va después del logo, en escritorio al lado derecho */}
            <p className="order-3 sm:order-2">
              © {new Date().getFullYear()} Rodrigo Martin Duran. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
