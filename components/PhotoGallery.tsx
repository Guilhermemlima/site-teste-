"use client";

import { useMemo, useState } from "react";
import { deletePhotoAction, toggleFavoritePhotoAction, togglePrivatePhotoAction } from "@/app/actions/photos";

export interface GalleryPhoto {
  id: string;
  title: string | null;
  description: string | null;
  category: string;
  is_favorite: boolean;
  is_private: boolean;
  url: string | null;
}

export function PhotoGallery({ photos, showPrivateToggle = false }: { photos: GalleryPhoto[]; showPrivateToggle?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const current = useMemo(() => (openIndex !== null ? photos[openIndex] : null), [openIndex, photos]);

  function stop(e: React.SyntheticEvent) {
    e.stopPropagation();
  }

  if (photos.length === 0) {
    return <p className="text-sm text-wine-400 dark:text-blush-200/60">Nenhuma foto encontrada nesta categoria.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => setOpenIndex(index)}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-blush-100 shadow-card dark:bg-wine-800"
          >
            {photo.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo.url} alt={photo.title ?? "Foto"} className="h-full w-full object-cover transition group-hover:scale-105" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-wine-300">sem imagem</div>
            )}

            {photo.is_favorite && (
              <span className="absolute left-2 top-2 rounded-full bg-white/90 px-1.5 py-0.5 text-xs text-blush-500 shadow">★</span>
            )}
            {photo.is_private && (
              <span className="absolute left-2 bottom-2 rounded-full bg-wine-800/90 px-1.5 py-0.5 text-[10px] font-medium text-blush-50 shadow">
                privada
              </span>
            )}

            <div
              onClick={stop}
              className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100"
            >
              <form action={toggleFavoritePhotoAction}>
                <input type="hidden" name="id" value={photo.id} />
                <input type="hidden" name="current" value={String(photo.is_favorite)} />
                <button
                  type="submit"
                  title="Favoritar"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm text-wine-600 shadow hover:bg-white"
                >
                  ★
                </button>
              </form>
              <form
                action={deletePhotoAction}
                onSubmit={(e) => {
                  if (!confirm("Excluir esta foto?")) e.preventDefault();
                }}
              >
                <input type="hidden" name="id" value={photo.id} />
                <button
                  type="submit"
                  title="Excluir"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm text-red-600 shadow hover:bg-white"
                >
                  ✕
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            onClick={() => setOpenIndex(null)}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Fechar"
          >
            ✕
          </button>

          {openIndex !== null && openIndex > 0 && (
            <button
              onClick={(e) => {
                stop(e);
                setOpenIndex(openIndex - 1);
              }}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
            >
              ‹
            </button>
          )}
          {openIndex !== null && openIndex < photos.length - 1 && (
            <button
              onClick={(e) => {
                stop(e);
                setOpenIndex(openIndex + 1);
              }}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
            >
              ›
            </button>
          )}

          <div onClick={stop} className="max-h-[85vh] max-w-3xl overflow-hidden rounded-2xl bg-white dark:bg-wine-900">
            {current.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current.url} alt={current.title ?? "Foto"} className="max-h-[65vh] w-full object-contain bg-black" />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {current.title && (
                    <h3 className="font-display text-lg font-semibold text-wine-800 dark:text-blush-50">{current.title}</h3>
                  )}
                  <p className="text-xs uppercase tracking-wide text-wine-400 dark:text-blush-200/70">{current.category}</p>
                </div>
                <div className="flex gap-2">
                  <form action={toggleFavoritePhotoAction}>
                    <input type="hidden" name="id" value={current.id} />
                    <input type="hidden" name="current" value={String(current.is_favorite)} />
                    <button type="submit" className="btn-secondary !px-3 !py-1 text-xs">
                      {current.is_favorite ? "★ Favorita" : "☆ Favoritar"}
                    </button>
                  </form>
                  {showPrivateToggle && (
                    <form action={togglePrivatePhotoAction}>
                      <input type="hidden" name="id" value={current.id} />
                      <input type="hidden" name="current" value={String(current.is_private)} />
                      <button type="submit" className="btn-secondary !px-3 !py-1 text-xs">
                        {current.is_private ? "Tornar pública" : "Tornar privada"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
              {current.description && <p className="mt-2 text-sm text-wine-600 dark:text-blush-200">{current.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
