import { PageHeader } from "@/components/PageHeader";
import { PreferenceCategorySection } from "@/components/PreferenceCategorySection";
import { listPreferences } from "@/lib/queries";
import { PREFERENCE_CATEGORIES } from "@/lib/types";

export default async function PreferenciasPage() {
  const preferences = await listPreferences();

  return (
    <div>
      <PageHeader title="Preferências" subtitle="Gostos, estilos e pequenos detalhes que fazem toda diferença." />

      <div className="space-y-6">
        {PREFERENCE_CATEGORIES.map((cat) => (
          <PreferenceCategorySection
            key={cat.value}
            category={cat.value}
            label={cat.label}
            items={preferences.filter((p) => p.category === cat.value)}
          />
        ))}
      </div>
    </div>
  );
}
