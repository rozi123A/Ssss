import { useGetMe } from "@workspace/api-client-react";
import { User, UserStatus, UserRole } from "@workspace/api-client-react/src/generated/api.schemas";
import { useState, useEffect } from "react";

const GUEST_KEY = "nexus_guest_user";

export function useAuth() {
  const { data: user, error, isLoading } = useGetMe({ query: { retry: false } });
  const [mockUser, setMockUser] = useState<User | null>(null);

  useEffect(() => {
    if (error && !isLoading) {
      // API call failed, possibly 401. Check for mock guest user.
      const stored = localStorage.getItem(GUEST_KEY);
      if (stored) {
        try {
          setMockUser(JSON.parse(stored) as User);
        } catch (e) {
          console.error("Failed to parse mock user", e);
        }
      }
    }
  }, [error, isLoading]);

  const loginAsGuest = () => {
    const guest: User = {
      id: Math.floor(Math.random() * 1000) + 1000,
      username: "ضيف_" + Math.floor(Math.random() * 1000),
      displayName: "المستخدم الضيف",
      status: "online" as UserStatus,
      role: "user" as UserRole,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(GUEST_KEY, JSON.stringify(guest));
    setMockUser(guest);
    return guest;
  };

  const logoutLocal = () => {
    localStorage.removeItem(GUEST_KEY);
    setMockUser(null);
  };

  return {
    user: user || mockUser,
    isLoading,
    isAuthenticated: !!user || !!mockUser,
    isGuest: !!mockUser && !user,
    loginAsGuest,
    logoutLocal
  };
}
