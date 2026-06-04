import { useState, useEffect } from 'react';
import { todosAPI } from '../api/todos';
import TodoForm from '../components/todos/TodoForm';
import TodoList from '../components/todos/TodoList';
import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';

const HomePage = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data } = await todosAPI.getAll();
      setTodos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (newTodo) => setTodos([newTodo, ...todos]);
  const handleUpdate = (updated) => setTodos(todos.map(t => t._id === updated._id ? updated : t));
  const handleDelete = (id) => setTodos(todos.filter(t => t._id !== id));

  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.length - completedCount;
  const progress = todos.length ? (completedCount / todos.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total tareas</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{todos.length}</p>
            </div>
            <Circle className="text-indigo-500" size={32} />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completadas</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</p>
            </div>
            <CheckCircle2 className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{pendingCount}</p>
            </div>
            <TrendingUp className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {todos.length > 0 && (
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Progreso</span>
            <span className="font-medium text-indigo-600 dark:text-indigo-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Todo form */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-indigo-100 dark:border-indigo-900/30">
        <TodoForm onAdd={handleAdd} />
      </div>

      {/* Todo list */}
      <TodoList todos={todos} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
};

export default HomePage;