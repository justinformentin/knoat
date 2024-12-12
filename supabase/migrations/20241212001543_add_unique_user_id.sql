-- Add uniqueness to the table's user_id fkey so in our join call
-- we only get the single object instead of an array
ALTER TABLE users ADD CONSTRAINT unique_id UNIQUE (id);
ALTER TABLE directories ADD CONSTRAINT unique_directory_user_id UNIQUE (user_id);
ALTER TABLE todos ADD CONSTRAINT unique_todos_user_id UNIQUE (user_id);