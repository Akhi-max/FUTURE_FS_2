import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try to restore session from token
  useEffect(() => {
    const token = localStorage.getItem("crm_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem("crm_token"))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user } = await api.post("/auth/login", { email, password });
    localStorage.setItem("crm_token", token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("crm_token");
    setUser(null);
  }, []);

  return { user, isLoading, login, logout };
}
