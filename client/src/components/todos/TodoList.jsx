import { ListChecks, CheckCircle2 } from 'lucide-react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onUpdate, onDelete }) => {
  const pending = todos.filter(t => !t.completed);
  const completed = todos.filter(t => t.completed);

  if (!todos.length) {
    return (
      <div className="text-center py-16 bg-white/50 dark:bg-gray-800/30 rounded-2xl">
        <ListChecks size={48} className="mx-auto text-indigo-300 dark:text-indigo-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No hay tareas. ¡Agrega una arriba!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {pending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 bg-linear-to-b from-indigo-500 to-purple-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Pendientes <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({pending.length})</span>
            </h2>
          </div>
          <div className="space-y-2">
            {pending.map(todo => <TodoItem key={todo._id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />)}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={18} className="text-green-500" />
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Completadas <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({completed.length})</span>
            </h2>
          </div>
          <div className="space-y-2">
            {completed.map(todo => <TodoItem key={todo._id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;