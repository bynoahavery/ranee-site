# Ranee, Bondi Beach: private viewing site

A single-property site with a name-and-passcode sign-in, a photo gallery with a
full-screen slideshow, and a server-side record of who signed in and when.
The agent sees it in a dashboard at `/admin`.

## Why this stack

**Netlify static hosting + Netlify Functions + Netlify Blobs**, plain HTML/CSS/JS,
one dependency (`@netlify/blobs`).

- **Functions** check the passcode and session on the server. The passcode lives
  only in an environment variable and never reaches the browser.
- **Photos and ad copy are not public files.** Photos live in `private/`, outside
  the published folder, and are served by a function that requires a valid
  session. The copy is returned by `/api/content`, also behind the session.
  The public HTML contains only the sign-in screen.
- **Blobs** is Netlify's built-in key-value storage. It persists across deploys
  and needs no external database or account.
- No framework or build step, so there is less to break and nothing to update.

## What gets recorded

Only successful sign-ins: **the first and last name entered, and the time**. Both name
boxes are required and must contain at least one letter, checked on the server. Nothing else is
recorded. That means no photo views, failed attempts, IP addresses, locations
or devices.

The dashboard shows:
- **People:** the number of different names that have signed in. Names are
  grouped ignoring capitals and extra spaces, so "jane citizen" and
  "Jane Citizen" count as one person.
- **Visits:** the total number of sign-ins.
- **A People table:** each name with its number of visits and first and latest
  sign-in.
- **All sign-ins:** every sign-in, newest first, with name and time.

**Download CSV** exports every sign-in: time (UTC and Sydney) and name.

To stop repeated passcode guessing, the server keeps a short-lived counter per
connection. It stores a one-way hash, not the IP address, holds no name and
expires after 15 minutes. After 8 wrong attempts, sign-in is paused for 15
minutes.

## Setup

### 1. Environment variables

In Netlify, go to **Site configuration → Environment variables** and add:

| Variable | Purpose |
|---|---|
| `SITE_PASSCODE` | The passcode visitors enter. **Change it here; this is the single place.** |
| `ADMIN_PASSCODE` | The passcode for the `/admin` dashboard. Make it different from `SITE_PASSCODE`. |
| `SESSION_SECRET` | 32+ random characters used to sign cookies. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |

After changing any of these, redeploy (**Deploys → Trigger deploy**) so the
functions pick up the new value. Changing `SESSION_SECRET` signs everyone out.

If any variable is missing, sign-in is refused. The site fails closed.

### 2. Deploy

Functions require a Git-connected site or the CLI. **Drag-and-drop deploys
(Netlify Drop) do not run functions**, so the site would not work that way.

Via Git (recommended): push this folder to GitHub, GitLab or Bitbucket, then
**Add new site → Import an existing project**. The settings come from
`netlify.toml`, so leave the build command empty.

Via the CLI:
```bash
npm install
npx netlify login
npx netlify init        # or: npx netlify link   (for an existing site)
npx netlify deploy --prod
```

### 3. Run locally

```bash
npm install
cp .env.example .env     # then edit the three values
npx netlify link         # connect to your Netlify site (needed for Blobs)
npm run dev              # http://localhost:8888, dashboard at /admin
```

## Changing content

- **Copy, section headings, photo order, titles and alt text:** `netlify/lib/content.mjs`.
  The ad copy there is verbatim from the advertising team.
- **Photos:** each photo exists in `private/photos/{sm,md,full}/<id>.jpg`
  (800, 1600 and 2560px wide). To add or replace one, run
  `python tools/prepare_photos.py <id> <original.jpg>`. The script resizes the
  photo and strips metadata, including the drone photo's GPS data. Then add or
  update the matching entry in `content.mjs`.
- **Sign-in privacy notice:** in `public/index.html`. It tells visitors their name and
  sign-in time are recorded. Have the agency confirm the wording.

## Security notes

- Passcode comparison is constant-time. After 8 failed attempts from one
  connection, sign-in is paused for 15 minutes. Visitors who share an office
  network share that limit.
- Sessions last 12 hours and dashboard sessions last 8 hours. Cookies are
  HttpOnly, SameSite=Lax and Secure over HTTPS.
- Photo responses are `Cache-Control: private`, so Netlify's CDN never serves
  them to anyone else.
- A strict Content-Security-Policy, `noindex` headers and frame blocking are set
  in `netlify.toml`.
- A single shared passcode can be passed on. The name field identifies people
  by what they type, not who they are. If accountability matters more, issue
  per-person passcodes. That would be a small change to `login.mjs`.

## Files

```
netlify.toml               hosting, function and header config
public/                    published: sign-in shell, styles, scripts, /admin
netlify/functions/         API: login, logout, content, photo, admin-*
netlify/lib/content.mjs    copy + photo manifest (served only after sign-in)
netlify/lib/core.mjs       sessions, passcode check, storage, rate limiting
netlify/lib/report.mjs     sign-in summary and CSV export
private/photos/            photos, bundled into the photo function only
tools/prepare_photos.py    photo resizing helper
```
