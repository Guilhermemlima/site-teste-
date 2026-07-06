"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { saveProfileAction } from "@/app/actions/profile";
import { SubmitButton } from "@/components/SubmitButton";
import type { PersonProfile } from "@/lib/types";

export function ProfileForm({ profile, photoUrl }: { profile: PersonProfile | null; photoUrl: string | null }) {
  const [state, formAction] = useFormState(saveProfileAction, {});
  const [preview, setPreview] = useState<string | null>(photoUrl);

  return (
    <form action={formAction} className="card-surface space-y-6 p-6" encType="multipart/form-data">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-blush-200 bg-blush-50 dark:border-wine-600 dark:bg-wine-800">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Foto principal" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl text-blush-300">♥</div>
          )}
        </div>
        <div className="flex-1">
          <label htmlFor="main_photo" className="label-field">
            Foto principal
          </label>
          <input
            id="main_photo"
            name="main_photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
            className="block w-full text-sm text-wine-600 file:mr-3 file:rounded-full file:border-0 file:bg-wine-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-wine-700 dark:text-blush-200"
          />
          <p className="mt-1 text-xs text-wine-400 dark:text-blush-200/60">JPEG, PNG ou WebP, até 8MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Nome completo</label>
          <input name="name" defaultValue={profile?.name ?? ""} className="input-field" placeholder="Nome dela" />
        </div>
        <div>
          <label className="label-field">Apelido</label>
          <input name="nickname" defaultValue={profile?.nickname ?? ""} className="input-field" placeholder="Como você a chama" />
        </div>
        <div>
          <label className="label-field">Data de nascimento</label>
          <input type="date" name="birth_date" defaultValue={profile?.birth_date ?? ""} className="input-field" />
        </div>
        <div>
          <label className="label-field">Cidade</label>
          <input name="city" defaultValue={profile?.city ?? ""} className="input-field" placeholder="Onde ela mora" />
        </div>
        <div>
          <label className="label-field">Início do relacionamento</label>
          <input
            type="date"
            name="relationship_start_date"
            defaultValue={profile?.relationship_start_date ?? ""}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field">Frase especial</label>
          <input
            name="special_phrase"
            defaultValue={profile?.special_phrase ?? ""}
            className="input-field"
            placeholder="Uma frase que representa vocês"
          />
        </div>
      </div>

      <div>
        <label className="label-field">Descrição</label>
        <textarea name="description" defaultValue={profile?.description ?? ""} rows={3} className="input-field" placeholder="Um pouco sobre ela" />
      </div>

      <div>
        <label className="label-field">Como nos conhecemos</label>
        <textarea name="how_we_met" defaultValue={profile?.how_we_met ?? ""} rows={3} className="input-field" />
      </div>

      <div>
        <label className="label-field">Observações importantes</label>
        <textarea name="notes" defaultValue={profile?.notes ?? ""} rows={3} className="input-field" />
      </div>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.success}</p>}

      <SubmitButton className="btn-primary">Salvar perfil</SubmitButton>
    </form>
  );
}
