import TodoView from '@/components/todos/todo-view';

export default async function Todo() {
  return (
    <div className="relative w-full h-[calc(100%-56px)] bg-gray-50">
      <TodoView />
    </div>
  );
}
