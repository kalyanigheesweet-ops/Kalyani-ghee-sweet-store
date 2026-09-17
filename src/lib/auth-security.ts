const REMEMBERED_IDENTIFIER_KEY = "kalyani.auth.remembered-identifier";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const firebaseAuthModule =
  typeof window !== "undefined" && firebaseConfigured
    ? await import("firebase/auth")
    : null;
const firebaseAppModule =
  typeof window !== "undefined" && firebaseConfigured
    ? await import("firebase/app")
    : null;

const auth =
  firebaseConfigured && typeof window !== "undefined" && firebaseAuthModule && firebaseAppModule
    ? firebaseAuthModule.getAuth(firebaseAppModule.initializeApp(firebaseConfig))
    : null;

function requireAuth() {
  if (!auth)
    throw new Error("Authentication is not configured. Add the Firebase environment variables.");
  return auth;
}

function mapUser(user: { email?: string | null; displayName?: string | null; phoneNumber?: string | null } | null) {
  if (!user?.email) return null;
  return {
    name: user.displayName ?? user.email,
    email: user.email,
    mobile: user.phoneNumber ?? "",
  };
}

export function validatePassword(password: string) {
  if (password.length < 12) return "Use at least 12 characters.";
  if (password.length > 128) return "Use 128 characters or fewer.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password))
    return "Use uppercase and lowercase letters.";
  if (!/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password))
    return "Use a number and a special character.";
  return "";
}

export async function createAccount(account: {
  name: string;
  email: string;
  mobile: string;
  password: string;
}) {
  const currentAuth = requireAuth();
  if (!firebaseAuthModule) throw new Error("Authentication is not configured.");
  await firebaseAuthModule.setPersistence(currentAuth, firebaseAuthModule.browserLocalPersistence);
  const result = await firebaseAuthModule.createUserWithEmailAndPassword(
    currentAuth,
    account.email.trim().toLowerCase(),
    account.password,
  );
  await firebaseAuthModule.updateProfile(result.user, { displayName: account.name.trim() });
  setRememberedIdentifier(account.email);
  return mapUser(result.user);
}

export function setRememberedIdentifier(identifier: string) {
  if (typeof window === "undefined") return;
  const value = identifier.trim();
  if (value) window.localStorage.setItem(REMEMBERED_IDENTIFIER_KEY, value);
  else window.localStorage.removeItem(REMEMBERED_IDENTIFIER_KEY);
}

export function getRememberedIdentifier() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(REMEMBERED_IDENTIFIER_KEY) ?? "";
}

export async function login(identifier: string, password: string) {
  if (!identifier.includes("@"))
    throw new Error("Use the email address linked to your account to sign in.");
  const currentAuth = requireAuth();
  if (!firebaseAuthModule) throw new Error("Authentication is not configured.");
  await firebaseAuthModule.setPersistence(currentAuth, firebaseAuthModule.browserLocalPersistence);
  const result = await firebaseAuthModule.signInWithEmailAndPassword(
    currentAuth,
    identifier.trim().toLowerCase(),
    password,
  );
  setRememberedIdentifier(identifier);
  return mapUser(result.user);
}

export async function signInWithGoogle() {
  const currentAuth = requireAuth();
  if (!firebaseAuthModule) throw new Error("Authentication is not configured.");
  await firebaseAuthModule.setPersistence(currentAuth, firebaseAuthModule.browserLocalPersistence);
  const result = await firebaseAuthModule.signInWithPopup(
    currentAuth,
    new firebaseAuthModule.GoogleAuthProvider(),
  );
  return mapUser(result.user);
}

export async function getSession() {
  if (!auth) return null;
  return mapUser(auth.currentUser);
}

export function onAuthStateChange(callback: (user: ReturnType<typeof mapUser>) => void) {
  if (!auth || !firebaseAuthModule) return () => {};
  return firebaseAuthModule.onAuthStateChanged(auth, (user) => callback(mapUser(user)));
}

export async function logout() {
  if (auth && firebaseAuthModule) await firebaseAuthModule.signOut(auth);
}
