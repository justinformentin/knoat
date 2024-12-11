
ALTER TABLE directories DROP constraint directories_user_id_fkey;
ALTER TABLE directories ADD constraint directories_user_id_fkey foreign key (user_id) references public.users (id);

ALTER TABLE notes DROP constraint notes_user_id_fkey;
ALTER TABLE notes ADD constraint notes_user_id_fkey foreign key (user_id) references public.users (id);

ALTER TABLE todos DROP constraint todos_user_id_fkey;
ALTER TABLE todos ADD constraint todos_user_id_fkey foreign key (user_id) references public.users (id);

create policy users_read on public.users for
select
  to authenticated using (
    id = ( select auth.uid ())
  );

ALTER TABLE directories 
DROP column label,
DROP column full_path;

ALTER TABLE directories ADD column tree jsonb default '[]' not null;

ALTER TABLE todos 
ALTER column list SET DEFAULT '[]', 
ALTER column list SET not null;