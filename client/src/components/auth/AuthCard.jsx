const AuthCard = ({ children, title }) => (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 transform transition-all">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{title}</h2>
      {children}
    </div>
  </div>
);
export default AuthCard;