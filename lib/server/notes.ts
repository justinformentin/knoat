import { serverClient } from '@/utils/supabase/server';
import { cache } from 'react';
import { createNotesService } from '../services/notes.supabase.service';

export const loadUserNotes = cache(async (userId: string) => {
  const client = await serverClient();
  const service = createNotesService(client);

  return service.getNotes(userId);
});
