-- Fix storage RLS: policies were checking auth.uid() as first folder,
-- but uploads use household.id as first folder. Now checks household membership.

DROP POLICY IF EXISTS "upload_own_images" ON storage.objects;
DROP POLICY IF EXISTS "read_own_images" ON storage.objects;
DROP POLICY IF EXISTS "delete_own_images" ON storage.objects;

CREATE POLICY "upload_household_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'item-images'
  AND EXISTS (
    SELECT 1 FROM public.household_members
    WHERE household_members.household_id::text = (storage.foldername(name))[1]
      AND household_members.user_id = (SELECT auth.uid())
  )
);

CREATE POLICY "read_household_images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'item-images'
  AND EXISTS (
    SELECT 1 FROM public.household_members
    WHERE household_members.household_id::text = (storage.foldername(name))[1]
      AND household_members.user_id = (SELECT auth.uid())
  )
);

CREATE POLICY "delete_household_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'item-images'
  AND EXISTS (
    SELECT 1 FROM public.household_members
    WHERE household_members.household_id::text = (storage.foldername(name))[1]
      AND household_members.user_id = (SELECT auth.uid())
  )
);
