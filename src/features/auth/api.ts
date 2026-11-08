import { api } from "@/lib/api/client";
import { ApiError, toApiError } from "@/lib/api/errors";
import type { ApiSuccess } from "@/lib/api/types";

import { hydrateAuthFromHash } from "./lib/oauth-hash";
import { safeNextPath } from "./lib/next-path";
import { sessionFromStore, useAuthStore } from "./store";
import type {
  AuthSession,
  AuthUser,
  LoginPayload,
  MeProfile,
  RegisterPayload,
  UpdateProfilePayload,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

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

        // Rate limit is temporary; keep the in-memory session and let the user retry.
        if (apiError.status === 429) {
          const current = sessionFromStore();
          if (current) {
            return current;
          }
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
    const { data } = await api.patch<ApiSuccess<AuthUser>>("/users/me", {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: phone ?? "",
    });
    const user = data.data;
    const sessionId = useAuthStore.getState().sessionId ?? "";
    useAuthStore.getState().setUser(user, sessionId);
    return { user, sessionId };
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

async function sessionFromOAuthHash() {
  if (!hydrateAuthFromHash()) {
    return null;
  }

  try {
    const profile = await getMe();
    const { accessToken, expiresAt } = useAuthStore.getState();

    if (!accessToken || !expiresAt) {
      return null;
    }

    const session: AuthSession = {
      user: profile.user,
      sessionId: profile.sessionId,
      accessToken,
      tokenType: "Bearer",
      expiresIn: Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)),
    };

    useAuthStore.getState().setSession(session);
    return session;
  } catch {
    useAuthStore.getState().clearSession();
    return null;
  }
}

export async function restoreSession() {
  const oauthSession = await sessionFromOAuthHash();

  if (oauthSession) {
    return oauthSession;
  }

  try {
    return await refreshSession();
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 429)
    ) {
      return sessionFromStore();
    }

    throw error;
  }
}

export function getGoogleAuthUrl(callbackUrl?: string) {
  const url = new URL(`${API_BASE_URL}/auth/google`);
  const next = safeNextPath(callbackUrl);

  if (next !== "/") {
    url.searchParams.set("callbackUrl", next);
  }

  return url.toString();
}
