--! Previous: -
--! Hash: sha1:73dd51c0091406d1bcb08fa10b3f83c22ea6ee06
--! Message: Create libraries table and seed initial data

-- Create libraries table and seed initial data

-- Undo if rerunning
DROP TABLE IF EXISTS libraries;

-- Create table
CREATE TABLE libraries (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    name            TEXT NOT NULL,
    notes           TEXT NULL,
    scope           TEXT NOT NULL
);

-- Create unique index on name
CREATE UNIQUE INDEX uk_libraries_name ON libraries (name);

-- Seed initial data
INSERT INTO libraries (name, scope) VALUES
    ('Personal Library', 'personal'),
    ('Test Library', 'test');
