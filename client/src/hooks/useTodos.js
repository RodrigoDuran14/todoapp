import { useState, useEffect, useCallback } from 'react';
import { todosAPI } from '../api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await todosAPI.getAll();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (text) => {
    try {
      const { data } = await todosAPI.create(text);
      setTodos(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message);
      throw err;
    }
  }, []);

  const updateTodo = useCallback(async (id, updates) => {
    try {
      const { data } = await todosAPI.update(id, updates);
      setTodos(prev => prev.map(todo => todo._id === id ? data : todo));
      return data;
    } catch (err) {
      setError(err.response?.data?.message);
      throw err;
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    try {
      await todosAPI.delete(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      setError(err.response?.data?.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return { todos, loading, error, addTodo, updateTodo, deleteTodo, refetch: fetchTodos };
};