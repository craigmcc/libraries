--! Previous: sha1:5bbce65aa9f35d280f7269e9da143196f3ee8ea2
--! Hash: sha1:09b35f378bdcd6034a0f6eb95127ca4ce0bd22e5
--! Message: add-users-level

-- Add users level

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS level TEXT NOT NULL DEFAULT 'info';
