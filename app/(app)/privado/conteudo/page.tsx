import { redirect } from "next/navigation";
import { lockPrivateAreaAction } from "@/app/actions/auth";
import { MemoryCard } from "@/components/MemoryCard";
import { PageHeader } from "@/components/PageHeader";
import { PhotoGallery, type GalleryPhoto } from "@/components/PhotoGallery";
import { isPrivateAreaUnlocked, listMemories, listPhotos } from "@/lib/queries";
import { getSignedUrls } from "@/lib/storage";

export default async function PrivadoConteudoPage() {
  // Checagem redundante no servidor, além do middleware, por seguranca.
  const unlocked = await isPrivateAreaUnlocked();
  if (!unlocked) {
    redirect("/privado");
  }

  const [allPhotos, allMemories] = await Promise.all([
    listPhotos({ includePrivate: true }),
    listMemories({ includePrivate: true }),
  ]);

  const privatePhotos = allPhotos.filter((p) => p.is_private);
  const privateMemories = allMemories.filter((m) => m.is_private);

  const photoUrlMap = await getSignedUrls(privatePhotos.map((p) => p.storage_path));
  const memoryImagePaths = privateMemories.flatMap((m) => m.image_paths || []);
  const memoryUrlMap = await getSignedUrls(memoryImagePaths);

  const galleryPhotos: GalleryPhoto[] = privatePhotos.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    is_favorite: p.is_favorite,
    is_private: p.is_private,
    url: photoUrlMap[p.storage_path] ?? null,
  }));

  return (
    <div>
      <PageHeader
        title="Área Privada"
        subtitle="Fotos, memórias e anotações mais pessoais."
        action={
          <form action={lockPrivateAreaAction}>
            <button type="submit" className="btn-secondary">
              Bloquear área privada
            </button>
          </form>
        }
      />

      <div className="mb-8 rounded-xl border border-wine-200 bg-wine-50 px-4 py-3 text-sm text-wine-700 dark:border-wine-600 dark:bg-wine-800/60 dark:text-blush-100">
        ⚠️ Esta área contém lembranças pessoais e deve ser usada apenas com consentimento de todos os envolvidos.
        Nada aqui é exibido no dashboard, nas prévias públicas ou é indexado por buscadores.
      </div>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-wine-500 dark:text-blush-200">
          Fotos privadas
        </h2>
        <p className="mb-3 text-xs text-wine-400 dark:text-blush-200/60">
          Para adicionar fotos privadas, marque a opção &quot;Marcar como privada&quot; na Galeria de Fotos.
        </p>
        <PhotoGallery photos={galleryPhotos} showPrivateToggle />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-wine-500 dark:text-blush-200">
          Memórias e anotações privadas
        </h2>
        <p className="mb-3 text-xs text-wine-400 dark:text-blush-200/60">
          Para adicionar aqui, marque a opção &quot;Marcar como privada&quot; em Nossas Memórias.
        </p>
        {privateMemories.length === 0 ? (
          <p className="text-sm text-wine-400 dark:text-blush-200/60">Nada privado por aqui ainda.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {privateMemories.map((m) => (
              <MemoryCard
                key={m.id}
                memory={m}
                imageUrls={(m.image_paths || []).map((p) => memoryUrlMap[p]).filter((u): u is string => Boolean(u))}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
