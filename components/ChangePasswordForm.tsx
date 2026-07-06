"use client";

import { useFormState } from "react-dom";
import { changeMainPasswordAction, changePrivatePasswordAction, FormState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

const initialState: FormState = {};

export function ChangeMainPasswordForm() {
  const [state, formAction] = useFormState(changeMainPasswordAction, initialState);

  return (
    <form action={formAction} className="card-surface space-y-4 p-6">
      <h2 className="font-display text-lg font-semibold text-wine-800 dark:text-blush-50">Senha principal</h2>
      <div>
        <label className="label-field">Senha atual</label>
        <input type="password" name="currentPassword" required className="input-field" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Nova senha</label>
          <input type="password" name="newPassword" required minLength={6} className="input-field" />
        </div>
        <div>
          <label className="label-field">Confirmar nova senha</label>
          <input type="password" name="confirmPassword" required minLength={6} className="input-field" />
        </div>
      </div>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.success}</p>}

      <SubmitButton className="btn-primary">Atualizar senha</SubmitButton>
    </form>
  );
}

export function ChangePrivatePinForm() {
  const [state, formAction] = useFormState(changePrivatePasswordAction, initialState);

  return (
    <form action={formAction} className="card-surface space-y-4 p-6">
      <h2 className="font-display text-lg font-semibold text-wine-800 dark:text-blush-50">PIN da área privada</h2>
      <div>
        <label className="label-field">PIN atual</label>
        <input type="password" name="currentPin" required className="input-field" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Novo PIN</label>
          <input type="password" name="newPin" required minLength={4} className="input-field" />
        </div>
        <div>
          <label className="label-field">Confirmar novo PIN</label>
          <input type="password" name="confirmPin" required minLength={4} className="input-field" />
        </div>
      </div>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.success}</p>}

      <SubmitButton className="btn-primary">Atualizar PIN</SubmitButton>
    </form>
  );
}
