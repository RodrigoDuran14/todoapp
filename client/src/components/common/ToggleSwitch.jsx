import { useTheme } from '../../context/ThemeContext';

const ToggleSwitch = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      style={{ backgroundColor: darkMode ? '#6366f1' : '#9ca3af' }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          darkMode ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;