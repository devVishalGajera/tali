"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { logoutApi, getProfileApi, getDisplayName } from "@/lib/api/auth";
import type { AuthUser } from "@/lib/api/auth";

export { getDisplayName };

/* ── Types ──────────────────────────────────────────────────── */

interface AuthContextType {
  user:            AuthUser | null;
  token:           string | null;
  isAuthenticated: boolean;
  profileLoading:  boolean;
  setAuth:         (token: string, user: AuthUser) => void;
  refreshProfile:  () => Promise<void>;
  updateUser:      (nextUser: AuthUser) => void;
  logout:          () => void;
}

/* ── Context ─────────────────────────────────────────────────── */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

/* ── Storage helpers ─────────────────────────────────────────── */

const TOKEN_KEY = "talli_auth_token";
const USER_KEY  = "talli_auth_user";

function loadAuth(): { token: string; user: AuthUser } | null {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw   = localStorage.getItem(USER_KEY);
    if (!token || !raw) return null;
    return { token, user: JSON.parse(raw) as AuthUser };
  } catch {
    return null;
  }
}

function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  /* Sync to cookie so server components can read it if needed */
  const opts = "; path=/; max-age=2592000; SameSite=Lax";
  document.cookie = `talli_auth_token=${encodeURIComponent(token)}${opts}`;
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "talli_auth_token=; path=/; max-age=0";
}

/* ── Provider ────────────────────────────────────────────────── */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    const activeToken = token ?? loadAuth()?.token;
    if (!activeToken) return;

    setProfileLoading(true);
    try {
      const res = await getProfileApi(activeToken);
      if (res.code === 1 && res.data) {
        saveAuth(activeToken, res.data);
        setToken(activeToken);
        setUser(res.data);
      }
    } catch {
      /* keep cached user on network errors */
    } finally {
      setProfileLoading(false);
    }
  }, [token]);

  /* Restore persisted auth on mount, then refresh from API */
  useEffect(() => {
    const saved = loadAuth();
    if (!saved) return;
    setToken(saved.token);
    setUser(saved.user);
    getProfileApi(saved.token)
      .then((res) => {
        if (res.code === 1 && res.data) {
          saveAuth(saved.token, res.data);
          setUser(res.data);
        }
      })
      .catch(() => { /* keep cached user */ });
  }, []);

  const setAuth = useCallback((newToken: string, newUser: AuthUser) => {
    saveAuth(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
    getProfileApi(newToken)
      .then((res) => {
        if (res.code === 1 && res.data) {
          saveAuth(newToken, res.data);
          setUser(res.data);
        }
      })
      .catch(() => { /* login data is enough */ });
  }, []);

  const logout = useCallback(() => {
    if (token) logoutApi(token);
    clearAuth();
    setToken(null);
    setUser(null);
  }, [token]);

  const updateUser = useCallback((nextUser: AuthUser) => {
    const activeToken = token ?? loadAuth()?.token;
    if (!activeToken) return;
    saveAuth(activeToken, nextUser);
    setToken(activeToken);
    setUser(nextUser);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        profileLoading,
        setAuth,
        refreshProfile,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
