create schema if not exists kit;

create extension if not exists "unaccent" schema kit;

-- We remove all default privileges from public schema on functions to
--   prevent public access to them
alter default privileges
revoke
execute on functions
from
  public;

revoke all on schema public
from
  public;

revoke all PRIVILEGES on database "postgres"
from
  "anon";

revoke all PRIVILEGES on schema "public"
from
  "anon";

revoke all PRIVILEGES on schema "storage"
from
  "anon";

revoke all PRIVILEGES on all SEQUENCES in schema "public"
from
  "anon";

revoke all PRIVILEGES on all SEQUENCES in schema "storage"
from
  "anon";

revoke all PRIVILEGES on all FUNCTIONS in schema "public"
from
  "anon";

revoke all PRIVILEGES on all FUNCTIONS in schema "storage"
from
  "anon";

revoke all PRIVILEGES on all TABLES in schema "public"
from
  "anon";

revoke all PRIVILEGES on all TABLES in schema "storage"
from
  "anon";

-- We remove all default privileges from public schema on functions to
--   prevent public access to them by default
alter default privileges in schema public
revoke
execute on functions
from
  anon,
  authenticated;

-- we allow the authenticated role to execute functions in the public schema
grant usage on schema public to authenticated;

-- we allow the service_role role to execute functions in the public schema
grant usage on schema public to service_role;

-- Automatically set timestamps on tables when a row is inserted or updated
create
or replace function public.trigger_set_timestamps () returns trigger
set
  search_path = '' as $$
begin
    if TG_OP = 'INSERT' then
        new.created_at = now();

        new.updated_at = now();

    else
        new.updated_at = now();

        new.created_at = old.created_at;

    end if;

    return NEW;

end
$$ language plpgsql;

-- Create a function to use ISO format timestamps
CREATE OR REPLACE FUNCTION date_display_tz(param_dt timestamp with time zone)
 RETURNS text AS
$$
DECLARE var_result varchar;
BEGIN
PERFORM set_config('timezone', 'UTC', true);
var_result := to_char(param_dt , 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
RETURN var_result;
END;
$$ language plpgsql VOLATILE;

grant
execute on function date_display_tz (timestamp with time zone) to authenticated,
service_role;

-- Create User table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  email varchar(320) unique,
  slug text unique,
  picture_url varchar(1000),
  public_data jsonb default '{}'::jsonb not null,
  created_at varchar default date_display_tz(now()) not null,
  updated_at varchar default date_display_tz(now()) not null
);

-- Revoke all on accounts table from authenticated and service_role
revoke all on public.users
from
  authenticated,
  service_role;

-- Open up access to accounts
grant select, insert, update, delete 
on table public.users 
to authenticated, service_role;

alter table public.users enable row level security;
-- Create Notes Table
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  full_path text not null,
  label text not null,
  content jsonb not null default '{}',
  created_at varchar default date_display_tz(now()) not null,
  updated_at varchar default date_display_tz(now()) not null
);
-- Revoke all on accounts table from authenticated and service_role
revoke all on public.notes
from
  authenticated,
  service_role;

-- Open up access to accounts
grant select, insert, update, delete 
on table public.notes 
to authenticated, service_role;

alter table public.notes enable row level security;

create policy notes_read on public.notes for
select
  to authenticated using (
    user_id = ( select auth.uid ())
  );

create policy notes_insert on public.notes for
insert
  to authenticated with check (
      (user_id = ( SELECT auth.uid() AS uid))
    );

create policy notes_update on public.notes for
update
  to authenticated
    using (
      (user_id = ( SELECT auth.uid() AS uid))
    ) with check (
      (user_id = ( SELECT auth.uid() AS uid))
    );

-- Directories
create table if not exists public.directories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  full_path text not null,
  label text not null,
  created_at varchar default date_display_tz(now()) not null
);

-- Revoke all on accounts table from authenticated and service_role
revoke all on public.directories
from
  authenticated,
  service_role;

-- Open up access to accounts
grant select, insert, update, delete 
on table public.directories 
to authenticated, service_role;

alter table public.directories enable row level security;

create policy directoriess_read on public.directories for
select
  to authenticated using (
    user_id = ( select auth.uid ())
  );

create policy directories_insert on public.directories for
insert
  to authenticated with check (
      (user_id = ( SELECT auth.uid() AS uid))
    );

create policy directories_update on public.directories for
update
  to authenticated
    using (
      (user_id = ( SELECT auth.uid() AS uid))
    ) with check (
      (user_id = ( SELECT auth.uid() AS uid))
    );