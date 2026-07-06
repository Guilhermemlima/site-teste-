"use client";

import { useFormState } from "react-dom";
import { loginAction, FormState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: FormState = {};

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="password" className="label-field">
          Senha de acesso
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          placeholder="Digite a senha"
          className="input-field"
        />
      </div>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton pendingText="Entrando...">Entrar</SubmitButton>
    </form>
  );
}
