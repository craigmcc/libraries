--! Previous: sha1:3fc2fad5d1bbd892f4696e912b959b5c96e47adc
--! Hash: sha1:ec0dc2b96956b80a528805451550f8cf5ac0a582
--! Message: support principal authors

-- Support concept of principal authors

ALTER TABLE authors_series
  ADD COLUMN IF NOT EXISTS principal BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE authors_stories
    ADD COLUMN IF NOT EXISTS principal BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE authors_volumes
    ADD COLUMN IF NOT EXISTS principal BOOLEAN NOT NULL DEFAULT false;
