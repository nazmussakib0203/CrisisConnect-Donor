# NGO — Final Project Plan

Your backend (`src/ngo/` in `CrisisConnect-Backend`) is already fully built,
OTP included: `signup → verify-otp` and `login → verify-login-otp`. You do
not need to touch the auth logic at all.

Auth pages are already built for this role as part of the shared flow
(`app/login`, `app/register` are the shared entry points; `app/ngo/register`,
`app/ngo/verify-signup`, `app/ngo/login` are this role's continuation
pages) — see the root `README.md` in this folder for how the pieces fit
together. Nothing else in this plan changes because of that.

## The one backend change you need

`GET /ngo/crisis` is currently guarded (`@UseGuards(NgoGuard)` in
`src/ngo/ngo.controller.ts`). Remove that one decorator so browsing crises
needs no token. Everything else in the file — `join`, `leave`, `my-crises`,
`volunteer-call`, `donation-call`, `application`, `assignment`, `profile` —
stays guarded exactly as it is. This one change is what makes real
server-side rendering possible (see the root `README.md` in this folder for
why).

## Pages to build

All routes below live under `app/ngo/` (own-folder-only — see the root
`README.md`), so the SSR home teaser is `/ngo`, not the app's root `/`. The
root `/` stays the shared login/register gateway, untouched by this plan.

| Route | CSR/SSR | Data | Axios call |
|---|---|---|---|
| `/ngo` | SSR | first 3 active crises | `GET /ngo/crisis` |
| `/ngo/register` | CSR | — | `POST /ngo/signup` |
| `/ngo/verify-signup` | CSR | — | `POST /ngo/verify-otp` |
| `/ngo/login` | CSR | — (shared `/login` already did email+password) | `POST /ngo/verify-login-otp` |
| `/ngo/dashboard` | CSR | your org profile | `GET /ngo/profile` |
| `/ngo/crises` | SSR | all crises (folder-based route) | `GET /ngo/crisis` |
| `/ngo/crises/loading.tsx` | — | Next.js loading UI while the above fetch runs | — |
| `/ngo/crises/[id]` | SSR | one crisis (dynamic route) | reuses the same `GET /ngo/crisis` list, find by id server-side |
| `/ngo/crises/[id]` → `notFound()` | — | call `notFound()` from `next/navigation` when the id isn't in the list, which renders `not-found.tsx` | — |
| `/ngo/crises/[id]` "Join" button | CSR (client component nested in the SSR page) | — | `POST /ngo/crisis/:id/join` |
| `/ngo/my-crises` | CSR | crises you've joined + a "Leave" button | `GET /ngo/my-crises`, `DELETE /ngo/crisis/:id/leave` |
| `/ngo/calls` | CSR | your volunteer calls, a create form (crisis picked from a dropdown of your joined crises via `GET /ngo/my-crises`), a close button | `GET /ngo/volunteer-call`, `GET /ngo/my-crises`, `POST /ngo/volunteer-call`, `PATCH /ngo/volunteer-call/:id/status` |
| `/ngo/calls/[id]` | CSR | applicants for that one call, approve/reject buttons | `GET /ngo/volunteer-call/:id/applicants`, `POST /ngo/application/:id/approve`, `PATCH /ngo/application/:id/reject` |
| `/ngo/donation-calls` | CSR | your donation calls + create form (same joined-crisis dropdown) | `GET /ngo/donation-call`, `GET /ngo/my-crises`, `POST /ngo/donation-call` |
| `/ngo/donation-calls/[id]` | CSR | that call's raised/target summary + who donated how much | `GET /ngo/donation-call`, `GET /ngo/donation-call/:id/donations` |

Built: all rows above, plus a `layout.tsx` and `_components/` (Navbar,
CrisisCard, Carousel) inside `app/ngo/` for the shared-within-this-role UI
the table doesn't itemize on its own.

The donations list needed one backend addition beyond what was originally
scoped here: `GET /ngo/donation-call/:id/donations`, reading Donor's
`Donation` entity through a repository registered in `ngo.module.ts` — same
pattern already used for reading Admin's `Crisis` and Volunteer's
`Application`, no edits to Donor's files.

Well past the 12 Axios-call minimum now (3 SSR, the rest CSR), with real
SSR/CSR variety covered from the original count alone — the additions above
are for actual completeness (approving applicants, seeing who donated), not
for padding the number.

## Auth + validation

Already built — Zod for form validation, one `error` string per form,
`localStorage.setItem("email", ...)` on both the shared login and NGO's own
register/verify steps, `localStorage.setItem("token", ...)` once
`/ngo/login` finishes at `/ngo/login` (the OTP step), read back with
`useEffect` on `/ngo/dashboard`. Every guarded call from a Client Component
sends `Authorization: Bearer <token>` read from `localStorage`.

## Required components (no styling opinions here — just what has to exist)

- A Navbar (shared across all pages via `app/layout.tsx`)
- Crisis / call cards for each list item
- A carousel somewhere reasonable — the home page teaser (3 crises) is the
  natural fit

## shadcn/ui, a menu component, and D3.js

Faculty asked (separately from the written rubric) for Card, Carousel, a
Navbar, and a menu component to actually come from **shadcn/ui**, plus a
**D3.js** chart somewhere. shadcn/ui is installed at the project root
(`components.json`, `components/ui/`, `lib/utils.ts`) since it's shared
infrastructure like Tailwind itself — every role can use it, nothing about
how NGO uses it is imposed on anyone else.

- `NgoNavbar` — shadcn `NavigationMenu` for the link row (Crises, My
  Crises, Volunteer Calls, Donation Calls), plus a shadcn `DropdownMenu`
  ("Account") for Dashboard/Logout — satisfies both "navbar" and "menu" in
  one component.
- Every card-shaped thing this role renders (crisis cards, call cards,
  donation-call cards, applicant cards, my-crises cards) uses shadcn's
  `Card`/`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/
  `CardFooter`, not hand-rolled `<div>`s.
- The home teaser carousel uses shadcn's `Carousel` (Embla-based) instead
  of a manual `useState` index.
- `app/ngo/_components/DonationChart.tsx` — a D3.js bar chart on
  `/ngo/donation-calls` showing raised vs. target per donation call. D3
  wasn't in any lecture material covered earlier in this project, so there
  was no prior course pattern to follow here — built directly from D3's
  own API (`d3.select`, `d3.scaleLinear`, `d3.max`) against the same
  `raisedAmount`/`targetAmount` fields the cards already show.

## Optional

- `/assignment` — read-only list, `GET /ngo/assignment` (CSR). Nice extra
  margin above 12 if you want it; not required.
- PusherJS notification (bonus 5 marks) — e.g. notify when a volunteer
  applies to one of your calls. Skip unless you specifically want to take on
  a third-party real-time service and explain it; nothing above depends on
  it.
