import { api } from "@/lib/api/client";
import { ApiError, toApiError } from "@/lib/api/errors";
import type { ApiSuccess } from "@/lib/api/types";

import { sessionFromStore, useAuthStore } from "./store";
import type {
  AuthSession,
  LoginPayload,
  MeProfile,
  RegisterPayload,
  UpdateProfilePayload,
} from "./types";

async function postSession(
  path: string,
  body?: LoginPayload | RegisterPayload,
) {
  try {
    const { data } = await api.post<ApiSuccess<AuthSession>>(path, body);
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

let refreshRequest: Promise<AuthSession> | null = null;

export function login(input: LoginPayload) {
  return postSession("/auth/login", {
    email: input.email.trim().toLowerCase(),
    password: input.password,
  });
}

export function register(input: RegisterPayload) {
  const phone = input.phone?.trim();

  return postSession("/auth/register", {
    email: input.email.trim().toLowerCase(),
    password: input.password,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    ...(phone ? { phone } : {}),
  });
}

export function refreshSession() {
  if (!refreshRequest) {
    const epoch = useAuthStore.getState().epoch;

    refreshRequest = postSession("/auth/refresh")
      .then((session) => {
        if (useAuthStore.getState().epoch === epoch) {
          useAuthStore.getState().setSession(session);
        }

        return sessionFromStore() ?? session;
      })
      .catch((error: unknown) => {
        const apiError = toApiError(error);
        const state = useAuthStore.getState();

        if (
          state.epoch === epoch &&
          (apiError.status === 401 || !state.accessToken)
        ) {
          state.clearSession();
        }

        throw apiError;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

export async function updateProfile(input: UpdateProfilePayload) {
  const phone = input.phone?.trim();

  try {
    const { data } = await api.patch<ApiSuccess<MeProfile>>("/auth/me", {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: phone ?? "",
    });
    const profile = data.data;
    useAuthStore.getState().setUser(profile.user, profile.sessionId);
    return profile;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getMe() {
  try {
    const { data } = await api.get<ApiSuccess<MeProfile>>("/auth/me");
    const profile = data.data;
    useAuthStore.getState().setUser(profile.user, profile.sessionId);
    return profile;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    const apiError = toApiError(error);
    useAuthStore.getState().clearSession();

    if (apiError.status !== 401) throw apiError;
    return;
  }

  useAuthStore.getState().clearSession();
}

export async function restoreSession() {
  try {
    return await refreshSession();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return sessionFromStore();
    }

    throw error;
  }
}
