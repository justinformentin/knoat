import { browserClient } from '@/utils/supabase/client';
import { Directory, DirectoryInsert, Note, NoteInsert, Tables } from './types';
import { SupabaseClient } from '@supabase/supabase-js';

export const supabaseAdapterFunc = (supabaseClient?: SupabaseClient) => {
  const client = supabaseClient || browserClient();

  const update = async (tableName: Tables, data: Note | Directory) => {
    //@ts-ignore
    const {fts, ...fixedData} = data; 
    const updated = await client
      .from(tableName)
      .update(fixedData)
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
    // console.log('inserted', inserted);
    // Add error handling later
    return inserted?.data;
  };
  return { update, insert };
};
export const supabaseAdapter = supabaseAdapterFunc();
