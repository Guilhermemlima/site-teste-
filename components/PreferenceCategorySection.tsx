import { createPreferenceAction, deletePreferenceAction, updatePreferenceAction } from "@/app/actions/preferences";
import { DeleteButton } from "@/components/DeleteButton";
import type { Preference } from "@/lib/types";

export function PreferenceCategorySection({
  category,
  label,
  items,
}: {
  category: string;
  label: string;
  items: Preference[];
}) {
  return (
    <section className="card-surface p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-wine-800 dark:text-blush-50">{label}</h2>

      <div className="mb-5 space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-wine-400 dark:text-blush-200/60">Nada cadastrado ainda nesta categoria.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-blush-100 p-3 dark:border-wine-700/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-wine-800 dark:text-blush-50">{item.title}</p>
                <p className="text-sm text-wine-600 dark:text-blush-200">{item.value}</p>
                {item.notes && <p className="mt-1 text-xs text-wine-400 dark:text-blush-200/60">{item.notes}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <details className="relative">
                  <summary className="cursor-pointer list-none rounded-full border border-wine-200 px-3 py-1 text-xs font-medium text-wine-600 hover:bg-blush-50 dark:border-wine-600 dark:text-blush-100">
                    Editar
                  </summary>
                  <form
                    action={updatePreferenceAction}
                    className="absolute right-0 z-10 mt-2 w-64 space-y-2 rounded-xl border border-blush-100 bg-white p-3 shadow-soft dark:border-wine-600 dark:bg-wine-800"
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="category" value={category} />
                    <input name="title" defaultValue={item.title} className="input-field" placeholder="Título" required />
                    <input name="value" defaultValue={item.value} className="input-field" placeholder="Valor" required />
                    <textarea name="notes" defaultValue={item.notes ?? ""} className="input-field" placeholder="Observações" rows={2} />
                    <button type="submit" className="btn-primary w-full !py-1.5 text-xs">
                      Salvar
                    </button>
                  </form>
                </details>
                <DeleteButton
                  action={deletePreferenceAction}
                  confirmMessage="Excluir esta preferência?"
                  className="btn-danger !px-3 !py-1 text-xs"
                  hiddenFields={<input type="hidden" name="id" value={item.id} />}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <form action={createPreferenceAction} className="flex flex-col gap-2 border-t border-blush-100 pt-4 dark:border-wine-700/50 sm:flex-row">
        <input type="hidden" name="category" value={category} />
        <input name="title" placeholder="Título (ex: Comida favorita)" required className="input-field sm:w-1/3" />
        <input name="value" placeholder="Valor (ex: Pizza de calabresa)" required className="input-field sm:w-1/3" />
        <input name="notes" placeholder="Observações (opcional)" className="input-field sm:w-1/3" />
        <button type="submit" className="btn-secondary whitespace-nowrap">
          + Adicionar
        </button>
      </form>
    </section>
  );
}
