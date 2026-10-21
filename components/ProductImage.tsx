import Image from "next/image";
import { TShirt, Sneaker } from "@phosphor-icons/react/dist/ssr";
import type { Tipo } from "@/lib/types";

/**
 * Foto do produto, servida pela optimização de imagens do Next (WebP na largura certa para cada ecrã).
 * Sem foto (ou com um tom "#..." de demonstração antiga), mostra uma superfície discreta com um ícone.
 */
export function ProductImage({
  src, tipo, alt = "Foto do produto", className = "", sizes = "(min-width: 768px) 33vw, 50vw", priority = false,
}: { src?: string; tipo: Tipo; alt?: string; className?: string; sizes?: string; priority?: boolean }) {
  if (src && !src.startsWith("#")) {
    return (
      <Image
        src={src}
        alt={alt}
        width={1000}
        height={1250}
        sizes={sizes}
        priority={priority}
        // Com aspect-ratio, a altura tem de ficar automática para a proporção mandar.
        className={`object-cover ${className.includes("aspect-") ? "h-auto" : ""} ${className}`}
      />
    );
  }
  const Icon = tipo === "calcado" ? Sneaker : TShirt;
  return (
    <div className={`flex items-center justify-center bg-brand-soft ${className}`} role="img" aria-label={`${alt}, sem foto`}>
      <Icon className="size-10 text-realce/30" weight="light" />
    </div>
  );
}
