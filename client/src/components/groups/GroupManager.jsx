import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { groupsAPI } from '../../api/groups';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../common/ConfirmDialog';

const GroupManager = ({ groups, onGroupsChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (editingGroup) {
        await groupsAPI.update(editingGroup._id, { name, color });
        success('Grupo actualizado');
      } else {
        await groupsAPI.create({ name, color });
        success('Grupo creado');
      }
      onGroupsChange();
      closeModal();
    } catch (err) {
      error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (group) => {
    try {
      await groupsAPI.delete(group._id);
      success('Grupo eliminado');
      onGroupsChange();
    } catch (err) {
      error(err.response?.data?.message);
    }
    setShowDeleteConfirm(null);
  };

  const openModal = (group = null) => {
    setEditingGroup(group);
    if (group) {
      setName(group.name);
      setColor(group.color);
    } else {
      setName('');
      setColor('#6366f1');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Mis grupos</h3>
        <button onClick={() => openModal()} className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus size={14} /> Nuevo grupo
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {groups.map(group => (
          <div
            key={group._id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
            style={{ backgroundColor: group.color + '20', color: group.color, border: `1px solid ${group.color}40` }}
          >
            <span>{group.name}</span>
            <button onClick={() => openModal(group)} className="hover:scale-110"><Edit2 size={12} /></button>
            <button onClick={() => setShowDeleteConfirm(group)} className="hover:scale-110"><Trash2 size={12} /></button>
          </div>
        ))}
        {groups.length === 0 && <p className="text-sm text-gray-500">Sin grupos. Crea uno para organizar tus tareas.</p>}
      </div>

      {/* Modal de creación/edición */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 w-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{editingGroup ? 'Editar grupo' : 'Nuevo grupo'}</h3>
              <button onClick={closeModal}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del grupo"
                className="w-full p-2 border rounded-lg mb-3 dark:bg-gray-700 dark:border-gray-600"
                required
              />
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 mb-3 rounded border dark:bg-gray-700"
              />
              <button type="submit" disabled={loading} className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => handleDelete(showDeleteConfirm)}
        title="Eliminar grupo"
        message={`¿Eliminar el grupo "${showDeleteConfirm?.name}"? Las tareas quedarán sin grupo.`}
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
};

export default GroupManager;