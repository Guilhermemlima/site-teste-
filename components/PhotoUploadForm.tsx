"use client";

import { useFormState } from "react-dom";
import { createPhotoAction } from "@/app/actions/photos";
import { SubmitButton } from "@/components/SubmitButton";

export function PhotoUploadForm() {
  const [state, formAction] = useFormState(createPhotoAction, {});

  return (
    <form action={formAction} encType="multipart/form-data" className="card-surface space-y-4 p-6">
      <h2 className="font-display text-lg font-semibold text-wine-800 dark:text-blush-50">Adicionar fotos</h2>

      <input
        name="photos"
        type="file"
        multiple
        required
        accept="image/jpeg,image/png,image/webp"
        className="input-field file:mr-3 file:rounded-full file:border-0 file:bg-wine-600 file:px-3 file:py-1 file:text-xs file:text-white"
      />
      <p className="text-xs text-wine-400 dark:text-blush-200/60">JPEG, PNG ou WebP, até 8MB cada</p>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.success}</p>}

      <SubmitButton className="btn-primary">Enviar</SubmitButton>
    </form>
  );
}
