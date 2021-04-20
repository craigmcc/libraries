--! Previous: sha1:ec0dc2b96956b80a528805451550f8cf5ac0a582
--! Hash: sha1:ac3a836fd3272637fb66bddd97988f0ebab8e98b
--! Message: add google_id to volumes

-- Additional volume columns

ALTER TABLE volumes
    ADD COLUMN IF NOT EXISTS google_id TEXT NULL;
