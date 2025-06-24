// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/UserType";
import {
  getUser,
  getFromStorage,
  removeFromStorage,
  saveUser,
} from "../utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const setUserAndPersist = async (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      await saveUser(newUser);
    } else {
      await removeFromStorage("user");
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const users = await getUser();
      const token = await getFromStorage("token");
      if (users) setUser(users);
      if (token) setToken(token);
      setLoading(false);
    };
    loadUser();
  }, []);

  const logout = async () => {
    try {
      // await removeFromStorage("token");
      // await removeFromStorage("user");
      // await removeFromStorage("aulas");
      await AsyncStorage.clear();
    } catch (error) {
      console.log("error al borrar items", error);
    }

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: setUserAndPersist,
        loading,
        token,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
