const Input = ({ label, type = 'text', value, onChange, required = false, placeholder = '', className = '' }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${className}`}
      />
    </div>
  );
};

export default Input;