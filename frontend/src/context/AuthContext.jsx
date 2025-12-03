import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { authAPI } from "../api/auth";

const AuthContext = createContext({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authAPI.getStoredUser());
  const [loading, setLoading] = useState(true);

  const clearSessionState = useCallback(() => {
    setUser(null);
  }, []);

  const refreshUser = useCallback(
    async ({ silent = false } = {}) => {
      if (!authAPI.isAuthenticated()) {
        clearSessionState();
        if (!silent) {
          setLoading(false);
        }
        return null;
      }

      if (!silent) {
        setLoading(true);
      }

      try {
        const data = await authAPI.getCurrentUser();
        setUser(data.user);
        return data.user;
      } catch (error) {
        console.error("Failed to refresh user:", error);
        clearSessionState();
        throw error;
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [clearSessionState],
  );

  useEffect(() => {
    let isMounted = true;

    const boot = async () => {
      if (!authAPI.isAuthenticated()) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        await refreshUser({ silent: false });
      } catch (error) {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    boot();

    return () => {
      isMounted = false;
    };
  }, [refreshUser]);

  const handleLogout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearSessionState();
      setLoading(false);
    }
  }, [clearSessionState]);

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshUser,
      logout: handleLogout,
      setUser,
    }),
    [user, loading, refreshUser, handleLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
