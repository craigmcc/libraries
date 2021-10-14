--! Previous: sha1:1f60a35b68a0cdd8dc0c118913facb60237c15eb
--! Hash: sha1:6eced835eb5bb56b1e732182ca655ba44bfe1ce3
--! Message: create-refresh-tokens.sql

-- Create refresh_tokens table

-- Undo if rerunning
DROP TABLE IF EXISTS refresh_tokens;

-- Create table
CREATE TABLE refresh_tokens (
                                id              SERIAL PRIMARY KEY,
                                access_token    TEXT NOT NULL,
                                expires         TIMESTAMP WITH TIME ZONE NOT NULL,
                                token           TEXT NOT NULL,
                                user_id         INTEGER NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX refresh_tokens_token_key ON refresh_tokens (token);

-- Create foreign key constraint
ALTER TABLE refresh_tokens ADD CONSTRAINT refresh_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
