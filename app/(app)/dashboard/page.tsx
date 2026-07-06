import { DashboardCard } from "@/components/DashboardCard";
import { countdownLabel, daysUntilNextOccurrence, formatDatePtBR } from "@/lib/dates";
import { getProfile, listImportantDates } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [profile, dates] = await Promise.all([getProfile(), listImportantDates()]);

  const upcoming = dates
    .map((d) => ({ ...d, days: daysUntilNextOccurrence(d.date) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);

  const displayName = profile?.nickname || profile?.name;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-wine-400 dark:text-blush-200/70">
          Bem-vindo de volta
        </p>
        <h1 className="font-display text-3xl font-semibold text-wine-800 dark:text-blush-50 sm:text-4xl">
          {displayName ? `Tudo sobre ${displayName} ♥` : "Memórias Especiais ♥"}
        </h1>
        {profile?.special_phrase && (
          <p className="mt-2 max-w-xl text-sm italic text-wine-500 dark:text-blush-200">
            “{profile.special_phrase}”
          </p>
        )}
      </div>

      {upcoming.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-wine-500 dark:text-blush-200">
            Próximas datas
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {upcoming.map((d) => (
              <div key={d.id} className="card-surface p-4">
                <p className="text-xs font-medium text-wine-400 dark:text-blush-200/70">
                  {formatDatePtBR(d.date)} {d.category ? `· ${d.category}` : ""}
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-wine-800 dark:text-blush-50">
                  {d.title}
                </p>
                <p className="mt-1 text-sm font-medium text-wine-600 dark:text-blush-200">
                  {countdownLabel(d.days)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-wine-500 dark:text-blush-200">
        Explorar
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          href="/perfil"
          emoji="👤"
          title="Perfil"
          description="Nome, apelido, aniversário e informações pessoais."
        />
        <DashboardCard
          href="/preferencias"
          emoji="💗"
          title="Preferências"
          description="Comidas, presentes, entretenimento e lugares favoritos."
        />
        <DashboardCard
          href="/datas"
          emoji="📅"
          title="Datas Importantes"
          description="Aniversários, datas especiais e contagens regressivas."
        />
        <DashboardCard
          href="/galeria"
          emoji="🖼️"
          title="Galeria de Fotos"
          description="Fotos e momentos especiais guardados."
        />
        <DashboardCard
          href="/memorias"
          emoji="📖"
          title="Lembranças Especiais"
          description="Histórias e momentos que você quer guardar."
        />
        <DashboardCard
          href="/presentes"
          emoji="🎁"
          title="Ideias de Presentes"
          description="Ideias de presentes com prioridades e status."
        />
        <DashboardCard
          href="/privado"
          emoji="🔒"
          title="Área Privada"
          description="Conteúdo pessoal protegido por PIN extra."
          accent="bg-wine-700 text-blush-50"
        />
        <DashboardCard
          href="/configuracoes"
          emoji="⚙️"
          title="Configurações"
          description="Alterar senha de acesso e PIN da área privada."
        />
      </div>
    </div>
  );
}
