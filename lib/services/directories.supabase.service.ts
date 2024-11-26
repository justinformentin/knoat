import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

type DirectoriesTable = Database['public']['Tables']['directories'];

export function createDirectoriesService(client: SupabaseClient<Database>) {
  return new DirectoriesService(client);
}

class DirectoriesService {
  constructor(private readonly client: SupabaseClient<Database>) {}

  directoriesTable = this.client.from('directories');

  directoryQuery(userId: string) {
    return this.directoriesTable.select('*').eq('user_id', userId);
  }

  async getDirectories(userId: string) {
    const { data, error } = await this.directoryQuery(userId);
    if (error) throw error;
    return data;
  }

  async getDirectory(fullPath: string, userId: string) {
    const { data, error } = await this.directoryQuery(userId)
      .eq('full_path', fullPath)
      .single();

    if (error) throw error;

    return data;
  }

  async insertDirectory(directory: DirectoriesTable['Insert']) {
    const { error, data } = await this.directoriesTable
      .insert(directory)
      .select('*')
      .single();

    if (error) throw error;

    return data;
  }

  async updateDirectory(directory: DirectoriesTable['Update']) {
    return this.directoriesTable.update(directory).eq('id', directory.id).select('*').single();
  }

  async deleteDirectory(directoryId: string) {
    return this.directoriesTable.delete().eq('id', directoryId);
  }
}
