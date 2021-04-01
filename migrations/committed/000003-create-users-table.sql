--! Previous: sha1:f9190c5b5e40e46034bf9eebcc341a7a03de781b
--! Hash: sha1:2df77fdc4c1e002cc29eb819f94c432e1e617c92
--! Message: Create users table

-- Create users table

-- Undo if rerunning
DROP TABLE IF EXISTS users;

-- Create table (password is encrypted)
CREATE TABLE USERS (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT true,
    level           TEXT NOT NULL default 'info',
    library_id      SERIAL NOT NULL,
    notes           TEXT NULL,
    password        TEXT NOT NULL,
    username        TEXT NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX uk_users_username ON users (username);

-- Create foreign key
ALTER TABLE users ADD CONSTRAINT fk_users_library_id
    FOREIGN KEY (library_id) REFERENCES libraries (id);
