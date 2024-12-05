'use client';
import { Save } from 'lucide-react';
import { browserClient } from '@/utils/supabase/client';
import { Todos } from '@/lib/database.types';
import { AddTodo } from './add-todo';
import { toast } from 'sonner';

type SaveTodoProps = {
  list: Todos;
  userId: string;
  initialTodos: boolean;
};
export const SaveTodo = ({ list, userId, initialTodos }: SaveTodoProps) => {
  const client = browserClient();
  const saveData = async () => {
    if (initialTodos) {
      await client
        .from('todos')
        .update({ list, user_id: userId })
        .eq('user_id', userId);
    } else {
      await client.from('todos').insert({ user_id: userId, list });
    }
    toast('Todos saved!');
  };
  return (
    <AddTodo text="Save Todos" className="bg-white" onClick={saveData}>
      <Save className="self-center ml-2" />
    </AddTodo>
  );
};
