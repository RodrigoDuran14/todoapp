import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import Dropdown from '../common/Dropdown';

const TodoForm = ({ isOpen, onClose, onSubmit, initialData = null, groups = [], todos = [], defaultParentId = null, defaultGroupId = null }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [groupId, setGroupId] = useState('');
  const [parentId, setParentId] = useState('');
  const [loading, setLoading] = useState(false);

  const priorityOptions = [
    { value: 'low', label: '🟢 Baja' },
    { value: 'medium', label: '🟡 Media' },
    { value: 'high', label: '🔴 Alta' }
  ];

  const groupOptions = [
    { value: '', label: '📁 Sin grupo' },
    ...groups.map(g => ({ value: g._id, label: g.name }))
  ];

  // Opciones de tareas padre (solo tareas que no sean la actual, y del mismo grupo o sin grupo)
  const getParentOptions = () => {
    let filtered = todos.filter(t => t._id !== initialData?._id);
    if (groupId) {
      filtered = filtered.filter(t => t.groupId === groupId);
    } else {
      filtered = filtered.filter(t => !t.groupId);
    }
    return [
      { value: '', label: '📌 Ninguna (tarea principal)' },
      ...filtered.map(t => ({ value: t._id, label: t.text }))
    ];
  };

  useEffect(() => {
    if (initialData) {
      setText(initialData.text);
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate ? format(new Date(initialData.dueDate), 'yyyy-MM-dd') : '');
      setGroupId(initialData.groupId?._id || initialData.groupId || '');
      setParentId(initialData.parentId || '');
    } else {
      setText('');
      setPriority('medium');
      setDueDate('');
      setGroupId(defaultGroupId || '');
      setParentId(defaultParentId || '');
    }
  }, [initialData, defaultParentId, defaultGroupId, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    await onSubmit({
      text,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      groupId: groupId || null,
      parentId: parentId || null
    });
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Editar tarea' : 'Nueva tarea'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Descripción de la tarea"
            className="w-full px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
            required
            autoFocus
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
              <Dropdown options={priorityOptions} value={priority} onChange={setPriority} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha límite</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grupo</label>
            <Dropdown options={groupOptions} value={groupId} onChange={setGroupId} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tarea padre (subtask de)</label>
            <Dropdown options={getParentOptions()} value={parentId} onChange={setParentId} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear tarea')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;