export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-wine-800 dark:text-blush-50 sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-wine-500 dark:text-blush-200">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
