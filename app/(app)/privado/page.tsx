import { redirect } from "next/navigation";
import { PrivateUnlockForm } from "@/components/PrivateUnlockForm";
import { isPrivateAreaUnlocked } from "@/lib/queries";

export default async function PrivadoGatePage() {
  const unlocked = await isPrivateAreaUnlocked();
  if (unlocked) {
    redirect("/privado/conteudo");
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card-surface p-8 text-center">
        <p className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-wine-700 text-2xl text-white">
          🔒
        </p>
        <h1 className="font-display text-2xl font-semibold text-wine-800 dark:text-blush-50">Área Privada</h1>
        <p className="mt-2 text-sm text-wine-500 dark:text-blush-200">
          Este espaço guarda fotos e lembranças mais pessoais. Digite o PIN para continuar.
        </p>

        <div className="mt-6 text-left">
          <PrivateUnlockForm />
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-wine-400 dark:text-blush-200/60">
        Esta área contém lembranças pessoais e deve ser usada apenas com consentimento de todos os envolvidos.
      </p>
    </div>
  );
}
