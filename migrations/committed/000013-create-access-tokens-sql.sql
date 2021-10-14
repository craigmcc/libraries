--! Previous: sha1:f441e2f001a72fc683fe51325317a8cebb15f757
--! Hash: sha1:1f60a35b68a0cdd8dc0c118913facb60237c15eb
--! Message: create-access-tokens.sql

-- Create access_tokens table

-- Undo if rerunning
DROP TABLE IF EXISTS access_tokens;

-- Create table
CREATE TABLE access_tokens (
                               id              SERIAL PRIMARY KEY,
                               expires         TIMESTAMP WITH TIME ZONE NOT NULL,
                               scope           TEXT NOT NULL,
                               token           TEXT NOT NULL,
                               user_id         INTEGER NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX access_tokens_token_key ON access_tokens (token);

-- Create foreign key constraint
ALTER TABLE access_tokens ADD CONSTRAINT access_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
