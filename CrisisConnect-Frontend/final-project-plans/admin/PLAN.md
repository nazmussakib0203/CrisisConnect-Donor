# Admin — Final Project Plan

Your backend (`src/admin/` in `CrisisConnect-Backend`) is already fully
built: signup, login (with OTP), profile, crisis CRUD, and announcements.
Nothing here requires you to change that — whether you keep OTP or not is
your call.

Auth pages work like every role — see the root `README.md` in this folder
for the shared-flow explanation. In short: `app/login` and `app/register`
are shared and already built. `app/register` doesn't link to admin
registration, since admins aren't self-registered (an existing admin
creates new ones) — how you enforce that on the backend, if at all, is up
to you. `app/admin/register/page.tsx` and `app/admin/login/page.tsx` are
empty base files sitting in your own folder already, ready for whatever
your signup/login screens need — including an OTP step if you keep one,
using your existing `verify-otp`/`verify-login-otp` routes.

## Required backend edit — unguard one browse route

`GET /admin/crisis` and `GET /admin/crisis/:id` are both behind
`@UseGuards(AdminGuard)` in `src/admin/admin.controller.ts`. Remove the
guard from both. Crisis data is meant to be public safety information
anyway — visitors should be able to see active crises before registering.
Leave every other route (`POST/PUT/PATCH/DELETE crisis`, `announcement`,
`users`, `profile`) guarded exactly as-is.

## Pages to build

| Route | CSR/SSR | Data | Axios call |
|---|---|---|---|
| `/` | SSR | first 3 crises | `GET /admin/crisis` |
| `/admin/register` | CSR | — | `POST /admin/signup` |
| `/admin/login` | CSR | — (shared `/login` already did email+password) | whatever your backend's login still needs — e.g. `POST /admin/verify-login-otp` if you keep OTP |
| `/admin/dashboard` | CSR | your admin profile | `GET /admin/profile` |
| `/crises` | SSR | all crises (folder-based route) | `GET /admin/crisis` |
| `/crises/loading.tsx` | — | loading UI while the fetch runs | — |
| `/crises/[id]` | SSR | one crisis (dynamic route) | `GET /admin/crisis/:id` |
| `/crises/[id]` → `notFound()` | — | call `notFound()` on a 404 response, which renders `not-found.tsx` | — |
| `/crises/new` | CSR | create-crisis form | `POST /admin/crisis` |
| `/crises/[id]/edit` (or a manage table on `/crises`) | CSR | edit + close buttons | `PUT /admin/crisis/:id`, `PATCH /admin/crisis/:id/status` |
| `/announcements/new` | CSR | create-announcement form | `POST /admin/announcement` |

That's 12 Axios call sites (3 SSR, 9 CSR) — at the minimum, plus whatever
your `/admin/login` continuation ends up calling. The shared `/login`
page's own two calls (`GET /auth/role`, `POST /admin/login`) are extra on
top of this since they're common code, not admin-specific. A couple of easy
additions if you want more margin:

- Add `/users` — read-only list, `GET /admin/users` (CSR). Realistic for an
  admin dashboard anyway.
- Add a "view announcement" step after creating one: `GET
  /admin/announcement/:id` (CSR), since the create form's response already
  gives you the new id.

`recipientUserIds` on the announcement form is a required, non-empty array
of user ids in the DTO. The simplest form for it is a single text input —
"Recipient user IDs, comma separated" — split on `,` and `.map(Number)`
before sending. That's not a taught pattern from a slide, it's just the
smallest amount of code that turns one text field into an array of numbers;
a real multi-select fed by `GET /admin/users` is a nicer version if you
build the `/users` page above anyway, but isn't required.

## Signup form fields

`email, password, fullName, phone, city, age` — `age` must be an integer
≥ 18 (`CreateAdminDto`).

## Auth + validation

Zod validation on every form, one `error` string per form, `localStorage`
for the token (and whatever identity string you want to greet with on
`/admin/dashboard`), `Authorization: Bearer <token>` attached on every
guarded call.

## Required components (no styling opinions here — just what has to exist)

- A Navbar (shared via `app/layout.tsx`)
- Crisis cards for each list item
- A carousel somewhere reasonable — the home page teaser is the natural fit

## Optional

- `/announcements` list page if you build `GET /admin/announcement` (list) —
  doesn't exist yet, only get-by-id does. Not required.
- PusherJS notification (bonus 5 marks) — e.g. notify when a new crisis is
  declared. Skip unless you want the extra 5 marks and don't mind explaining
  a third-party real-time service.
