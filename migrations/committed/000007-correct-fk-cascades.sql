--! Previous: sha1:a9bc8b3278ad3f0330da9042d428d41162dc30db
--! Hash: sha1:3fc2fad5d1bbd892f4696e912b959b5c96e47adc
--! Message: correct fk cascades

-- Correct foreign key constraints

-- Undo if rerunning
ALTER TABLE authors DROP CONSTRAINT IF EXISTS fk_authors_library_id;
ALTER TABLE authors_series DROP CONSTRAINT IF EXISTS fk_authors_series_author_id;
ALTER TABLE authors_series DROP CONSTRAINT IF EXISTS fk_authors_series_authors_id;
ALTER TABLE authors_series DROP CONSTRAINT IF EXISTS fk_authors_series_series_id;
ALTER TABLE authors_stories DROP CONSTRAINT IF EXISTS fk_authors_stories_author_id;
ALTER TABLE authors_stories DROP CONSTRAINT IF EXISTS fk_authors_stories_story_id;
ALTER TABLE authors_volumes DROP CONSTRAINT IF EXISTS fk_authors_volumes_author_id;
ALTER TABLE authors_volumes DROP CONSTRAINT IF EXISTS fk_authors_volumes_authors_id;
ALTER TABLE authors_volumes DROP CONSTRAINT IF EXISTS fk_authors_volumes_volume_id;
ALTER TABLE authors_volumes DROP CONSTRAINT IF EXISTS fk_authors_volumes_volumes_id;
ALTER TABLE series DROP CONSTRAINT IF EXISTS fk_series_library_id;
ALTER TABLE series_stories DROP CONSTRAINT IF EXISTS fk_series_stories_series_id;
ALTER TABLE series_stories DROP CONSTRAINT IF EXISTS fk_series_stories_story_id;
ALTER TABLE stories DROP CONSTRAINT IF EXISTS fk_stories_library_id;
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_library_id;
ALTER TABLE volumes DROP CONSTRAINT IF EXISTS fk_volumes_library_id;
ALTER TABLE volumes_stories DROP CONSTRAINT IF EXISTS fk_volumes_stories_story_id;
ALTER TABLE volumes_stories DROP CONSTRAINT IF EXISTS fk_volumes_stories_volume_id;

-- Recreate with ON DELETE and ON UPDATE semantics
ALTER TABLE authors ADD CONSTRAINT fk_authors_library_id
    FOREIGN KEY (library_id) REFERENCES libraries (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE authors_series ADD CONSTRAINT fk_authors_series_author_id
    FOREIGN KEY (author_id) REFERENCES authors (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE authors_series ADD CONSTRAINT fk_authors_series_series_id
    FOREIGN KEY (series_id) REFERENCES series (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE authors_stories ADD CONSTRAINT fk_authors_stories_author_id
    FOREIGN KEY (author_id) REFERENCES authors (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE authors_stories ADD CONSTRAINT fk_authors_stories_story_id
    FOREIGN KEY (story_id) REFERENCES stories (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE authors_volumes ADD CONSTRAINT fk_authors_volumes_author_id
    FOREIGN KEY (author_id) REFERENCES authors (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE authors_volumes ADD CONSTRAINT fk_authors_volumes_volume_id
    FOREIGN KEY (volume_id) REFERENCES volumes (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE series ADD CONSTRAINT fk_series_library_id
    FOREIGN KEY (library_id) REFERENCES libraries (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE series_stories ADD CONSTRAINT fk_series_stories_series_id
    FOREIGN KEY (series_id) REFERENCES series (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE series_stories ADD CONSTRAINT fk_series_stories_story_id
    FOREIGN KEY (story_id) REFERENCES stories (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE stories ADD CONSTRAINT fk_stories_library_id
    FOREIGN KEY (library_id) REFERENCES libraries (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE users ADD CONSTRAINT fk_users_library_id
    FOREIGN KEY (library_id) REFERENCES libraries (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE volumes ADD CONSTRAINT fk_volumes_library_id
    FOREIGN KEY (library_id) REFERENCES libraries (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE volumes_stories ADD CONSTRAINT fk_volumes_stories_story_id
    FOREIGN KEY (story_id) REFERENCES stories (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE volumes_stories ADD CONSTRAINT fk_volumes_stories_volume_id
    FOREIGN KEY (volume_id) REFERENCES volumes (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
