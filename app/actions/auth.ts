"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  MAIN_SESSION_MAX_AGE,
  PRIVATE_COOKIE,
  PRIVATE_SESSION_MAX_AGE,
  SESSION_COOKIE,
  signSessionToken,
} from "@/lib/session";
import { getAppSettings, updateMainPasswordHash, updatePrivatePasswordHash } from "@/lib/settings";

export interface FormState {
  error?: string;
  success?: string;
}

const isProd = process.env.NODE_ENV === "production";

export async function loginAction(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") || "");

  let settings;
  try {
    settings = await getAppSettings();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro de configuracao do sistema." };
  }

  const ok = await verifyPassword(password, settings.password_hash);
  if (!ok) {
    return { error: "Senha incorreta. Tente novamente." };
  }

  const token = await signSessionToken("main", MAIN_SESSION_MAX_AGE);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: MAIN_SESSION_MAX_AGE,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  cookies().delete(SESSION_COOKIE);
  cookies().delete(PRIVATE_COOKIE);
  redirect("/login");
}

export async function unlockPrivateAreaAction(
  _prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const password = String(formData.get("password") || "");

  let settings;
  try {
    settings = await getAppSettings();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro de configuracao do sistema." };
  }

  const ok = await verifyPassword(password, settings.private_area_password_hash);
  if (!ok) {
    return { error: "PIN incorreto." };
  }

  const token = await signSessionToken("private", PRIVATE_SESSION_MAX_AGE);
  cookies().set(PRIVATE_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: PRIVATE_SESSION_MAX_AGE,
  });

  redirect("/privado/conteudo");
}

export async function lockPrivateAreaAction() {
  cookies().delete(PRIVATE_COOKIE);
  redirect("/privado");
}

export async function changeMainPasswordAction(
  _prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (newPassword.length < 6) {
    return { error: "A nova senha deve ter pelo menos 6 caracteres." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "A confirmacao nao confere com a nova senha." };
  }

  const settings = await getAppSettings();
  const ok = await verifyPassword(currentPassword, settings.password_hash);
  if (!ok) {
    return { error: "Senha atual incorreta." };
  }

  const newHash = await hashPassword(newPassword);
  await updateMainPasswordHash(newHash);

  return { success: "Senha principal atualizada com sucesso." };
}

export async function changePrivatePasswordAction(
  _prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const currentPin = String(formData.get("currentPin") || "");
  const newPin = String(formData.get("newPin") || "");
  const confirmPin = String(formData.get("confirmPin") || "");

  if (newPin.length < 4) {
    return { error: "O novo PIN deve ter pelo menos 4 caracteres." };
  }
  if (newPin !== confirmPin) {
    return { error: "A confirmacao nao confere com o novo PIN." };
  }

  const settings = await getAppSettings();
  const ok = await verifyPassword(currentPin, settings.private_area_password_hash);
  if (!ok) {
    return { error: "PIN atual incorreto." };
  }

  const newHash = await hashPassword(newPin);
  await updatePrivatePasswordHash(newHash);

  return { success: "PIN da area privada atualizado com sucesso." };
}
