import { useState } from 'react';
import { todosAPI } from '../../api/todos';
import { Edit2, Trash2, Check, PlusCircle, Calendar } from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const priorityConfig = {
  low: { label: 'Baja', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  medium: { label: 'Media', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  high: { label: 'Alta', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' }
};

const TodoItem = ({ todo, onUpdate, onDelete, onAddSubtask, onEdit }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const priority = priorityConfig[todo.priority] || priorityConfig.medium;

  const handleToggle = async () => {
    try {
      const { data } = await todosAPI.update(todo._id, { completed: !todo.completed });
      onUpdate(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await todosAPI.delete(todo._id);
      onDelete(todo._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className={`group relative bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm border transition-all duration-200 hover:shadow-md ${
        todo.completed
          ? 'border-green-200 dark:border-green-800/50 bg-green-50/30 dark:bg-green-900/10'
          : 'border-indigo-100 dark:border-indigo-800/30'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-start gap-2 flex-1">
            <button onClick={handleToggle} className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
              todo.completed
                ? 'bg-green-500 border-green-500'
                : 'border-indigo-300 dark:border-indigo-600 hover:border-indigo-500'
            }`}>
              {todo.completed && <Check size={12} className="text-white" />}
            </button>
            <span className={`text-gray-800 dark:text-gray-200 break-words ${
              todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
            }`}>
              {todo.text}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-7 sm:ml-0">
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
              {priority.label}
            </div>
            {todo.dueDate && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar size={12} />
                <span>{format(new Date(todo.dueDate), 'dd MMM', { locale: es })}</span>
              </div>
            )}
            <button onClick={() => onAddSubtask()} className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:scale-105 transition">
              <PlusCircle size={14} />
            </button>
            <button onClick={() => onEdit(todo)} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:scale-105 transition">
              <Edit2 size={14} />
            </button>
            <button onClick={() => setShowConfirm(true)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 hover:scale-105 transition">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar tarea"
        message={`¿Eliminar "${todo.text}"?`}
        confirmText="Eliminar"
        type="danger"
      />
    </>
  );
};

export default TodoItem;