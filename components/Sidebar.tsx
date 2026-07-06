"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Início", icon: "home" },
  { href: "/perfil", label: "Perfil", icon: "user" },
  { href: "/preferencias", label: "Preferências", icon: "heart" },
  { href: "/datas", label: "Datas Importantes", icon: "calendar" },
  { href: "/galeria", label: "Galeria", icon: "image" },
  { href: "/memorias", label: "Lembranças", icon: "book" },
  { href: "/presentes", label: "Presentes", icon: "gift" },
  { href: "/privado", label: "Privado", icon: "lock" },
  { href: "/configuracoes", label: "Configurações", icon: "settings" },
] as const;

function Icon({ name }: { name: string }) {
  const common = { viewBox: "0 0 24 24", fill: "none", className: "h-5 w-5" } as const;
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M4 11.5 12 4l8 7.5M6 10v9h12v-9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path
            d="M12 20s-7-4.4-9.3-8.8C1.2 8 2.7 4.8 6 4.2c2-.4 3.7.6 6 2.9 2.3-2.3 4-3.3 6-2.9 3.3.6 4.8 3.8 3.3 7-2.3 4.4-9.3 8.8-9.3 8.8Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="4" y="5.5" width="16" height="15" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.5" />
          <path d="m6 17 4.5-4.5L13 15l3-3.5 2 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path
            d="M5 5.2c2.2-1 4.7-1 7 0v14c-2.3-1-4.8-1-7 0V5.2ZM19 5.2c-2.2-1-4.7-1-7 0v14c2.3-1 4.8-1 7 0V5.2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "gift":
      return (
        <svg {...common}>
          <rect x="4" y="9.5" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 13h16M12 9.5V20" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 9.5C10.5 6 6 6.5 6 9c0 .5.3.5 1 .5h5ZM12 9.5C13.5 6 18 6.5 18 9c0 .5-.3.5-1 .5h-5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4M17.7 17.7l-1.4-1.4M7.7 7.7 6.3 6.3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-blush-100/70 bg-white/70 px-4 py-3 backdrop-blur-sm dark:border-wine-700/50 dark:bg-wine-800/70 md:hidden">
        <Link href="/dashboard" className="font-display text-lg font-semibold text-wine-700 dark:text-blush-50">
          ♥ Nossos Momentos
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="rounded-lg p-2 text-wine-600 hover:bg-blush-50 dark:text-blush-100"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setOpen(false)} aria-hidden />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-blush-100/70 bg-white/95 p-5 shadow-soft transition-transform duration-300 dark:border-wine-700/50 dark:bg-wine-900/95 md:static md:z-auto md:flex md:w-64 md:translate-x-0 md:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard" className="font-display text-xl font-semibold text-wine-700 dark:text-blush-50">
            ♥ Nossos Momentos
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="rounded-lg p-1 text-wine-500 hover:bg-blush-50 md:hidden dark:text-blush-100"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-wine-600 text-white shadow-soft"
                    : "text-wine-600 hover:bg-blush-50 dark:text-blush-100 dark:hover:bg-wine-800/60"
                }`}
              >
                <Icon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 flex items-center justify-between gap-2 border-t border-blush-100/70 pt-4 dark:border-wine-700/50">
          <ThemeToggle />
          <LogoutButton className="btn-secondary flex-1 text-center" />
        </div>
      </aside>
    </>
  );
}
