import TodoWrap from './todo-wrap';

export default async function Todo() {
  return (
    <div className="relative w-full h-[calc(100%-49px)] bg-background">
      <TodoWrap />
    </div>
  );
}
