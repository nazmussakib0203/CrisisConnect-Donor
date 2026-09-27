# Final Project Plans

CrisisConnect is graded per person, not per team. Each of the four roles
(NGO, Admin, Volunteer, Donor) is a separate frontend, built by a different
teammate against their own slice of the backend, and each one must
independently satisfy the same rubric:

- 12+ Axios calls, rendered with CSR or SSR depending on the scenario (25 marks)
- Proper layout using components + Tailwind CSS (10 marks)
- Different routing: folder-based, dynamic, and route files like `loading`
  and `not-found` (10 marks)
- Frontend data validation and authentication (10 marks)
- PusherJS real-time notification (bonus, 5 marks — optional, see each plan)
- Class add-ons repeated in every plan: at least 3 CSR and 3 SSR pages, Axios
  only (no `fetch`), a Navbar + Card + Carousel somewhere, role-based
  register/login.

Open your own folder — `ngo/`, `admin/`, `volunteer/`, or `donor/` — for your
plan. Read only your own; you don't need the others to do your part. None of
these plans say anything about colors, spacing, or Tailwind class choices —
that's entirely up to whoever builds the page.

Same rule as the backend: build everything for your role inside
`app/<role>/`. Don't edit files outside that folder — `app/layout.tsx`,
`app/page.tsx`, `app/login`, `app/register`, `components/`, `globals.css` —
unless the change is genuinely needed for every role, not just yours. The
root of the app is deliberately kept minimal right now (it's just the
shared login/register gateway that hands off into your folder) — a nicer
landing page is a separate, later thing, not part of any one role's work.

Backend routes referenced below live in `CrisisConnect-Backend`, on its
`main` branch — that's the branch with everyone's actual merged backend
work (the individually-named `admin`/`volunteer`/`donor`/`ngo`/`dev`
branches over there are stale snapshots from before each PR merged).

## Ground rule that applies to all four

Every non-auth route in the backend is currently guarded (`Authorization:
Bearer <token>` required) — that's how it demonstrates authentication for
the backend's own grading. But a Server Component (used for SSR) runs on the
server and can't read `localStorage`, so it can never attach that header —
there is no `fetch`/cookie-based session in this project, on purpose, to
avoid pulling in Next.js middleware (not taught).

The fix used in every plan below is the same one line each role needs:
**unguard exactly one existing "browse" GET route** on the backend so it
returns data to anyone, logged in or not. That route becomes the one SSR
data source (home teaser, list page, and dynamic detail page all read it).
Every other route — profile, create, update, approve, delete, anything
personal or mutating — stays guarded and is called from the browser after
login, with the JWT read out of `localStorage` and sent as `Authorization:
Bearer <token>` on that one Axios call.

## Unified login/registration

The faculty asked for one shared login and one shared registration entry
point across all four roles. That's built on `main` of this frontend repo,
and it's the only cross-role piece — everything past it is your own call:

- **`app/login/page.tsx`** (shared) — a single email + password form for
  everyone. On submit it calls `GET /auth/role?email=...` on the backend (a
  small shared endpoint that looks the email up in the `user` table and
  returns its `role`), then posts the exact `{ email, password }` the user
  typed straight to that role's own `POST /<role>/login` — untouched, both
  fields, nothing stripped or pre-checked by the shared page first. Your own
  `/​<role>/login` route runs exactly as if the request came from a form on
  your own page; it does its own password check, its own OTP branch if it
  has one, whatever it already does. Confirmed live against the actual
  backend: a wrong password on `/admin/login` and `/volunteer/login` both
  come back `401 Invalid credentials` — the shared page never intercepts or
  short-circuits that. What happens next on the frontend depends on what
  that response looks like, not on any assumption baked into the shared
  page:
  - If it comes back with an `accessToken`, the shared page stores it and
    goes straight to `/<role>/dashboard`. Nothing further for you to build.
  - If it doesn't (your backend replies some other way — an OTP message,
    for instance), the shared page stores `email` in `localStorage` and
    sends the user to `/<role>/login` — a base file already sits there in
    your folder, empty and ready, since only you know what your backend's
    login actually still needs at that point.

Dashboards are per-role too — `app/<role>/dashboard/page.tsx` — not one
shared page. NGO's is a real working example; the other three are empty
base files.
- **`app/register/page.tsx`** (shared) — no form, just links to
  `/<role>/register` for NGO, Volunteer, and Donor. Admin isn't linked here
  since admins aren't self-registered — that's it, no other backend change
  attached to that decision. A base file already sits at
  `app/<role>/register` for all four roles, empty and ready for whatever
  your signup form needs to do.

Whether your role uses OTP, and what your registration/login screens look
like beyond that, is entirely up to whoever owns that role's backend — this
shared layer doesn't assume either way.

## Ground rule about guarded routes still applies

Everything above only covers auth. Once logged in, every other guarded
route (profile, create, update, etc.) still needs `Authorization: Bearer
<token>` read from `localStorage`, same as before — see the "Ground rule"
section above for why one browse route per role needs to stay public for
SSR to work at all.
