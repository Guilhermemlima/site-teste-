import { deleteMemoryAction, updateMemoryAction } from "@/app/actions/memories";
import { DeleteButton } from "@/components/DeleteButton";
import { formatDatePtBR } from "@/lib/dates";
import { MEMORY_CATEGORIES, MEMORY_EMOTIONS, type Memory } from "@/lib/types";

const EMOTION_EMOJI: Record<string, string> = {
  Feliz: "😊",
  Engraçada: "😄",
  Romântica: "💞",
  Especial: "✨",
  Saudade: "🥹",
};

export function MemoryCard({ memory, imageUrls }: { memory: Memory; imageUrls: string[] }) {
  return (
    <article className="card-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-wine-400 dark:text-blush-200/70">
            {memory.date ? formatDatePtBR(memory.date) : ""} {memory.category ? `· ${memory.category}` : ""}
          </p>
          <h3 className="font-display text-lg font-semibold text-wine-800 dark:text-blush-50">{memory.title}</h3>
        </div>
        {memory.emotion && (
          <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-medium text-wine-700 dark:bg-wine-700/50 dark:text-blush-100">
            {EMOTION_EMOJI[memory.emotion] ?? ""} {memory.emotion}
          </span>
        )}
      </div>

      <p className="mt-3 whitespace-pre-line text-sm text-wine-700 dark:text-blush-100">{memory.content}</p>

      {imageUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {imageUrls.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={url} alt="" className="aspect-square w-full rounded-lg object-cover" />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 border-t border-blush-100 pt-3 dark:border-wine-700/50">
        <details className="relative">
          <summary className="cursor-pointer list-none rounded-full border border-wine-200 px-3 py-1 text-xs font-medium text-wine-600 hover:bg-blush-50 dark:border-wine-600 dark:text-blush-100">
            Editar
          </summary>
          <form
            action={updateMemoryAction}
            className="absolute left-0 z-10 mt-2 w-80 space-y-2 rounded-xl border border-blush-100 bg-white p-3 shadow-soft dark:border-wine-600 dark:bg-wine-800"
          >
            <input type="hidden" name="id" value={memory.id} />
            <input name="title" defaultValue={memory.title} required className="input-field" placeholder="Título" />
            <textarea name="content" defaultValue={memory.content} required rows={3} className="input-field" />
            <div className="grid grid-cols-2 gap-2">
              <input type="date" name="date" defaultValue={memory.date ?? ""} className="input-field" />
              <select name="emotion" defaultValue={memory.emotion ?? ""} className="input-field">
                <option value="">Emoção</option>
                {MEMORY_EMOTIONS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <select name="category" defaultValue={memory.category ?? ""} className="input-field">
              <option value="">Categoria</option>
              {MEMORY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-xs text-wine-600 dark:text-blush-200">
              <input type="checkbox" name="is_private" defaultChecked={memory.is_private} className="h-4 w-4 rounded border-blush-300" />
              Privada
            </label>
            <button type="submit" className="btn-primary w-full !py-1.5 text-xs">
              Salvar alterações
            </button>
          </form>
        </details>
        <DeleteButton
          action={deleteMemoryAction}
          confirmMessage="Excluir esta memória?"
          className="btn-danger !px-3 !py-1 text-xs"
          hiddenFields={<input type="hidden" name="id" value={memory.id} />}
        />
        {memory.is_private && (
          <span className="ml-auto rounded-full bg-wine-800 px-2 py-0.5 text-[10px] font-medium text-blush-50">privada</span>
        )}
      </div>
    </article>
  );
}
