import { deleteImportantDateAction, toggleHighlightAction } from "@/app/actions/dates";
import { DeleteButton } from "@/components/DeleteButton";
import { countdownLabel, daysUntilNextOccurrence, formatDatePtBR } from "@/lib/dates";
import type { ImportantDate } from "@/lib/types";

export function ImportantDateCard({ item, imageUrl }: { item: ImportantDate; imageUrl: string | null }) {
  const days = daysUntilNextOccurrence(item.date);

  return (
    <div className="card-surface flex flex-col overflow-hidden">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={item.title} className="h-36 w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-wine-400 dark:text-blush-200/70">
              {formatDatePtBR(item.date)} {item.category ? `· ${item.category}` : ""}
            </p>
            <h3 className="font-display text-lg font-semibold text-wine-800 dark:text-blush-50">{item.title}</h3>
          </div>
          {item.is_highlighted && <span className="text-lg text-blush-400">★</span>}
        </div>

        {item.description && <p className="text-sm text-wine-600 dark:text-blush-200">{item.description}</p>}

        <p className="mt-auto text-sm font-semibold text-wine-700 dark:text-blush-100">{countdownLabel(days)}</p>

        <div className="mt-2 flex items-center gap-2">
          <form action={toggleHighlightAction}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="current" value={String(item.is_highlighted)} />
            <button type="submit" className="btn-secondary !px-3 !py-1 text-xs">
              {item.is_highlighted ? "Remover destaque" : "Destacar"}
            </button>
          </form>
          <DeleteButton
            action={deleteImportantDateAction}
            confirmMessage="Excluir esta data?"
            className="btn-danger !px-3 !py-1 text-xs"
            hiddenFields={<input type="hidden" name="id" value={item.id} />}
          />
        </div>
      </div>
    </div>
  );
}
