import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Dropdown = ({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        {selectedOption?.label || label}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-32 rounded-lg bg-white dark:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden animate-fadeIn">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-gray-800 dark:text-gray-100">{option.label}</span>
              {option.value === value && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;