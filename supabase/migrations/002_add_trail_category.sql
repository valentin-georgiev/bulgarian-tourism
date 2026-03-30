-- Add 'trail' to the category CHECK constraint
ALTER TABLE places
  DROP CONSTRAINT IF EXISTS places_category_check;

ALTER TABLE places
  ADD CONSTRAINT places_category_check
  CHECK (category IN ('lake', 'mountain', 'cave', 'city', 'fishing', 'trail'));
