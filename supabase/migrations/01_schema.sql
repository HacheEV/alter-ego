CREATE TABLE IF NOT EXISTS roles(
    id integer PRIMARY KEY UNIQUE NOT NULL,
    role varchar(24) NOT NULL
    );

CREATE TABLE IF NOT EXISTS profiles(
   id uuid PRIMARY KEY UNIQUE NOT NULL,
   username varchar,
   role integer NOT NULL DEFAULT 2
);

CREATE TABLE IF NOT EXISTS conversations(
    id varchar(12) PRIMARY KEY NOT NULL,
    user_id varchar NOT NULL,
    app_selfie varchar NOT NULL,
    user_selfie varchar NOT NULL,
    created_at timestamp DEFAULT NOW()
    );

ALTER TABLE public.profiles
    ADD CONSTRAINT user_role_fk FOREIGN KEY (role) REFERENCES roles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

ALTER TABLE public.profiles
    ADD CONSTRAINT auth_user_id_fk FOREIGN KEY (id) REFERENCES auth.users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;


-- inserts a row into public.users
create function public.handle_new_user()
    returns trigger
    language plpgsql
security definer set search_path = public
as $$
begin
insert into public.profiles (id)
values (new.id);
return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();