import Link from "next/link";

export function DashboardCard({
  href,
  title,
  description,
  emoji,
  accent,
}: {
  href: string;
  title: string;
  description: string;
  emoji: string;
  accent?: string;
}) {
  return (
    <Link
      href={href}
      className="card-surface group flex flex-col gap-3 p-5 transition hover:-translate-y-1 hover:shadow-soft"
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
          accent ?? "bg-blush-100 text-wine-700 dark:bg-wine-700/50 dark:text-blush-100"
        }`}
      >
        {emoji}
      </span>
      <div>
        <h3 className="font-display text-lg font-semibold text-wine-800 dark:text-blush-50">{title}</h3>
        <p className="mt-1 text-sm text-wine-500 dark:text-blush-200">{description}</p>
      </div>
      <span className="mt-auto text-xs font-medium text-wine-400 transition group-hover:text-wine-600 dark:text-blush-200/70">
        Abrir →
      </span>
    </Link>
  );
}
