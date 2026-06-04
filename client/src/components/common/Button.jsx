const Button = ({ children, type = 'button', isLoading = false, className = '', ...props }) => {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={`px-4 py-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Cargando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;