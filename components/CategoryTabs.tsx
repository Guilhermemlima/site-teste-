import Link from "next/link";

export function CategoryTabs({
  basePath,
  categories,
  active,
  counts,
}: {
  basePath: string;
  categories: readonly string[];
  active: string | undefined;
  counts: Record<string, number>;
}) {
  const isAllActive = !active;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
          isAllActive
            ? "bg-wine-600 text-white"
            : "border border-blush-200 text-wine-600 hover:bg-blush-50 dark:border-wine-600 dark:text-blush-100"
        }`}
      >
        Todas ({counts.__all__ ?? 0})
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`${basePath}?category=${encodeURIComponent(cat)}`}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            active === cat
              ? "bg-wine-600 text-white"
              : "border border-blush-200 text-wine-600 hover:bg-blush-50 dark:border-wine-600 dark:text-blush-100"
          }`}
        >
          {cat} ({counts[cat] ?? 0})
        </Link>
      ))}
    </div>
  );
}
