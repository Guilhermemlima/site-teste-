"use client";

import { useFormState } from "react-dom";
import { createImportantDateAction } from "@/app/actions/dates";
import { SubmitButton } from "@/components/SubmitButton";
import { DATE_CATEGORIES } from "@/lib/types";

export function ImportantDateForm() {
  const [state, formAction] = useFormState(createImportantDateAction, {});

  return (
    <form action={formAction} encType="multipart/form-data" className="card-surface space-y-4 p-6">
      <h2 className="font-display text-lg font-semibold text-wine-800 dark:text-blush-50">Nova data importante</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Título</label>
          <input name="title" required className="input-field" placeholder="Ex: Aniversário dela" />
        </div>
        <div>
          <label className="label-field">Data</label>
          <input type="date" name="date" required className="input-field" />
        </div>
        <div>
          <label className="label-field">Categoria</label>
          <select name="category" className="input-field" defaultValue="">
            <option value="">Selecione</option>
            {DATE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field">Foto (opcional)</label>
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="input-field file:mr-3 file:rounded-full file:border-0 file:bg-wine-600 file:px-3 file:py-1 file:text-xs file:text-white" />
        </div>
      </div>

      <div>
        <label className="label-field">Descrição</label>
        <textarea name="description" rows={2} className="input-field" placeholder="Detalhes sobre essa data" />
      </div>

      <label className="flex items-center gap-2 text-sm text-wine-600 dark:text-blush-200">
        <input type="checkbox" name="is_highlighted" className="h-4 w-4 rounded border-blush-300 text-wine-600" />
        Destacar no dashboard
      </label>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.success}</p>}

      <SubmitButton className="btn-primary">Adicionar data</SubmitButton>
    </form>
  );
}
