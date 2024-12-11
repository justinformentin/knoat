create policy notes_delete on public.notes for
delete
  to authenticated using (
    user_id = ( select auth.uid ())
  );