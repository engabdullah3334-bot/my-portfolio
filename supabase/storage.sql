-- ==============================================================================
-- ABDULLAH ADEL PORTFOLIO — STORAGE BUCKETS CONFIGURATION
-- Run in Supabase SQL Editor after running schema.sql
-- ==============================================================================

-- 1) Project Images Bucket (5MB limit: JPEG, PNG, WebP, GIF)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update
  set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

-- 2) Documents Bucket for Tech Sheets & CV PDFs (10MB limit)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', true, 10485760, array['application/pdf'])
on conflict (id) do update
  set public = true, file_size_limit = 10485760, allowed_mime_types = array['application/pdf'];

-- RLS Storage Policies: Anyone can view/download via CDN URLs, only authenticated Admins can upload, modify or delete
drop policy if exists "admin_manage_project_images" on storage.objects;
create policy "admin_manage_project_images" on storage.objects
  for all to authenticated 
  using (bucket_id in ('project-images', 'documents') and public.is_admin())
  with check (bucket_id in ('project-images', 'documents') and public.is_admin());
