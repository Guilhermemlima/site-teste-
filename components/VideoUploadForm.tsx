"use client";

import { useFormState } from "react-dom";
import { createVideoAction } from "@/app/actions/videos";
import { SubmitButton } from "@/components/SubmitButton";

export function VideoUploadForm() {
  const [state, formAction] = useFormState(createVideoAction, {});

  return (
    <form action={formAction} encType="multipart/form-data" className="card-surface space-y-4 p-6">
      <h2 className="font-display text-lg font-semibold text-wine-800 dark:text-blush-50">Adicionar vídeos</h2>

      <input
        name="videos"
        type="file"
        multiple
        required
        accept="video/mp4,video/webm"
        className="input-field file:mr-3 file:rounded-full file:border-0 file:bg-wine-600 file:px-3 file:py-1 file:text-xs file:text-white"
      />
      <p className="text-xs text-wine-400 dark:text-blush-200/60">MP4 ou WebM, até 50MB cada</p>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.success}</p>}

      <SubmitButton className="btn-primary">Enviar</SubmitButton>
    </form>
  );
}
