'use client';
import TodoView from '@/components/todos/todo-view';
import { useDataStore } from '@/lib/use-data';

export default function TodoWrap() {
  const todos = useDataStore((state) => state.todos);

  if (!todos.id) return <div className="text-center mt-20">Loading...</div>;

  return <TodoView initialTodos={todos} />;
}
