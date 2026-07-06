import { deleteGiftAction, updateGiftAction, updateGiftStatusAction } from "@/app/actions/gifts";
import { DeleteButton } from "@/components/DeleteButton";
import { GIFT_STATUSES, type GiftIdea } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = { ideia: "Ideias", comprado: "Comprado", dado: "Já foi dado" };
const PRIORITY_LABEL: Record<string, string> = { baixa: "Baixa", media: "Média", alta: "Alta" };
const PRIORITY_COLOR: Record<string, string> = {
  baixa: "bg-blush-100 text-wine-600 dark:bg-wine-700/40 dark:text-blush-100",
  media: "bg-blush-200 text-wine-700 dark:bg-wine-700/60 dark:text-blush-50",
  alta: "bg-wine-600 text-white",
};

function currency(value: number | null) {
  if (value === null || value === undefined) return null;
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function GiftBoard({ gifts }: { gifts: GiftIdea[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {GIFT_STATUSES.map((status) => {
        const items = gifts.filter((g) => g.status === status);
        return (
          <div key={status} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-wine-500 dark:text-blush-200">
              {STATUS_LABEL[status]} ({items.length})
            </h2>

            {items.length === 0 && <p className="text-xs text-wine-400 dark:text-blush-200/60">Nada por aqui.</p>}

            {items.map((gift) => (
              <div key={gift.id} className="card-surface p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-wine-800 dark:text-blush-50">{gift.title}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_COLOR[gift.priority]}`}>
                    {PRIORITY_LABEL[gift.priority]}
                  </span>
                </div>

                {gift.description && <p className="mt-1 text-sm text-wine-600 dark:text-blush-200">{gift.description}</p>}

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-wine-500 dark:text-blush-200/80">
                  {currency(gift.price_estimate) && <span>{currency(gift.price_estimate)}</span>}
                  {gift.link && (
                    <a href={gift.link} target="_blank" rel="noopener noreferrer" className="underline">
                      Ver link
                    </a>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form action={updateGiftStatusAction} className="flex items-center gap-1">
                    <input type="hidden" name="id" value={gift.id} />
                    <select
                      name="status"
                      defaultValue={gift.status}
                      onChange={(e) => e.currentTarget.form?.requestSubmit()}
                      className="rounded-lg border border-blush-200 bg-white px-2 py-1 text-xs dark:border-wine-600 dark:bg-wine-800"
                    >
                      {GIFT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </form>

                  <details className="relative">
                    <summary className="cursor-pointer list-none rounded-full border border-wine-200 px-3 py-1 text-xs font-medium text-wine-600 hover:bg-blush-50 dark:border-wine-600 dark:text-blush-100">
                      Editar
                    </summary>
                    <form
                      action={updateGiftAction}
                      className="absolute left-0 z-10 mt-2 w-72 space-y-2 rounded-xl border border-blush-100 bg-white p-3 shadow-soft dark:border-wine-600 dark:bg-wine-800"
                    >
                      <input type="hidden" name="id" value={gift.id} />
                      <input type="hidden" name="status" value={gift.status} />
                      <input name="title" defaultValue={gift.title} required className="input-field" placeholder="Título" />
                      <textarea name="description" defaultValue={gift.description ?? ""} rows={2} className="input-field" />
                      <input name="price_estimate" defaultValue={gift.price_estimate ?? ""} className="input-field" placeholder="Preço" />
                      <input name="link" defaultValue={gift.link ?? ""} className="input-field" placeholder="Link" />
                      <select name="priority" defaultValue={gift.priority} className="input-field">
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                      </select>
                      <button type="submit" className="btn-primary w-full !py-1.5 text-xs">
                        Salvar
                      </button>
                    </form>
                  </details>

                  <DeleteButton
                    action={deleteGiftAction}
                    confirmMessage="Excluir esta ideia de presente?"
                    className="btn-danger !px-3 !py-1 text-xs"
                    hiddenFields={<input type="hidden" name="id" value={gift.id} />}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
