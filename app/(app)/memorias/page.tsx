import { CategoryTabs } from "@/components/CategoryTabs";
import { MemoryCard } from "@/components/MemoryCard";
import { MemoryForm } from "@/components/MemoryForm";
import { PageHeader } from "@/components/PageHeader";
import { listMemories } from "@/lib/queries";
import { getSignedUrls } from "@/lib/storage";
import { MEMORY_CATEGORIES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MemoriasPage({ searchParams }: { searchParams: { category?: string } }) {
  const memories = await listMemories({ includePrivate: false });
  const allPaths = memories.flatMap((m) => m.image_paths || []);
  const urlMap = await getSignedUrls(allPaths);

  const counts: Record<string, number> = { __all__: memories.length };
  for (const cat of MEMORY_CATEGORIES) {
    counts[cat] = memories.filter((m) => m.category === cat).length;
  }

  const filtered = searchParams.category ? memories.filter((m) => m.category === searchParams.category) : memories;

  return (
    <div>
      <PageHeader title="Nossas Memórias" subtitle="Histórias e momentos que a gente quer guardar para sempre." />

      <div className="mb-8">
        <MemoryForm />
      </div>

      <CategoryTabs basePath="/memorias" categories={MEMORY_CATEGORIES} active={searchParams.category} counts={counts} />

      {filtered.length === 0 ? (
        <p className="text-sm text-wine-400 dark:text-blush-200/60">Nenhuma memória por aqui ainda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((m) => (
            <MemoryCard
              key={m.id}
              memory={m}
              imageUrls={(m.image_paths || []).map((p) => urlMap[p]).filter((u): u is string => Boolean(u))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
