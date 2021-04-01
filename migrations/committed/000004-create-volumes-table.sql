--! Previous: sha1:2df77fdc4c1e002cc29eb819f94c432e1e617c92
--! Hash: sha1:126af449dfb2c4779c9a44ba651b01332354cb54
--! Message: Create volumes table

-- Create volumes table

-- Undo if rerunning
DROP TABLE IF EXISTS authors_volumes;
DROP TABLE IF EXISTS volumes;

-- volumes ===================================================================

-- Create table
CREATE TABLE volumes (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT true,
    copyright       SMALLINT NULL, -- TODO - year range?
    isbn            TEXT NULL,
    library_id      SERIAL NOT NULL,
    location        TEXT NULL, -- TODO - enumeration?
    media           TEXT NULL, -- TODO - enumeration?
    name            TEXT NOT NULL,
    notes           TEXT NULL,
    read            BOOLEAN NOT NULL DEFAULT false
);

-- Create non-unique index
CREATE INDEX ix_volumes_library_id_name
    ON volumes (library_id, name);

-- Create foreign key
ALTER TABLE volumes ADD CONSTRAINT fk_volumes_library_id
    FOREIGN KEY (library_id) REFERENCES libraries (id);

-- authors_volumes ===========================================================

CREATE TABLE authors_volumes (
    id              SERIAL PRIMARY KEY,
    author_id       SERIAL NOT NULL,
    volume_id       SERIAL NOT NULL
);

-- Create forward and reverse unique indexes
CREATE UNIQUE INDEX uk_authors_volumes_author_id_volume_id
    ON authors_volumes (author_id, volume_id);
CREATE UNIQUE INDEX uk_authors_volumes_volume_id_author_id
    ON authors_volumes (volume_id, author_id);

-- Create foreign keys
ALTER TABLE authors_volumes ADD CONSTRAINT fk_authors_volumes_authors_id
    FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE authors_volumes ADD CONSTRAINT fk_authors_volumes_volumes_id
    FOREIGN KEY (volume_id) REFERENCES volumes (id);
