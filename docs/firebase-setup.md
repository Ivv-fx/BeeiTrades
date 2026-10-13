# Firebase setup

This application uses Firebase Authentication (Google provider) and Cloud
Firestore. Firebase Authentication verifies identity tokens; Firestore applies
the deployed rules to every workspace read/write. The browser never receives
server credentials, and membership/entitlement documents are not client
writable.

## Configure the project

1. Create or select a Firebase project and register a Web app.
2. In **Authentication → Sign-in method**, enable Google. Add the deployed
   Hosting domain and local development domain under **Authorized domains**.
3. Copy the Web app's Firebase configuration values into a new `.env.local`
   using the keys in `.env.example`. These Firebase web-app values identify the
   project; use the complete App ID from Firebase Console, and do not put
   service-account credentials or private keys here.
4. Install dependencies and run `npm run dev`. Run `npm run build` before
   deployment.
5. Install the Firebase CLI, authenticate it locally, and select the project
   with `firebase use --add`. Do not commit the generated `.firebaserc`.
6. Run `firebase deploy --only firestore:rules,hosting` after reviewing the
   selected project and deployment target.

For local authorization testing, run `npm test`. The test suite uses Firebase's
rules unit-testing library and does not contact a production project.

## Data and authorization

- Firebase Auth owns Google identity and its provider-managed email/display
  name.
- `users/{uid}/workspace/state` stores a user's learning workspace. Firestore
  rules require the authenticated UID to match the path UID and validate the
  document's allowed fields and collection sizes.
- `users/{uid}/membership/**` is denied to browser clients. A future trusted
  payment webhook must write entitlements through a server-side Firebase
  Admin SDK function after signature verification and idempotency checks.
- Partner offers remain demonstration content until the partner terms and
  referral authorization are verified.

Google sign-in and Firestore persistence remain unavailable until the Firebase
project configuration, Google provider, and deployed rules are set up. No
OAuth, Whop, or production payment credentials are included in this repository.

Use `http://localhost:5173` (or the Vite URL printed at startup) for local
development. Firebase Auth rejected the numeric loopback host `127.0.0.1` as
unauthorized during validation; `localhost` reached Google's consent screen.
Do not use a shortened Firebase App ID in `.env.local`.
