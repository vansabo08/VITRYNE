-- O Storage lê o objecto antes de o apagar ou substituir: o dono precisa de ler a sua pasta.
create policy "vitryne_ler_proprio" on storage.objects for select to authenticated
  using (bucket_id = 'vitryne' and (storage.foldername(name))[1] = (select auth.uid())::text);
