--! Previous: sha1:09b35f378bdcd6034a0f6eb95127ca4ce0bd22e5
--! Hash: sha1:f441e2f001a72fc683fe51325317a8cebb15f757
--! Message: volumes-drop-media-add-type

-- Drop media add type

ALTER TABLE volumes
  DROP COLUMN IF EXISTS media,
  ADD COLUMN IF NOT EXISTS type TEXT NULL DEFAULT 'Single';

UPDATE volumes SET type = 'Single';

ALTER TABLE volumes
  ALTER COLUMN type SET NOT NULL;
