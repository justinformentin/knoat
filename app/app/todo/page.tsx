import TodoComp from '@/components/todo-comp/todo-view';
import { loadUser } from '@/lib/server/user';
import { serverClient } from '@/utils/supabase/server';

export default async function Todo() {
  const user = await loadUser();
  const client = await serverClient();

  const getOrCreateTodos = async () => {
    const { data: todos } = await client
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .single();
    console.log('todos', todos);
    if (todos) {
      return todos;
    } else {
      const { data: created } = await client
        .from('todos')
        .insert({ user_id: user.id, list: [[]] })
        .select('*')
        .single();
      console.log('created', created);
      return created;
    }
  };

  const todos = await getOrCreateTodos();
  return (
    <div className="w-full h-[calc(100%-56px)] bg-gray-50">
      {todos ? (
        <TodoComp todos={todos} userId={user.id} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
