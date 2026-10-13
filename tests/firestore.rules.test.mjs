import { readFile } from "node:fs/promises";
import { after, before, test } from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const projectId = "northstar-rules-test";
const workspace = {
  saved: [],
  folders: [],
  notes: [],
  completed: [],
  reminders: [],
  progress: {},
  notificationsRead: false,
  theme: "dark",
  settingsTab: "Profile",
  preferences: {
    displayName: "Test User",
    region: "",
    weekly: true,
    completedVisible: true,
    announcements: true,
    sessions: true,
    newContent: true,
    experience: "Exploring",
    markets: "Not set",
    preferredHours: "Not set",
  },
};

let testEnv;
before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: await readFile(new URL("../firestore.rules", import.meta.url), "utf8"),
    },
  });
});

after(async () => {
  await testEnv?.cleanup();
});

test("signed-in users can store and read only their own valid workspace", async () => {
  const alice = testEnv.authenticatedContext("alice").firestore();
  const aliceState = doc(alice, "users/alice/workspace/state");
  await assertSucceeds(setDoc(aliceState, { data: workspace, updatedAt: serverTimestamp() }));
  await assertSucceeds(getDoc(aliceState));

  const bob = testEnv.authenticatedContext("bob").firestore();
  await assertFails(getDoc(doc(bob, "users/alice/workspace/state")));
  await assertFails(setDoc(doc(bob, "users/alice/workspace/state"), {
    data: workspace,
    updatedAt: serverTimestamp(),
  }));
});

test("unauthenticated and malformed workspace writes are denied", async () => {
  const anonymous = testEnv.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(anonymous, "users/alice/workspace/state")));
  const aliceState = doc(testEnv.authenticatedContext("alice").firestore(), "users/alice/workspace/state");
  await assertFails(setDoc(aliceState, {
    data: { ...workspace, membership: "premium" },
    updatedAt: serverTimestamp(),
  }));
  await assertFails(setDoc(aliceState, {
    data: { ...workspace, preferences: { ...workspace.preferences, weekly: "yes" } },
    updatedAt: serverTimestamp(),
  }));
  await assertFails(setDoc(aliceState, {
    data: { ...workspace, saved: Array(1001).fill("lesson") },
    updatedAt: serverTimestamp(),
  }));
});

test("clients cannot read or write server-owned membership records", async () => {
  const alice = testEnv.authenticatedContext("alice").firestore();
  const membership = doc(alice, "users/alice/membership/current");
  await assertFails(getDoc(membership));
  await assertFails(setDoc(membership, { active: true }));
});
