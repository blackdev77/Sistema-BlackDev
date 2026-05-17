'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciais inválidas.';
        case 'CallbackRouteError':
          if (error.cause?.err?.message === 'DEVICE_UNTRUSTED') {
            return 'Dispositivo não reconhecido. Uma solicitação de acesso foi gerada para aprovação do outro sócio.';
          }
          if (error.cause?.err?.message === 'DEVICE_PENDING') {
            return 'Este dispositivo ainda aguarda aprovação de um administrador.';
          }
          if (error.cause?.err?.message === 'DEVICE_REVOKED') {
            return 'O acesso deste dispositivo foi revogado permanentemente.';
          }
          return 'Algo deu errado na autenticação.';
        default:
          return 'Erro interno no servidor de autenticação.';
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut();
}
