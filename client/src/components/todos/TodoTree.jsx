import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import { ChevronRight, ChevronDown } from 'lucide-react';

const TodoTree = ({ todos, onUpdate, onDelete, onAddSubtask, onEdit }) => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
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
    const sortByOrder = (a, b) => (a.order || 0) - (b.order || 0);
    roots.sort(sortByOrder);
    map.forEach(node => node.children.sort(sortByOrder));
    setTreeData(roots);
  }, [todos]);

  if (todos.length === 0) return null;

  return (
    <div className="space-y-2">
      {treeData.map(node => (
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
  );
};

const TreeNode = ({ node, onUpdate, onDelete, onAddSubtask, onEdit }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div className="flex items-start gap-1">
        {hasChildren && (
          <button onClick={() => setExpanded(!expanded)} className="mt-3 text-gray-500 hover:text-gray-700 dark:text-gray-400">
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

export default TodoTree;