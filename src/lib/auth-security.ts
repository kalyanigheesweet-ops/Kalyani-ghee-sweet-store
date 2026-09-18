const REMEMBERED_IDENTIFIER_KEY = "kalyani.auth.remembered-identifier";
const OWNER_EMAILS = new Set(
  [import.meta.env["VITE_OWNER_EMAIL"], "kalyanigheesweet@gmail.com", "kalyanisweets@gmail.com"]
    .filter(Boolean)
    .map((email) => email!.trim().toLowerCase()),
);

const defaultFirebaseConfig = {
  apiKey: "AIzaSyDdl1Er8Qib8iLXVcIKmjXFlELYPWy-9_0",
  authDomain: "kalyani-ghee-sweets-hnk.firebaseapp.com",
  projectId: "kalyani-ghee-sweets-hnk",
  storageBucket: "kalyani-ghee-sweets-hnk.firebasestorage.app",
  messagingSenderId: "279505137310",
  appId: "1:279505137310:web:0d8b71027fd310174c958f",
};

const firebaseConfig = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"] || defaultFirebaseConfig.apiKey,
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] || defaultFirebaseConfig.authDomain,
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"] || defaultFirebaseConfig.projectId,
  storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] || defaultFirebaseConfig.storageBucket,
  messagingSenderId:
    import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] || defaultFirebaseConfig.messagingSenderId,
  appId: import.meta.env["VITE_FIREBASE_APP_ID"] || defaultFirebaseConfig.appId,
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

export function isOwnerEmail(email: string | null | undefined) {
  return email ? OWNER_EMAILS.has(email.trim().toLowerCase()) : false;
}

export type CustomerReview = {
  id?: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
};

export async function saveCustomerReview(review: Omit<CustomerReview, "id" | "createdAt">) {
  const currentAuth = requireAuth();
  if (!firebaseAppModule) throw new Error("Review storage is not configured.");
  const firestoreModule = await import("firebase/firestore");
  const database = firestoreModule.getFirestore(firebaseAppModule.getApp());
  await firestoreModule.addDoc(firestoreModule.collection(database, "customerReviews"), {
    ...review,
    userId: currentAuth.currentUser?.uid ?? "",
    createdAt: firestoreModule.serverTimestamp(),
  });
}

export async function getCustomerReviews() {
  const currentAuth = requireAuth();
  if (!firebaseAppModule) throw new Error("Review storage is not configured.");
  const firestoreModule = await import("firebase/firestore");
  const database = firestoreModule.getFirestore(firebaseAppModule.getApp());
  const loadPromise = firestoreModule.getDocs(
    firestoreModule.collection(database, "customerReviews"),
  );
  const timeoutPromise = new Promise<never>((_, reject) => {
    window.setTimeout(() => reject(new Error("Review loading timed out.")), 3_000);
  });
  const snapshot = await Promise.race([loadPromise, timeoutPromise]);

  return snapshot.docs
    .map((review) => {
      const data = review.data();
      const timestamp = data["createdAt"]?.toDate?.();
      return {
        id: review.id,
        productId: String(data["productId"] ?? ""),
        productName: String(data["productName"] ?? ""),
        productImage: String(data["productImage"] ?? ""),
        rating: Number(data["rating"] ?? 0),
        comment: String(data["comment"] ?? ""),
        customerName: String(data["customerName"] ?? ""),
        customerEmail: String(data["customerEmail"] ?? ""),
        createdAt: timestamp instanceof Date ? timestamp.toISOString() : "",
      } satisfies CustomerReview;
    })
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function onAuthStateChange(callback: (user: ReturnType<typeof mapUser>) => void) {
  if (!auth || !firebaseAuthModule) return () => {};
  return firebaseAuthModule.onAuthStateChanged(auth, (user) => callback(mapUser(user)));
}

export async function logout() {
  if (auth && firebaseAuthModule) await firebaseAuthModule.signOut(auth);
}
