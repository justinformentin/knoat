import 'server-only'
import { Database } from '@/lib/database.types';
import { createClient } from '@supabase/supabase-js';

// Remove since this is only used for user creation,
// which happens through backend function
export const serviceClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
