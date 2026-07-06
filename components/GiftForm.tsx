"use client";

import { useFormState } from "react-dom";
import { createGiftAction } from "@/app/actions/gifts";
import { SubmitButton } from "@/components/SubmitButton";

export function GiftForm() {
  const [state, formAction] = useFormState(createGiftAction, {});

  return (
    <form action={formAction} className="card-surface space-y-4 p-6">
      <h2 className="font-display text-lg font-semibold text-wine-800 dark:text-blush-50">Nova ideia de presente</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Título</label>
          <input name="title" required className="input-field" placeholder="Ex: Bolsa que ela viu na loja" />
        </div>
        <div>
          <label className="label-field">Preço estimado (R$)</label>
          <input name="price_estimate" inputMode="decimal" className="input-field" placeholder="Ex: 250.00" />
        </div>
        <div>
          <label className="label-field">Link</label>
          <input name="link" type="url" className="input-field" placeholder="https://..." />
        </div>
        <div>
          <label className="label-field">Prioridade</label>
          <select name="priority" defaultValue="media" className="input-field">
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label-field">Descrição</label>
        <textarea name="description" rows={2} className="input-field" placeholder="Detalhes, tamanho, cor..." />
      </div>

      <input type="hidden" name="status" value="ideia" />

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.success}</p>}

      <SubmitButton className="btn-primary">Adicionar ideia</SubmitButton>
    </form>
  );
}
