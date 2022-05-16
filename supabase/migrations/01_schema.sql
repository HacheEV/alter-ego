CREATE TABLE IF NOT EXISTS roles(
    id integer PRIMARY KEY UNIQUE NOT NULL,
    role varchar(24) NOT NULL
    );

CREATE TABLE IF NOT EXISTS conversations(
    id varchar(12) PRIMARY KEY NOT NULL,
    user_id varchar NOT NULL,
    app_selfie varchar NOT NULL,
    user_selfie varchar NOT NULL,
    created_at timestamp DEFAULT NOW()
    );

ALTER TABLE auth.users ADD COLUMN username varchar;
ALTER TABLE auth.users ADD COLUMN app_role integer;

ALTER TABLE auth.users
    ADD CONSTRAINT user_role_fk FOREIGN KEY (app_role) REFERENCES roles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;