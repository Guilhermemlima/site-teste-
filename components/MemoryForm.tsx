"use client";

import { useFormState } from "react-dom";
import { createMemoryAction } from "@/app/actions/memories";
import { SubmitButton } from "@/components/SubmitButton";
import { MEMORY_CATEGORIES, MEMORY_EMOTIONS } from "@/lib/types";

export function MemoryForm() {
  const [state, formAction] = useFormState(createMemoryAction, {});

  return (
    <form action={formAction} encType="multipart/form-data" className="card-surface space-y-4 p-6">
      <h2 className="font-display text-lg font-semibold text-wine-800 dark:text-blush-50">Nova memória</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Título</label>
          <input name="title" required className="input-field" placeholder="Ex: Nosso primeiro encontro" />
        </div>
        <div>
          <label className="label-field">Data</label>
          <input type="date" name="date" className="input-field" />
        </div>
        <div>
          <label className="label-field">Categoria</label>
          <select name="category" defaultValue="" className="input-field">
            <option value="">Selecione</option>
            {MEMORY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field">Emoção</label>
          <select name="emotion" defaultValue="" className="input-field">
            <option value="">Selecione</option>
            {MEMORY_EMOTIONS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label-field">Texto da lembrança</label>
        <textarea name="content" required rows={4} className="input-field" placeholder="Conte essa história..." />
      </div>

      <div>
        <label className="label-field">Fotos (opcional, pode selecionar várias)</label>
        <input
          name="images"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="input-field file:mr-3 file:rounded-full file:border-0 file:bg-wine-600 file:px-3 file:py-1 file:text-xs file:text-white"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-wine-600 dark:text-blush-200">
        <input type="checkbox" name="is_private" className="h-4 w-4 rounded border-blush-300 text-wine-600" />
        Marcar como privada (só aparece na Área Privada)
      </label>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.success}</p>}

      <SubmitButton className="btn-primary">Guardar memória</SubmitButton>
    </form>
  );
}
