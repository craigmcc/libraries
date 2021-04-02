--! Previous: sha1:eeb66fa6893fca52b2b54f79e874506bf629d55a
--! Hash: sha1:a9bc8b3278ad3f0330da9042d428d41162dc30db
--! Message: Create series table

-- Create stories table

-- Undo if rerunning
DROP TABLE IF EXISTS volumes_stories;
DROP TABLE IF EXISTS series_stories;
DROP TABLE IF EXISTS authors_stories;
DROP TABLE IF EXISTS stories;

-- stories ===================================================================

-- Create table
CREATE TABLE stories (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT true,
    copyright       SMALLINT NULL, -- TODO - year range?
    library_id      SERIAL NOT NULL,
    name            TEXT NOT NULL,
    notes           TEXT NULL
);

-- Create non-unique index
CREATE INDEX ix_stories_library_id_name
    ON stories (library_id, name);

-- Create foreign key
ALTER TABLE stories ADD CONSTRAINT fk_stories_library_id
    FOREIGN KEY (library_id) REFERENCES libraries (id);

-- authors_stories ===========================================================

CREATE TABLE authors_stories (
    id              SERIAL PRIMARY KEY,
    author_id       SERIAL NOT NULL,
    story_id        SERIAL NOT NULL
);

-- Create forward and reverse unique indexes
CREATE UNIQUE INDEX uk_authors_stories_author_id_story_id
    ON authors_stories (author_id, story_id);
CREATE UNIQUE INDEX uk_authors_stories_story_id_author_id
    ON authors_stories (story_id, author_id);

-- Create foreign keys
ALTER TABLE authors_stories ADD CONSTRAINT fk_authors_stories_author_id
    FOREIGN KEY (author_id) REFERENCES authors (id);
ALTER TABLE authors_stories ADD CONSTRAINT fk_authors_stories_story_id
    FOREIGN KEY (story_id) REFERENCES stories (id);

-- series_stories ============================================================

CREATE TABLE series_stories (
                                id              SERIAL PRIMARY KEY,
                                series_id       SERIAL NOT NULL,
                                story_id        SERIAL NOT NULL,
                                ordinal         SMALLINT NULL
);

-- Create forward and reverse unique indexes
CREATE UNIQUE INDEX uk_series_stories_series_id_story_id
    ON series_stories (series_id, story_id);
CREATE UNIQUE INDEX uk_series_stories_story_id_series_id
    ON series_stories (story_id, series_id);

-- Create foreign keys
ALTER TABLE series_stories ADD CONSTRAINT fk_series_stories_series_id
    FOREIGN KEY (series_id) REFERENCES series (id);
ALTER TABLE series_stories ADD CONSTRAINT fk_series_stories_story_id
    FOREIGN KEY (story_id) REFERENCES stories (id);

-- volumes_stories ===========================================================

CREATE TABLE volumes_stories (
    id              SERIAL PRIMARY KEY,
    volume_id       SERIAL NOT NULL,
    story_id        SERIAL NOT NULL
);

-- Create forward and reverse unique indexes
CREATE UNIQUE INDEX uk_volumes_stories_volume_id_story_id
    ON volumes_stories (volume_id, story_id);
CREATE UNIQUE INDEX uk_volumes_stories_story_id_volume_id
    ON volumes_stories (story_id, volume_id);

-- Create foreign keys
ALTER TABLE volumes_stories ADD CONSTRAINT fk_volumes_stories_volume_id
    FOREIGN KEY (volume_id) REFERENCES volumes (id);
ALTER TABLE volumes_stories ADD CONSTRAINT fk_volumes_stories_story_id
    FOREIGN KEY (story_id) REFERENCES stories (id);
