import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSession, logout, onAuthStateChange } from "@/lib/auth-security";

type StoreValue = {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  user: { name: string; email: string; mobile: string } | null;
  authReady: boolean;
  refreshAuth: () => void;
  signOut: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<StoreValue["user"]>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    void getSession().then((session) => {
      if (mounted) {
        setUser(session);
        setAuthReady(true);
      }
    });
    const unsubscribe = onAuthStateChange((session) => {
      setUser(session);
      setAuthReady(true);
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const refreshAuth = useCallback(() => {
    void getSession().then(setUser);
  }, []);

  const toggleWishlist = useCallback(
    (id: string) => {
      if (!user) return;
      setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    },
    [user],
  );

  const signOut = useCallback(() => {
    void logout().finally(() => setUser(null));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({ wishlist, toggleWishlist, user, authReady, refreshAuth, signOut }),
    [wishlist, toggleWishlist, user, authReady, refreshAuth, signOut],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

const FALLBACK_STORE: StoreValue = {
  wishlist: [],
  toggleWishlist: () => {},
  user: null,
  authReady: true,
  refreshAuth: () => {},
  signOut: () => {},
};

export function useStore() {
  return useContext(StoreContext) ?? FALLBACK_STORE;
}

export const PHONE = "+918341930200";
export const PHONE_DISPLAY = "+91 83419 30200";
export const EMAIL = "kalyanigheesweet@gmail.com";
export const INSTAGRAM_URL = "https://www.instagram.com/kalyanisweetkalyanisweet";
export const STORE_ADDRESS =
  "National Highway 163, 5-7-62, Kishanpura, Hanamkonda, Telangana 506001";
export const STORE_MAP_URL = "https://share.google/VQb92HIMgUUII8o32";

export const priceFor = (base: number, weight: string) => {
  if (/packet|box|\bpc\b|piece/i.test(weight) || weight === "100 g" || weight === "150 g") {
    return base;
  }
  const grams = weight.includes("kg") ? parseFloat(weight) * 1000 : parseFloat(weight);
  return Math.round(base * (grams / 1000 || 1));
};
