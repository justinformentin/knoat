import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

type NotesTable = Database['public']['Tables']['notes'];

export function createNotesService(client: SupabaseClient<Database>) {
  return new NotesService(client);
}

class NotesService {
  constructor(private readonly client: SupabaseClient<Database>) {}

  notesTable = this.client.from('notes');

  noteQuery(userId: string) {
    return this.notesTable.select('*').eq('user_id', userId);
  }

  async getNotes(userId: string) {
    const { data, error } = await this.noteQuery(userId);
    if (error) throw error;
    return data;
  }

  async getNote(fullPath: string, userId: string) {
    const { data, error } = await this.noteQuery(userId)
      .eq('full_path', fullPath)
      .single();

    if (error) throw error;

    return data;
  }

  async insertNote(note: NotesTable['Insert']) {
    const { error, data } = await this.notesTable
      .insert(note)
      .select('*')
      .single();

    if (error) throw error;

    return data;
  }

  async updateNote(note: NotesTable['Update']) {
    return this.notesTable.update(note).eq('id', note.id).select('*').single();
  }

  async deleteNote(noteId: string) {
    return this.notesTable.delete().eq('id', noteId);
  }
}
