import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../api/admin';
import { Users, ListTodo, ArrowLeft, Trash2 } from 'lucide-react';
import Dropdown from '../components/common/Dropdown';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const { success, error } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchAllTodos();
  }, []);

  const fetchUsers = async () => {
    const { data } = await adminAPI.getUsers();
    setUsers(data);
  };
  const fetchAllTodos = async () => {
    const { data } = await adminAPI.getAllTodos();
    setAllTodos(data);
  };

  const updateRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      success(`Rol actualizado correctamente`);
      fetchUsers();
    } catch (err) {
      error('Error al actualizar el rol');
    }
  };

  const confirmDeleteUser = (userId) => {
    setPendingDelete({ type: 'user', id: userId });
    setConfirmOpen(true);
  };

  const confirmDeleteTodo = (todoId) => {
    setPendingDelete({ type: 'todo', id: todoId });
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      if (pendingDelete.type === 'user') {
        await adminAPI.deleteUser(pendingDelete.id);
        success('Usuario eliminado correctamente');
        fetchUsers();
        fetchAllTodos();
      } else {
        await adminAPI.deleteAnyTodo(pendingDelete.id);
        success('Tarea eliminada correctamente');
        fetchAllTodos();
      }
    } catch (err) {
      error('Error al eliminar');
    }
    setPendingDelete(null);
  };

  const roleOptions = [
    { value: 'user', label: 'Usuario' },
    { value: 'admin', label: 'Administrador' }
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Panel de Administración
        </h1>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-xl text-gray-700 dark:text-gray-300 hover:shadow-md transition">
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>
      </div>

      <div className="flex gap-2 border-b border-indigo-200 dark:border-indigo-800/50">
        <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${activeTab === 'users' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          <Users size={16} /> Usuarios
        </button>
        <button onClick={() => setActiveTab('todos')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${activeTab === 'todos' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          <ListTodo size={16} /> Todas las tareas
        </button>
      </div>
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-sm">
          {activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-indigo-100 dark:border-indigo-800/50">
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Usuario</th>
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Email</th>
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Rol</th>
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Acciones</th>
                </tr></thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td className="py-3 px-2 font-medium text-gray-800 dark:text-white">{user.username}</td>
                      <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="py-3 px-2">
                        <Dropdown options={roleOptions} value={user.role} onChange={(newRole) => updateRole(user._id, newRole)} />
                      </td>
                      <td className="py-3 px-2">
                        <button onClick={() => confirmDeleteUser(user._id)} className="text-red-500 hover:text-red-700 transition">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-3">
              {allTodos.map(todo => (
                <div key={todo._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <div>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{todo.user?.username}:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{todo.text}</span>
                    {todo.completed && <span className="ml-2 text-xs text-green-600 dark:text-green-400">✓ Completada</span>}
                  </div>
                  <button onClick={() => confirmDeleteTodo(todo._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar eliminación"
        message={pendingDelete?.type === 'user' ? '¿Estás seguro de eliminar este usuario y todas sus tareas?' : '¿Estás seguro de eliminar esta tarea?'}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </>
  );
};

export default AdminDashboard;