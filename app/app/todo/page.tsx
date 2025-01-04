import TodoWrap from './todo-wrap';

export default async function Todo() {
  return (
    <div className="relative w-full h-[calc(100%-50px)] bg-background">
      <TodoWrap />
    </div>
  );
}
