"use client";

import { useFormState } from "react-dom";
import { createPhotoAction } from "@/app/actions/photos";
import { SubmitButton } from "@/components/SubmitButton";
import { PHOTO_CATEGORIES } from "@/lib/types";

export function PhotoUploadForm() {
  const [state, formAction] = useFormState(createPhotoAction, {});

  return (
    <form action={formAction} encType="multipart/form-data" className="card-surface space-y-4 p-6">
      <h2 className="font-display text-lg font-semibold text-wine-800 dark:text-blush-50">Enviar nova foto</h2>

      <div>
        <label className="label-field">Imagem</label>
        <input
          name="photo"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp"
          className="input-field file:mr-3 file:rounded-full file:border-0 file:bg-wine-600 file:px-3 file:py-1 file:text-xs file:text-white"
        />
        <p className="mt-1 text-xs text-wine-400 dark:text-blush-200/60">JPEG, PNG ou WebP, até 8MB.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Título</label>
          <input name="title" className="input-field" placeholder="Título (opcional)" />
        </div>
        <div>
          <label className="label-field">Categoria</label>
          <select name="category" required defaultValue="" className="input-field">
            <option value="" disabled>
              Selecione
            </option>
            {PHOTO_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field">Data da foto</label>
          <input type="date" name="taken_at" className="input-field" />
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm text-wine-600 dark:text-blush-200">
          <input type="checkbox" name="is_private" className="h-4 w-4 rounded border-blush-300 text-wine-600" />
          Marcar como privada (só aparece na Área Privada)
        </label>
      </div>

      <div>
        <label className="label-field">Descrição</label>
        <textarea name="description" rows={2} className="input-field" placeholder="Descrição (opcional)" />
      </div>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.success}</p>}

      <SubmitButton className="btn-primary">Enviar foto</SubmitButton>
    </form>
  );
}
