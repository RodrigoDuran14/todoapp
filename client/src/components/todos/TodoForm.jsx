import { useState } from 'react';
import { todosAPI } from '../../api/todos';
import { Plus } from 'lucide-react';

const TodoForm = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await todosAPI.create(text);
      onAdd(data);
      setText('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="¿Qué tienes que hacer hoy?"
        className="flex-1 px-5 py-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="px-6 py-3 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        {loading ? 'Agregando...' : 'Agregar tarea'}
      </button>
    </form>
  );
};

export default TodoForm;