# Integration audit

Audit date: 2026-10-12

## Scope and evidence

- Inspected the workspace source files and current app in the shared browser.
- Inspected the configured REA CLI with `rea doctor`, `rea setup --dry-run`,
  and the documented command help.
- Checked for project manifests and integration-related environment-variable
  **names only**. No environment-variable values or browser storage values were
  read.
- The root workspace contains the Northstar UI plus Firebase client setup,
  Firestore rules, Hosting configuration, an environment template, and
  Firestore rules tests. The user supplied Firebase Web app configuration,
  which is stored in ignored `.env.local`; no private credentials were supplied.
- `reverse-skill/` is a separate nested checkout and is not the application
  source; it was left unchanged.

## Existing functionality

The current Northstar UI is a Firebase-backed account shell with a demonstration
learning experience. Its working screens
include:

- Home dashboard and sample learning progress.
- Searchable/filterable lesson and recording libraries with access tabs.
- Original sample lesson pages, illustrative player, reading prompts, and
  account-backed progress.
- Account-backed bookmarks, folders, notes, reminders, and completion state.
- Sample session reminders, partner-offer cards, and membership screens.
- Notifications, theme/profile preferences, and local demo-data export/reset.
- Responsive desktop and mobile navigation.

Learning content is still sample data. Firebase Google sign-in and
UID-partitioned Firestore persistence are implemented. The local app
configuration is present, but sign-in is not confirmed until the intended
Firebase project, Google provider, and authorized domains are verified.
The app does not play the target's video content, send notifications, grant
membership, or charge a payment method.

## Integration findings

| Area | Current state | Required before production |
|---|---|---|
| Backend and database | Firebase has been selected. The app has Firebase Auth Google sign-in, a per-UID Firestore workspace document, UID-scoped Firestore rules, Firebase Hosting configuration, and rules tests. The supplied Web app config is in ignored `.env.local`; deployed rules and Console configuration are unverified. | Confirm the intended Firebase project, authorize the Hosting domain in Auth, deploy reviewed Firestore rules, and run emulator tests. Firebase Auth verifies identity; Firestore rules enforce workspace access. |
| Google sign-in | Firebase client sign-in uses a Google provider popup on desktop and redirect on small screens, Firebase-managed session persistence, and an app-wide signed-out/loading/error gate. No Google password or OAuth secret is present in client code. | Confirm the registered Web app and enabled Google provider belong to project `beeitrades`, add authorized domains, and test with an authorized account. |
| Membership/payment | UI-only demo. No checkout API, payment SDK, webhook, entitlement, or subscription storage. | The live app's membership screen identifies **Whop** as the payment handler. It shows **USD $150 monthly** and **$400 quarterly**, displayed as **$133/month** with an **11% saving** claim. Confirm that these are the intended clone prices and still-current Whop plans; create sandbox products/API access and webhook configuration before implementation/testing. |
| Partner offers | Three demonstration cards; their codes are explicitly labelled sample content in the UI. | The live app's Discounts page displayed Apex (90% off EOD accounts), Tradeify (30%), and Lucid (30%), with code `AM` and outbound subdomains `apex.amtrades.com`, `tradeify.amtrades.com`, and `lucid.amtrades.com`. It displayed no end date. These observations do **not** establish current eligibility, inventory, expiry, referral authorization, API access, or disclosure terms. Obtain written/current partner details before publishing or replacing demo cards. |
| Account data | Learning workspace state is stored at `users/{uid}/workspace/state`; rules restrict access to the matching signed-in Firebase UID and validate the workspace envelope, field set, and bounded collection sizes. Other paths, including membership records, are denied to browser clients. | Deploy the rules and verify them in the Firestore emulator. Add a trusted Firebase Admin SDK function before writing payment-derived entitlements. |
| REA/browser capture | REA CLI is installed; the skill is aligned. The original doctor result reported registration drift. The documented dry run proposed creating only the VS Code MCP entry in `C:\\Users\\vivek\\AppData\\Roaming\\Code\\User\\mcp.json`, preserving other settings and requiring no extra provider variables. | VS Code must reload/restart to consume the new registration. REA browser commands additionally require an actual loopback CDP endpoint and a target ID discovered from that endpoint. Neither was supplied by the shared browser integration. Do not expose a debugging port publicly or guess either value. |

The live app's OAuth callback, Whop pricing, and offer cards are reference
observations, not credentials or proof of API permissions. No Firebase project
private credentials, Whop API secret, webhook signing secret, or partner
authorization details have been supplied. The user's Firebase config specifies
`beeitrades`; the user noted a possible spelling mismatch with a Console project
named `beeittrades`. These are distinct project IDs and must not be mixed.

## REA repair and remaining browser limitation

Applied the user-requested, documented command:

```text
rea setup --client vscode --yes
```

REA reported `configured_vscode`; its post-setup doctor reported the VS Code
registration as aligned. The change is in the user-level VS Code MCP
configuration, outside this workspace. REA's documentation says browser
observation uses the existing browser's literal-port loopback CDP endpoint,
then `list-browser-targets` to obtain a target ID. A client restart/reconnect is
still required for the MCP registration to appear in this running session. No
CDP endpoint is available in the shared-page context, so REA could not capture
the authenticated tab. This was not worked around by scanning ports, enabling
remote debugging, exporting cookies, or replaying authentication requests.
Manual inspection of the shared browser remains possible.

## Latest local verification

- The populated `.env.local` identifies project `beeitrades` and contains a
  complete Web App ID. The abbreviated App ID in the latest setup message must
  not replace the full value. The possible `beeittrades` Console project is a
  different ID and still needs human confirmation.
- The local app was opened on `127.0.0.1`; Firebase returned
  `auth/unauthorized-domain`. Reopening it on `localhost` reached the Google
  OAuth consent screen. This confirms that the local app can initiate OAuth
  and that Firebase/Google recognized the configured client; no consent was
  granted and no Firebase sign-in/session callback was verified. Use localhost
  for development, or explicitly authorize `127.0.0.1` if that host is needed.
- Firestore emulator tests pass (3/3) with UID-isolation, malformed workspace,
  size-limit, and membership-denial cases. `npm run build` passes.
- `npm audit --omit=dev` reports 0 vulnerabilities. The complete dependency
  audit still reports 11 moderate/high findings in Firebase CLI development
  dependencies. The CLI was upgraded to v15.33.0 after verifying its Node
  engine requirement and rerunning the emulator tests; remaining findings
  would require further transitive overrides or breaking changes and are not
  suppressed.

## Proposed implementation plan

1. **Connect and validate Firebase.** Confirm the exact project ID in Firebase
   Console against ignored `.env.local`, enable Google Auth, configure
   authorized domains, run Firestore rules tests, and deploy Hosting plus
   reviewed rules only after selecting the intended project.
2. **Implement Whop billing after confirmation.** Accept only server-owned
   plan IDs, create sandbox
   checkout sessions on the server, associate checkout with the authenticated
   user, verify signed webhooks, deduplicate event IDs, update subscriptions
   and entitlements from trusted events, and handle cancellation, refunds, and
   payment failure. Never unlock access from a success redirect alone.
3. **Verify partner offers.** Keep unverified offers labelled demo-only. Add a
   validated offer record with partner, description, eligibility, expiry,
   authorized referral URL, disclosure, and update provenance only after
   permission/details are supplied.
4. **Test and deploy.** Add focused auth/session, access-control, checkout,
   webhook signature/idempotency, entitlement, offer-validation, cancellation,
   and failure tests. Run them against provider sandboxes and authorized test
   accounts, then validate browser flows on the configured deployment. Do not
   claim production operation until real credentials and end-to-end sandbox
   results are verified.

## Inputs still required

- Confirm whether `beeitrades` or `beeittrades` is the intended Firebase project
  and ensure `.env.local`, the registered Web app, Google provider, and local
  Firebase CLI selection all refer to that same project. Complete the Google
  consent flow using an authorized test account after confirmation. Do not
  share service-account private keys in chat or commit them.
- Confirm the production domain for Firebase Hosting and add it to Firebase
  Authentication's authorized domains.
- Confirm that Whop is authorized for this clone and that the observed
  $150-monthly / $400-quarterly USD plans are current and intended.
- Confirm Whop authorization and the sandbox products/plan IDs; configure
  secrets in Firebase Functions Secret Manager when payment functions are
  implemented.
- Supply current partner offer terms and permission to use any affiliate links
  or disclosure text.
- Reload/restart VS Code after the REA registration change; if REA browser
  evidence is still required, connect an authorized local browser with its
  documented loopback CDP integration without exposing the port.
