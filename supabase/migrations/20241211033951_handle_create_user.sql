create
or replace function handle_create_user () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    insert into public.users (id, email) values(new.id, new.email);
    insert into public.directories (user_id) values(new.id);
    insert into public.todos (user_id) values(new.id);

    return new;

end;

$$;

create trigger "on_auth_user_created"
after
insert on auth.users for each row
execute procedure handle_create_user ();
