# Volunteer — Final Project Plan

Your backend (`src/volunteer/` in `CrisisConnect-Backend`) is already fully
built: signup, login (with OTP), profile, skills, browsing calls, applying,
assignments, work logs. Nothing here requires you to change that — whether
you keep OTP or not is your call.

Auth pages work like every role — see the root `README.md` in this folder
for the shared-flow explanation. In short: `app/login` and `app/register`
are shared and already built. `app/volunteer/register/page.tsx` and
`app/volunteer/login/page.tsx` are empty base files sitting in your own
folder already, ready for whatever your signup/login screens need —
including an OTP step if you keep one, using your existing
`verify-otp`/`verify-login-otp` routes.

Note: `Volunteer.email` and `Volunteer.password` were made nullable on
`main` so the app can boot — the live database didn't have those columns
and `synchronize` can't add a required column to a table that already has
rows. That's a minimal, non-destructive fix to unblock everyone else; the
actual signup/login logic wasn't touched. Whether those columns belong on
`Volunteer` at all (separate from the shared `user` table every other role
uses for email/password) is yours to sort out on your own branch.

## Required backend edit — unguard one browse route

`GET /volunteer/calls` is behind `@UseGuards(JwtAuthGuard)` in
`src/volunteer/volunteer.controller.ts`. Remove the guard from that one
route only. Visitors should be able to see open calls before registering as
a volunteer. Leave every other route (`application`, `assignment`,
`work-log`, `skill`, `profile`) guarded exactly as-is.

## Pages to build

| Route | CSR/SSR | Data | Axios call |
|---|---|---|---|
| `/` | SSR | first 3 open calls | `GET /volunteer/calls` |
| `/volunteer/register` | CSR | — | `POST /volunteer/signup` |
| `/volunteer/login` | CSR | — (shared `/login` already did email+password) | whatever your backend's login still needs — e.g. `POST /volunteer/verify-login-otp` if you keep OTP |
| `/volunteer/dashboard` | CSR | your volunteer profile | `GET /volunteer/profile` |
| `/calls` | SSR | all open calls (folder-based route) | `GET /volunteer/calls` |
| `/calls/loading.tsx` | — | loading UI while the fetch runs | — |
| `/calls/[id]` | SSR | one call (dynamic route) | reuses the same `GET /volunteer/calls` list, find by id server-side |
| `/calls/[id]` → `notFound()` | — | call `notFound()` when the id isn't in the list, which renders `not-found.tsx` | — |
| `/calls/[id]` "Apply" form | CSR (client component nested in the SSR page) | a short message field | `POST /volunteer/application` |
| `/applications` | CSR | your applications + a withdraw button | `GET /volunteer/application`, `DELETE /volunteer/application/:id` |
| `/profile/edit` | CSR | edit form + availability toggle | `PUT /volunteer/profile`, `PATCH /volunteer/profile/availability` |
| `/assignments` | CSR | your approved assignments (read-only) | `GET /volunteer/assignment` |

That's 12 Axios call sites (3 SSR, 9 CSR) — at the minimum, plus whatever
your `/volunteer/login` continuation ends up calling. The shared `/login`
page's own two calls (`GET /auth/role`, `POST /volunteer/login`) are extra
on top of this since they're common code, not volunteer-specific.

## Signup form fields

`email, password, username, fullName, phone, city` — note `email` must
actually be a `@gmail.com` address (`CreateVolunteerDto` enforces this with
a regex), so mention that on the form or the backend will reject anything
else with a 400.

## Applying to a call

`POST /volunteer/application` body: `{ volunteerCallId, message }`. Both are
required strings/numbers — `volunteerCallId` comes from the `[id]` route
param, `message` is a short text field on the form ("why do you want to help
with this?").

## Auth + validation

Zod validation on every form, one `error` string per form, `localStorage`
for the token and a display name, `Authorization: Bearer <token>` attached
on every guarded call.

## Required components (no styling opinions here — just what has to exist)

- A Navbar (shared via `app/layout.tsx`)
- Call cards for each list item
- A carousel somewhere reasonable — the home page teaser is the natural fit

## Optional — skip unless you want extra scope

- Skills (`POST /volunteer/skill`, `me/skill` attach/detach/list) — a whole
  many-to-many relationship on top of everything above. Not needed for the
  12-call minimum; only add it if you want more to show.
- Work logs (`POST`/`GET /volunteer/work-log`) — another 1:N pair, same
  reasoning: nice extra, not required.
- PusherJS notification (bonus 5 marks) — e.g. notify when your application
  gets approved. Skip unless you specifically want the extra 5 marks.
