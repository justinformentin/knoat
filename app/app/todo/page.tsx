import TodoComp from '@/components/todo-comp/todo-view';
import { loadUser } from '@/lib/server/user';
import { serverClient } from '@/utils/supabase/server';

export default async function Todo() {
  const user = await loadUser();
  const client = await serverClient();

  const { data: todos } = await client
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .single();
  return (
    <div className="relative w-full h-[calc(100%-56px)] bg-gray-50">
      <TodoComp todos={todos} userId={user.id} />
    </div>
  );
}
