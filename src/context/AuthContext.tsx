"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// 📌 Tipos
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "vendedor" | "usuario";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Inicia sesión con Supabase Auth (email/password). */
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  /** @deprecated Compatibilidad: ya no se usa el token de Express. */
  login: (token: string, user: User) => void;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 📌 API Base URL (legacy Express — solo módulos aún no migrados)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";

// Mapea un usuario de Supabase al tipo interno.
const toUser = (u: any): User | null => {
  if (!u) return null;
  const role = (u.user_metadata?.role ?? u.app_metadata?.role ?? "admin") as User["role"];
  return {
    id: u.id,
    email: u.email ?? "",
    name: u.user_metadata?.name ?? u.email?.split("@")[0] ?? "Usuario",
    role,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(toUser(session?.user));
      setToken(session?.access_token ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session?.user));
      setToken(session?.access_token ?? null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return {};
    },
    [supabase]
  );

  // Compatibilidad con el flujo viejo (no hace nada útil con Supabase).
  const login = (_token: string, _user: User) => {};

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
    router.push("/");
  }, [supabase, router]);

  const getAuthHeaders = useCallback(
    (): Record<string, string> => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        login,
        logout,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
