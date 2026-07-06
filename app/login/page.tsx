import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blush-50 via-white to-wine-100 px-4 dark:from-wine-900 dark:via-wine-800 dark:to-wine-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[8%] top-[15%] text-6xl text-blush-200/60 animate-floatHeart">♥</span>
        <span className="absolute right-[12%] top-[25%] text-4xl text-wine-200/50 animate-floatHeart [animation-delay:1.5s]">
          ♥
        </span>
        <span className="absolute bottom-[18%] left-[18%] text-5xl text-blush-300/40 animate-floatHeart [animation-delay:3s]">
          ♥
        </span>
        <span className="absolute bottom-[10%] right-[20%] text-3xl text-wine-300/40 animate-floatHeart [animation-delay:4.2s]">
          ♥
        </span>
      </div>

      <div className="relative z-10 w-full max-w-sm animate-fadeIn">
        <div className="card-surface p-8">
          <div className="mb-8 text-center">
            <p className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-wine-600 text-2xl text-white shadow-soft">
              ♥
            </p>
            <h1 className="font-display text-2xl font-semibold text-wine-800 dark:text-blush-50">
              Memórias Especiais
            </h1>
            <p className="mt-2 text-sm text-wine-500 dark:text-blush-200">
              Um espaço para guardar o que é importante.
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-wine-400 dark:text-blush-200/60">
          Conteúdo privado e de acesso restrito.
        </p>
      </div>
    </main>
  );
}
