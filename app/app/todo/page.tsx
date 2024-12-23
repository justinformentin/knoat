import TodoWrap from './todo-wrap';

export default async function Todo() {
  return (
    <div className="relative w-full h-[calc(100%-48px)] top-12 bg-background">
      <TodoWrap />
    </div>
  );
}
