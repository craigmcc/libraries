--! Previous: sha1:ac3a836fd3272637fb66bddd97988f0ebab8e98b
--! Hash: sha1:5bbce65aa9f35d280f7269e9da143196f3ee8ea2
--! Message: Add users table

-- Create users table

-- Undo if rerunning
DROP TABLE IF EXISTS users;

-- Create table
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    password        TEXT NOT NULL,
    scope           TEXT NOT NULL,
    username        TEXT NOT NULL
);

-- Create unique index on username
CREATE UNIQUE INDEX uk_users_username ON users (username);
