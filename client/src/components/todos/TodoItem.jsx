import { useState } from 'react';
import { todosAPI } from '../../api/todos';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleEdit = async () => {
    if (!editText.trim()) return;
    setLoading(true);
    try {
      const { data } = await todosAPI.update(todo._id, { text: editText });
      onUpdate(data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleEdit();
  };

  return (
    <>
      <div className={`group relative bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
        todo.completed 
          ? 'border-green-200 dark:border-green-800/50 bg-green-50/30 dark:bg-green-900/10' 
          : 'border-indigo-100 dark:border-indigo-800/30'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={handleToggle}
              className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                todo.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-indigo-300 dark:border-indigo-600 hover:border-indigo-500'
              }`}
            >
              {todo.completed && <Check size={12} className="text-white" />}
            </button>

            {isEditing ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-1 rounded-lg border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            ) : (
              <span className={`text-gray-800 dark:text-gray-200 wrap-break-word ${
                todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
              }`}>
                {todo.text}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-8 sm:ml-0">
            {isEditing ? (
              <>
                <button onClick={handleEdit} className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:scale-105 transition">
                  <Check size={16} />
                </button>
                <button onClick={() => setIsEditing(false)} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:scale-105 transition">
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:scale-105 transition">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => setShowConfirm(true)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:scale-105 transition">
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar tarea"
        message={`¿Estás seguro de que quieres eliminar "${todo.text}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </>
  );
};

export default TodoItem;