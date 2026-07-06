const SIGNS: { name: string; start: [number, number]; end: [number, number] }[] = [
  { name: "Aquário", start: [1, 20], end: [2, 18] },
  { name: "Peixes", start: [2, 19], end: [3, 20] },
  { name: "Áries", start: [3, 21], end: [4, 19] },
  { name: "Touro", start: [4, 20], end: [5, 20] },
  { name: "Gêmeos", start: [5, 21], end: [6, 20] },
  { name: "Câncer", start: [6, 21], end: [7, 22] },
  { name: "Leão", start: [7, 23], end: [8, 22] },
  { name: "Virgem", start: [8, 23], end: [9, 22] },
  { name: "Libra", start: [9, 23], end: [10, 22] },
  { name: "Escorpião", start: [10, 23], end: [11, 21] },
  { name: "Sagitário", start: [11, 22], end: [12, 21] },
  { name: "Capricórnio", start: [12, 22], end: [1, 19] },
];

export function getZodiacSign(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T00:00:00`);
  const month = d.getMonth() + 1;
  const day = d.getDate();

  return (
    SIGNS.find(({ start, end }) => {
      const afterStart = month === start[0] ? day >= start[1] : month > start[0];
      const beforeEnd = month === end[0] ? day <= end[1] : month < end[0];
      if (start[0] > end[0]) {
        // vira o ano (Capricornio)
        return month === start[0] ? day >= start[1] : month === end[0] ? day <= end[1] : month > start[0] || month < end[0];
      }
      return afterStart && beforeEnd;
    })?.name ?? null
  );
}
