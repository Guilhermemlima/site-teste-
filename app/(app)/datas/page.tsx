import { ImportantDateCard } from "@/components/ImportantDateCard";
import { ImportantDateForm } from "@/components/ImportantDateForm";
import { PageHeader } from "@/components/PageHeader";
import { daysUntilNextOccurrence } from "@/lib/dates";
import { listImportantDates } from "@/lib/queries";
import { getSignedUrls } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function DatasPage() {
  const dates = await listImportantDates();
  const sorted = [...dates].sort((a, b) => daysUntilNextOccurrence(a.date) - daysUntilNextOccurrence(b.date));
  const urlMap = await getSignedUrls(dates.map((d) => d.image_url));

  return (
    <div>
      <PageHeader title="Datas Importantes" subtitle="Aniversários, datas de namoro e contagens regressivas." />

      <div className="mb-8">
        <ImportantDateForm />
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-wine-400 dark:text-blush-200/60">Nenhuma data cadastrada ainda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((item) => (
            <ImportantDateCard key={item.id} item={item} imageUrl={item.image_url ? urlMap[item.image_url] ?? null : null} />
          ))}
        </div>
      )}
    </div>
  );
}
