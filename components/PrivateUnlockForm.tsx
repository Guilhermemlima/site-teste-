"use client";

import { useFormState } from "react-dom";
import { unlockPrivateAreaAction, FormState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: FormState = {};

export function PrivateUnlockForm() {
  const [state, formAction] = useFormState(unlockPrivateAreaAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="private-password" className="label-field">
          PIN da área privada
        </label>
        <input
          id="private-password"
          name="password"
          type="password"
          autoFocus
          required
          placeholder="Digite o PIN"
          className="input-field"
        />
      </div>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton pendingText="Verificando...">Desbloquear</SubmitButton>
    </form>
  );
}
