import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Order, User } from "../types";

interface AuthContextValue {
  user: User | null;
  users: User[];
  orders: Order[];
  login: (email: string, password: string) => { ok: boolean; message: string };
  register: (name: string, email: string, password: string) => { ok: boolean; message: string };
  logout: () => void;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>("aurum:user", null);
  const [users, setUsers] = useLocalStorage<User[]>("aurum:users", []);
  const [orders, setOrders] = useLocalStorage<Order[]>("aurum:orders", []);

  const login = useCallback(
    (email: string, password: string) => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      );
      if (!found) return { ok: false, message: "Invalid email or password." };
      setUser(found);
      return { ok: true, message: `Welcome back, ${found.name.split(" ")[0]}.` };
    },
    [users, setUser],
  );

  const register = useCallback(
    (name: string, email: string, password: string) => {
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, message: "An account with that email already exists." };
      }
      const newUser: User = {
        id: `u_${Math.random().toString(36).slice(2, 10)}`,
        email,
        name,
        password,
      };
      setUsers((prev) => [...prev, newUser]);
      setUser(newUser);
      return { ok: true, message: `Welcome to AURUM, ${name.split(" ")[0]}.` };
    },
    [users, setUsers, setUser],
  );

  const logout = useCallback(() => setUser(null), [setUser]);

  const addOrder = useCallback(
    (order: Order) => {
      setOrders((prev) => [order, ...prev]);
    },
    [setOrders],
  );

  return (
    <AuthContext.Provider value={{ user, users, orders, login, register, logout, addOrder }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
