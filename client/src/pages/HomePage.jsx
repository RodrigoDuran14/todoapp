import { useState, useEffect } from "react";
import { groupsAPI } from "../api/groups";
import { todosAPI } from "../api/todos";
import GroupManager from "../components/groups/GroupManager";
import TodoTreeClientPaginated from "../components/todos/TodoTreeClientPaginated";
import TodoForm from "../components/todos/TodoForm";
import { useToast } from "../context/ToastContext";
import { CheckCircle2, Circle, TrendingUp } from "lucide-react";

const HomePage = () => {
  const [groups, setGroups] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [parentForNew, setParentForNew] = useState(null);
  const [groupForNew, setGroupForNew] = useState(null);
  const { success, error } = useToast();

  const fetchData = async () => {
    try {
      const [groupsRes, todosRes] = await Promise.all([
        groupsAPI.getAll(),
        todosAPI.getAll(),
      ]);
      setGroups(groupsRes.data);
      setTodos(todosRes.data);
    } catch (err) {
      error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUpdate = async (formData) => {
    try {
      if (editingTodo) {
        const { data } = await todosAPI.update(editingTodo._id, formData);
        setTodos((prev) => prev.map((t) => (t._id === data._id ? data : t)));
        success("Tarea actualizada");
      } else {
        const { data } = await todosAPI.create(formData);
        setTodos((prev) => [...prev, data]);
        success("Tarea creada");
      }
      setModalOpen(false);
      setEditingTodo(null);
      setParentForNew(null);
      setGroupForNew(null);
    } catch (err) {
      error(err.response?.data?.message || "Error al guardar");
    }
  };

  const handleUpdate = (updatedTodo) => {
    setTodos((prev) =>
      prev.map((t) => (t._id === updatedTodo._id ? updatedTodo : t)),
    );
  };

  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((t) => t._id !== id));
    success("Tarea eliminada");
  };

  const openAddModal = (parentId = null, groupId = null) => {
    setParentForNew(parentId);
    setGroupForNew(groupId);
    setEditingTodo(null);
    setModalOpen(true);
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setParentForNew(null);
    setGroupForNew(null);
    setModalOpen(true);
  };

  // Calcular estadísticas globales
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const progress = total ? (completed / total) * 100 : 0;

  // Agrupar tareas por grupo
  const todosByGroup = {};
  groups.forEach((g) => {
    todosByGroup[g._id] = [];
  });
  todosByGroup["no-group"] = [];
  todos.forEach((todo) => {
    const gid = todo.groupId?._id || todo.groupId;
    if (gid && todosByGroup[gid]) todosByGroup[gid].push(todo);
    else todosByGroup["no-group"].push(todo);
  });

  if (loading) return <div className="text-center py-20">Cargando...</div>;

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 ">Total</p>
              <p className="text-2xl font-bold dark:text-white">{total}</p>
            </div>
            <Circle className="text-indigo-500" size={32} />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Completadas</p>
              <p className="text-2xl font-bold text-green-600">{completed}</p>
            </div>
            <CheckCircle2 className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-orange-600">{pending}</p>
            </div>
            <TrendingUp className="text-orange-500" size={32} />
          </div>
        </div>
      </div>
      {total > 0 && (
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4">
          <div className="flex justify-between text-sm mb-2 dark:text-white">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Gestor de grupos */}
      <GroupManager groups={groups} onGroupsChange={fetchData} />

      {/* Lista de grupos y sus tareas */}
      <div className="space-y-8">
        {groups.map((group) => (
          <div
            key={group._id}
            className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
              <h2 className="text-xl font-bold" style={{ color: group.color }}>
                {group.name}
              </h2>
              <button
                onClick={() => openAddModal(null, group._id)}
                className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
              >
                + Nueva tarea
              </button>
            </div>
            <TodoTreeClientPaginated
              todos={todosByGroup[group._id]}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onAddSubtask={(parentId) => openAddModal(parentId, group._id)}
              onEdit={openEditModal}
              itemsPerPage={8} 
            />
          </div>
        ))}

        {/* Tareas sin grupo */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-500">📁 Sin grupo</h2>
            <button
              onClick={() => openAddModal(null, null)}
              className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg"
            >
              + Nueva tarea
            </button>
          </div>
          <TodoTreeClientPaginated
            todos={todosByGroup["no-group"]}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAddSubtask={(parentId) => openAddModal(parentId, null)}
            onEdit={openEditModal}
            itemsPerPage={8}
          />
        </div>
      </div>

      {/* Modal de creación/edición de tareas */}
      <TodoForm
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTodo(null);
          setParentForNew(null);
          setGroupForNew(null);
        }}
        onSubmit={handleCreateUpdate}
        initialData={editingTodo}
        groups={groups}
        todos={todos}
        defaultParentId={parentForNew}
        defaultGroupId={groupForNew}
      />
    </div>
  );
};

export default HomePage;
