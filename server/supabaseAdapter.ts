import { browserClient } from '@/utils/supabase/client';
import {
  Directory,
  DirectoryInsert,
  GetOneProps,
  Note,
  NoteInsert,
  Tables,
} from './types';
import { SupabaseClient } from '@supabase/supabase-js';

export const supabaseAdapterFunc = (supabaseClient?: SupabaseClient) => {
  const client = supabaseClient || browserClient();

  const getOne = async ({
    tableName,
    queries,
    queryKey,
    queryId,
  }: GetOneProps) => {
    const query = client.from(tableName).select('*');
    if (queries) {
      const { data, error } = await query.match(queries).single();
      return data;
    } else if (queryKey && queryId) {
      const { data, error } = await query.eq(queryKey, queryId).single();
      return data;
    }
  };

  const getAll = async (
    tableName: Tables,
    queryKey: string,
    queryVal: string
  ) => {
    const { data, error } = await client
      .from(tableName)
      .select('*')
      .eq(queryKey, queryVal);
    return data;
  };

  const update = async (tableName: Tables, data: Note | Directory) => {
    const updated = await client
      .from(tableName)
      .update(data)
      .eq('id', data.id)
      .select()
      .single();
    return updated?.data;
  };

  const insert = async (
    tableName: Tables,
    data: NoteInsert | DirectoryInsert
  ) => {
    const inserted = await client
      .from(tableName)
      .insert(data)
      .select()
      .single();
    console.log('inserted', inserted);
    // Add error handling later
    return inserted?.data;
  };
  return { getOne, getAll, update, insert };
};
export const supabaseAdapter = supabaseAdapterFunc();
