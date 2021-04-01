--! Previous: sha1:73dd51c0091406d1bcb08fa10b3f83c22ea6ee06
--! Hash: sha1:f9190c5b5e40e46034bf9eebcc341a7a03de781b
--! Message: Create authors table

-- Create authors table

-- Undo if rerunning
DROP TABLE IF EXISTS authors;

-- Create table
CREATE TABLE authors (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT true,
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    library_id      SERIAL NOT NULL,
    notes           TEXT NULL
);

-- Create unique index
CREATE UNIQUE INDEX uk_authors_library_id_last_name_first_name
    ON authors (library_id, last_name, first_name);

-- Create foreign key
ALTER TABLE authors ADD CONSTRAINT fk_authors_library_id
    FOREIGN KEY (library_id) REFERENCES libraries (id);
