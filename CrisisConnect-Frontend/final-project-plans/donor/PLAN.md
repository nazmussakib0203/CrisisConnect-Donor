# Donor — Final Project Plan

Unlike the other three roles, `src/donor/` in `CrisisConnect-Backend` is
still just the starter stub (`GET /donor` health check only) — the entities
(`Donor`, `Donation`, `Payment`, `Receipt`) exist, but no real routes yet.
Whether you add an OTP step or not is entirely your call — nothing here
requires it either way.

## Backend routes to build (minimum)

`DonorGuard` needs writing from scratch — a guard that reads the
`Authorization: Bearer <token>` header, verifies it, and checks the
payload's role is `DONOR`.

| Verb | Route | Guarded? | Body / notes |
|---|---|---|---|
| POST | `/donor/signup` | no | `{ email, password, fullName, city, country?, uniqueId }` — see below |
| POST | `/donor/login` | no | `{ email, password }` → however you want to respond (a token directly, or an OTP step first — your choice) |
| GET | `/donor/profile` | yes | identity from the token |
| PUT | `/donor/profile` | yes | `{ fullName, city, country }` |
| PATCH | `/donor/profile/country` | yes | `{ country }` |
| GET | `/donor/donation-call` | **no** | reads NGO's `DonationCall` entity — register it in `donor.module.ts`'s `forFeature`. Public on purpose — see the root `README.md` in this folder. Optional filters: `?status=`, `?crisisId=` |
| POST | `/donor/donation` | yes | `{ donationCallId, amount, message }` → creates a `Donation` row, `status: "INITIATED"` |
| GET | `/donor/donation` | yes | your own donations only (scope by the token's `userId`) |
| DELETE | `/donor/donation/:id` | yes | only if still `INITIATED` — otherwise 400/404 |
| GET | `/donor` | **no** | list donors — `fullName, city, country, joiningDate` only, never the linked `user` row. Optional filters: `?country=`, `?city=` |

`uniqueId` on signup: a donor-chosen public identifier, required and
unique.

`amount` is a `decimal` column — Postgres returns it as a string, so keep it
typed as `string` on the entity and DTO, same note already in the backend
repo's `AGENTS.md` under "Known TypeORM gotchas."

Skip entirely for now (see Optional below): `Payment`, `Receipt`, and the
`crisis_follow` M:N (follow/unfollow a crisis). None of them are needed to
hit the numbers below.

Auth pages work like every role — see the root `README.md` in this folder
for the shared-flow explanation. In short: `app/login` and `app/register`
are shared and already built. `app/donor/register/page.tsx` and
`app/donor/login/page.tsx` are empty base files sitting in your own folder
already, ready for whatever your signup/login screens need.

## Pages to build

| Route | CSR/SSR | Data | Axios call |
|---|---|---|---|
| `/` | SSR | first 3 open campaigns | `GET /donor/donation-call` |
| `/donor/register` | CSR | — | `POST /donor/signup` |
| `/donor/login` | CSR | — (shared `/login` already did email+password; only used if your login doesn't return a token right away) | whatever your backend's login still needs, if anything |
| `/donor/dashboard` | CSR | your donor profile | `GET /donor/profile` |
| `/campaigns` | SSR | all open campaigns (folder-based route) | `GET /donor/donation-call` |
| `/campaigns/loading.tsx` | — | loading UI while the fetch runs | — |
| `/campaigns/[id]` | SSR | one campaign (dynamic route) | reuses the same `GET /donor/donation-call` list, find by id server-side |
| `/campaigns/[id]` → `notFound()` | — | call `notFound()` when the id isn't in the list, which renders `not-found.tsx` | — |
| `/campaigns/[id]` "Donate" form | CSR (client component nested in the SSR page) | amount + message | `POST /donor/donation` |
| `/donations` | CSR | your donations + a cancel button | `GET /donor/donation`, `DELETE /donor/donation/:id` |
| `/profile/edit` | CSR | edit form + country field | `PUT /donor/profile`, `PATCH /donor/profile/country` |
| `/donors` | SSR | public donor list | `GET /donor` |

That's 12 Axios call sites (4 SSR — home teaser, campaign list, campaign
detail, donor list — and 8 CSR). The shared `/login` page's own two calls
(`GET /auth/role`, `POST /donor/login`) are extra on top of this since
they're common code, not donor-specific.

## Auth + validation

Zod validation on every form, one `error` string per form, `localStorage`
for the token and a display name, `Authorization: Bearer <token>` attached
on every guarded call.

## Required components (no styling opinions here — just what has to exist)

- A Navbar (shared via `app/layout.tsx`)
- Campaign cards for each list item
- A carousel somewhere reasonable — the home page teaser is the natural fit

## Optional — skip unless you want extra scope

- Payment + Receipt (`POST /donor/donation/:id/pay`, `GET
  /donor/receipt/:id`) — a full 1:1 chain on top of donations. Extra
  entities, extra explaining, no extra marks. Add it only if you want more
  to show.
- Crisis follow/unfollow (`POST/DELETE /donor/crisis/:id/follow`) — a
  many-to-many on top of everything above, same reasoning: nice extra, not
  required.
- PusherJS notification (bonus 5 marks) — e.g. notify the NGO when a
  donation comes in. Skip unless you specifically want the extra 5 marks.
