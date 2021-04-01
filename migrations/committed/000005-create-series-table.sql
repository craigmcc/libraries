--! Previous: sha1:126af449dfb2c4779c9a44ba651b01332354cb54
--! Hash: sha1:eeb66fa6893fca52b2b54f79e874506bf629d55a
--! Message: Create series table

-- Create series table

-- Undo if rerunning
DROP TABLE IF EXISTS authors_series;
DROP TABLE IF EXISTS series;

-- series ====================================================================

-- Create table
CREATE TABLE series (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT true,
    copyright       SMALLINT NULL, -- TODO - year range?
    library_id      SERIAL NOT NULL,
    name            TEXT NOT NULL,
    notes           TEXT NULL
);

-- Create unique index
CREATE UNIQUE INDEX ix_series_library_id_name
    ON series (library_id, name);

-- Create foreign key
ALTER TABLE series ADD CONSTRAINT fk_series_library_id
    FOREIGN KEY (library_id) REFERENCES libraries (id);

-- authors_series ============================================================

CREATE TABLE authors_series (
    id              SERIAL PRIMARY KEY,
    author_id       SERIAL NOT NULL,
    series_id       SERIAL NOT NULL
);

-- Create forward and reverse unique indexes
CREATE UNIQUE INDEX uk_authors_series_author_id_series_id
    ON authors_series (author_id, series_id);
CREATE UNIQUE INDEX uk_authors_series_series_id_author_id
    ON authors_series (series_id, author_id);

-- Create foreign keys
ALTER TABLE authors_series ADD CONSTRAINT fk_authors_series_authors_id
    FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE authors_series ADD CONSTRAINT fk_authors_series_series_id
    FOREIGN KEY (series_id) REFERENCES series (id);
