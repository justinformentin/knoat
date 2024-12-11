import TodoView from '@/components/todo-comp/todo-view';

export default async function Todo() {
  return (
    <div className="relative w-full h-[calc(100%-56px)] bg-gray-50">
      <TodoView />
    </div>
  );
}
