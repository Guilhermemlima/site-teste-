"use client";

import { logoutAction } from "@/app/actions/auth";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <form
      action={logoutAction}
      onSubmit={(e) => {
        if (!confirm("Sair do sistema?")) e.preventDefault();
      }}
    >
      <button type="submit" className={className ?? "btn-secondary"}>
        Sair
      </button>
    </form>
  );
}
