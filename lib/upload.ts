import { createClient } from "./supabase/browser";

/** Reduz a imagem (máx. 1200 px) e converte para WebP antes de enviar, para poupar dados. */
async function paraWebP(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const escala = Math.min(1, 1200 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * escala);
  canvas.height = Math.round(bmp.height * escala);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((ok, falhou) =>
    canvas.toBlob((b) => (b ? ok(b) : falhou(new Error("Não foi possível converter a imagem."))), "image/webp", 0.8),
  );
}

/** Envia para o bucket público "vitryne", na pasta do utilizador. Devolve o URL público. */
export async function enviarImagem(file: File): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sessão expirada. Entra outra vez.");
  const caminho = `${user.id}/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from("vitryne").upload(caminho, await paraWebP(file), {
    contentType: "image/webp",
    cacheControl: "31536000",
  });
  if (error) throw new Error("Não foi possível enviar a foto. Tenta outra vez.");
  return supabase.storage.from("vitryne").getPublicUrl(caminho).data.publicUrl;
}
