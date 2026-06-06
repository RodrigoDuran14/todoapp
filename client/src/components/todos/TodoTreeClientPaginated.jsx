import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import TodoItem from './TodoItem';
import Pagination from '../common/Pagination';

const buildTree = (todos) => {
  const map = new Map();
  const roots = [];
  todos.forEach(todo => {
    map.set(todo._id, { ...todo, children: [] });
  });
  todos.forEach(todo => {
    const node = map.get(todo._id);
    if (todo.parentId && map.has(todo.parentId)) {
      map.get(todo.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });
  // Ordenar roots por order
  roots.sort((a, b) => (a.order || 0) - (b.order || 0));
  map.forEach(node => node.children.sort((a, b) => (a.order || 0) - (b.order || 0)));
  return roots;
};

const TodoTreeClientPaginated = ({ todos, onUpdate, onDelete, onAddSubtask, onEdit, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const roots = buildTree(todos);
  const totalPages = Math.ceil(roots.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedRoots = roots.slice(start, start + itemsPerPage);

  if (roots.length === 0) return null;

  return (
    <div>
      <div className="space-y-2">
        {paginatedRoots.map(node => (
          <TreeNode
            key={node._id}
            node={node}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onAddSubtask={onAddSubtask}
            onEdit={onEdit}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
};

const TreeNode = ({ node, onUpdate, onDelete, onAddSubtask, onEdit }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div className="flex items-start gap-1">
        {hasChildren && (
          <button onClick={() => setExpanded(!expanded)} className="mt-3 text-gray-500">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        <TodoItem
          todo={node}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddSubtask={() => onAddSubtask(node._id)}
          onEdit={onEdit}
          isGroup={hasChildren}
        />
      </div>
      {expanded && hasChildren && (
        <div className="ml-6 pl-2 border-l-2 border-indigo-200 dark:border-indigo-800 mt-1 space-y-1">
          {node.children.map(child => (
            <TreeNode
              key={child._id}
              node={child}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddSubtask={onAddSubtask}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoTreeClientPaginated;