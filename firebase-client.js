import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId,
);

let auth;
let db;
if (firebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export function subscribeToAuth(callback, onError) {
  if (!auth) throw new Error("Firebase is not configured.");
  return onAuthStateChanged(auth, callback, onError);
}

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase is not configured.");
  await setPersistence(auth, browserLocalPersistence);
  await signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  if (!auth) throw new Error("Firebase is not configured.");
  await signOut(auth);
}

export async function loadWorkspace(uid) {
  if (!db) throw new Error("Firebase is not configured.");
  const snapshot = await getDoc(doc(db, "users", uid, "workspace", "state"));
  return snapshot.exists() ? snapshot.data().data : null;
}

export async function saveWorkspace(uid, workspace) {
  if (!db) throw new Error("Firebase is not configured.");
  await setDoc(doc(db, "users", uid, "workspace", "state"), {
    data: workspace,
    updatedAt: serverTimestamp(),
  });
}
