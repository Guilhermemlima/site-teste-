import { PageHeader } from "@/components/PageHeader";
import { ProfileForm } from "@/components/ProfileForm";
import { formatDatePtBR } from "@/lib/dates";
import { getSignedUrl } from "@/lib/storage";
import { getProfile } from "@/lib/queries";
import { getZodiacSign } from "@/lib/zodiac";

export default async function PerfilPage() {
  const profile = await getProfile();
  const photoUrl = await getSignedUrl(profile?.main_photo_url);
  const sign = getZodiacSign(profile?.birth_date);

  return (
    <div>
      <PageHeader
        title="Perfil"
        subtitle="Tudo sobre a pessoa mais especial: nome, aniversário, cidade e mais."
      />

      {profile?.birth_date && (
        <div className="mb-6 flex flex-wrap gap-3 text-sm">
          {sign && (
            <span className="rounded-full bg-blush-100 px-3 py-1 font-medium text-wine-700 dark:bg-wine-700/50 dark:text-blush-100">
              ♒ Signo: {sign}
            </span>
          )}
          <span className="rounded-full bg-blush-100 px-3 py-1 font-medium text-wine-700 dark:bg-wine-700/50 dark:text-blush-100">
            🎂 {formatDatePtBR(profile.birth_date)}
          </span>
          {profile.relationship_start_date && (
            <span className="rounded-full bg-blush-100 px-3 py-1 font-medium text-wine-700 dark:bg-wine-700/50 dark:text-blush-100">
              💍 Juntos desde {formatDatePtBR(profile.relationship_start_date)}
            </span>
          )}
        </div>
      )}

      <ProfileForm profile={profile} photoUrl={photoUrl} />
    </div>
  );
}
