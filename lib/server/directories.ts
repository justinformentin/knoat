import { serverClient } from '@/utils/supabase/server';
import { cache } from 'react';
import { createDirectoriesService } from './directories.service';

export const loadUserDirectories = cache(async (userId: string) => {
  const client = await serverClient();
  const service = createDirectoriesService(client);
  return service.getDirectories(userId);
});
