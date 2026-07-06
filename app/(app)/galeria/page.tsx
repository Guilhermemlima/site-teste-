import { CategoryTabs } from "@/components/CategoryTabs";
import { PageHeader } from "@/components/PageHeader";
import { PhotoGallery, type GalleryPhoto } from "@/components/PhotoGallery";
import { PhotoUploadForm } from "@/components/PhotoUploadForm";
import { listPhotos } from "@/lib/queries";
import { getSignedUrls } from "@/lib/storage";
import { PHOTO_CATEGORIES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function GaleriaPage({
  searchParams,
}: {
  searchParams: { category?: string; favoritas?: string };
}) {
  const photos = await listPhotos({ includePrivate: false });
  const urlMap = await getSignedUrls(photos.map((p) => p.storage_path));

  const counts: Record<string, number> = { __all__: photos.length };
  for (const cat of PHOTO_CATEGORIES) {
    counts[cat] = photos.filter((p) => p.category === cat).length;
  }

  let filtered = photos;
  if (searchParams.category) filtered = filtered.filter((p) => p.category === searchParams.category);
  if (searchParams.favoritas === "1") filtered = filtered.filter((p) => p.is_favorite);

  const galleryPhotos: GalleryPhoto[] = filtered.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    is_favorite: p.is_favorite,
    is_private: p.is_private,
    url: urlMap[p.storage_path] ?? null,
  }));

  return (
    <div>
      <PageHeader title="Galeria de Fotos" subtitle="Fotos dela, nossas e de momentos especiais, organizadas por categoria." />

      <div className="mb-8">
        <PhotoUploadForm />
      </div>

      <CategoryTabs basePath="/galeria" categories={PHOTO_CATEGORIES} active={searchParams.category} counts={counts} />

      <PhotoGallery photos={galleryPhotos} showPrivateToggle />
    </div>
  );
}
