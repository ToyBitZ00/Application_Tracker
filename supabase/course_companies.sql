-- Create join table for mapping courses to companies.
create table if not exists public.course_companies (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (course_id, company_id)
);

alter table public.course_companies enable row level security;

drop policy if exists "Admins can view course companies" on public.course_companies;
create policy "Admins can view course companies"
on public.course_companies
for select
using (
  exists (
    select 1
    from public.application_users au
    where au.id = auth.uid()
      and au.account_role in ('admin', 'super_admin')
  )
);

drop policy if exists "Admins can manage course companies" on public.course_companies;
create policy "Admins can manage course companies"
on public.course_companies
for insert
with check (
  exists (
    select 1
    from public.application_users au
    where au.id = auth.uid()
      and au.account_role in ('admin', 'super_admin')
  )
);

drop policy if exists "Admins can delete course companies" on public.course_companies;
create policy "Admins can delete course companies"
on public.course_companies
for delete
using (
  exists (
    select 1
    from public.application_users au
    where au.id = auth.uid()
      and au.account_role in ('admin', 'super_admin')
  )
);

create or replace function public.list_course_companies_for_admin(
  p_actor_user_id uuid,
  p_course_id uuid
)
returns table (
  id uuid,
  name text,
  description text,
  location text,
  website text,
  role text,
  logo_url text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.application_users au
    where au.id = p_actor_user_id
      and au.account_role in ('admin', 'super_admin')
  ) then
    raise exception 'Access denied';
  end if;

  return query
  select c.id,
         c.name,
         c.description,
         c.location,
         c.website,
         c.role,
         c.logo_url
  from public.course_companies cc
  join public.companies c on c.id = cc.company_id
  where cc.course_id = p_course_id
  order by c.name asc;
end;
$$;

create or replace function public.create_company_for_admin(
  p_actor_user_id uuid,
  p_name text,
  p_role text default null,
  p_location text default null,
  p_description text default null,
  p_website text default null,
  p_logo_url text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
begin
  if not exists (
    select 1
    from public.application_users au
    where au.id = p_actor_user_id
      and au.account_role in ('admin', 'super_admin')
  ) then
    raise exception 'Access denied';
  end if;

  if trim(p_name) = '' then
    raise exception 'Company name is required';
  end if;

  insert into public.companies (
    name,
    role,
    location,
    description,
    website,
    logo_url
  )
  values (
    trim(p_name),
    nullif(trim(p_role), ''),
    nullif(trim(p_location), ''),
    nullif(trim(p_description), ''),
    nullif(trim(p_website), ''),
    nullif(trim(p_logo_url), '')
  )
  returning id into v_company_id;

  return v_company_id;
end;
$$;

create or replace function public.upsert_course_company_for_admin(
  p_actor_user_id uuid,
  p_course_id uuid,
  p_company_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.application_users au
    where au.id = p_actor_user_id
      and au.account_role in ('admin', 'super_admin')
  ) then
    raise exception 'Access denied';
  end if;

  if not exists (
    select 1
    from public.courses c
    where c.id = p_course_id
  ) then
    raise exception 'Course not found';
  end if;

  if not exists (
    select 1
    from public.companies co
    where co.id = p_company_id
  ) then
    raise exception 'Company not found';
  end if;

  insert into public.course_companies (course_id, company_id)
  values (p_course_id, p_company_id)
  on conflict (course_id, company_id) do nothing;
end;
$$;

create or replace function public.remove_course_company_for_admin(
  p_actor_user_id uuid,
  p_course_id uuid,
  p_company_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.application_users au
    where au.id = p_actor_user_id
      and au.account_role in ('admin', 'super_admin')
  ) then
    raise exception 'Access denied';
  end if;

  delete from public.course_companies cc
  where cc.course_id = p_course_id
    and cc.company_id = p_company_id;
end;
$$;
