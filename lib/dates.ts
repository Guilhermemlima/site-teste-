export function getNextOccurrence(dateStr: string): Date {
  const original = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const next = new Date(now.getFullYear(), original.getMonth(), original.getDate());
  if (next < now) {
    next.setFullYear(now.getFullYear() + 1);
  }
  return next;
}

export function daysUntilNextOccurrence(dateStr: string): number {
  const next = getNextOccurrence(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDatePtBR(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export function countdownLabel(days: number): string {
  if (days === 0) return "É hoje! 🎉";
  if (days === 1) return "Falta 1 dia";
  return `Faltam ${days} dias`;
}
