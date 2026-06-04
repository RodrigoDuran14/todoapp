const Input = ({ label, type = 'text', value, onChange, required = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />
    </div>
  );
};

export default Input;