# JUPHD Care — Product Roadmap

**Last updated:** 2026-03-12
**Owner:** @51D4R74
**Status:** Planning — no sprint started yet

---

## Vision

Daily self-care companion + organizational psychosocial risk radar.
Two products in one: personal well-being tool (collaborator) + aggregate analytics sensor (HR).

## Guiding principles

1. **Sky ≠ Halo** — Emotional state and self-care consistency are independent variables.
2. **Score what matters** — Points reward care, constancy, and support. Never emotion, never reporting.
3. **Compassionate by default** — No punitive streaks, no rankings, no shame mechanics.
4. **Privacy-first** — HR sees aggregates, never individual nominal data.
5. **Web-first** — Ship as PWA. Native decision deferred post-validation.

---

## Milestones

| Milestone | Sprints | Goal | Success criteria |
| --------- | ------- | ---- | ---------------- |
| **M0 — Foundation** | S1–S2 | Adapt existing code to new product model | New check-in flow works e2e with mock backend; SkyHeader renders 4 visual states; ScoreCard displays 3 domains |
| **M1 — Daily Loop** | S3–S4 | Core loop functional: check-in → scores → missions → points | User completes check-in, sees updated scores, receives 3–4 missions, earns Solar Points — all in one session |
| **M2 — Support & Protection** | S5–S6 | Support layer live: curated messages, Modo Respiro, microchecks | User in distress can receive support message, activate Modo Respiro, and complete simplified mission set |
| **M3 — History & Discoveries** | S7–S8 | User sees evolution over time; tags generate private correlations | User with 14+ days of data sees at least 1 discovery; weekly report renders correctly |
| **M4 — Collective** | S9–S10 | Team challenges and aggregate progress visible | Team mission shows real-time aggregate progress; RH dashboard displays live aggregate data |
| **M5 — Polish & Onboarding** | S11–S12 | Product-complete for internal pilot | New user understands product in ≤ 60s onboarding; E2E tests cover critical paths; bundle < 300 KB gzipped |

## Sprint cadence

- **Duration:** 2 weeks per sprint
- **Demo:** End of each sprint, working software
- **Backlog:** `.github/issues/M{n}-*.md`

---

## What ships when

```text
S1─S2          S3─S4          S5─S6          S7─S8          S9─S10        S11─S12
 M0              M1             M2             M3             M4            M5
Foundation     Daily Loop     Support        History        Collective    Polish

SkyHeader      Dashboard v2   SupportCenter  MeuCuidado    TeamChallenge Settings
ScoreCard      MissionCenter  Modo Respiro   Tags+Insight  CéuColetivo   Onboarding
Checkin v2     Pontos Solares Biblioteca     Reports       RH Dashboard  E2E Tests
OneTapMood     Mission Engine Microcheck     Discoveries   TeamProgress  Performance
ScoreEngine    Persistência   Proteção v2    Constância    Marcos        Cleanup
```

---

## Out of scope (deferred beyond M5)

| Feature | Reason | Revisit when |
| ------- | ------ | ------------ |
| LLM Advisor / Chatbot | AI infra cost undefined; needs clinical validation | Post-pilot, if engagement data supports it |
| Native push notifications | Requires service worker + permission UX + cross-browser testing | Post-M5, after in-app notifications prove useful |
| Audio support messages | Moderation pipeline is a separate engineering project | V2, if text-only messages show adoption |
| Calendar integration | Enterprise B2B scope, not MVP | V2, driven by sales feedback |
| Shareable report with public link | LGPD risk; requires legal review | Post legal sign-off |
| React Native migration | Platform decision deferred; web-first is pragmatic | Sprint 0 migration if mobile metrics demand it |

---

## Backend coordination checkpoints

Frontend uses local stubs (localStorage + mock data) until each backend delivery.

| Sprint | Backend must deliver |
| ------ | ------------------- |
| S2 | API contract for new check-in (`POST /api/checkins` schema + endpoint) |
| S3 | `GET /api/scores/user/:id/today` (even simplified calculation) |
| S4 | Missions CRUD + Solar Points ledger |
| S6 | Support messages CRUD + basic moderation flag |
| S8 | History aggregation queries + discovery data |
| S10 | Team challenges + RH aggregate endpoints |

---

## Key metrics (post-launch)

| Metric | Target | Measurement |
| ------ | ------ | ----------- |
| D1 retention | ≥ 70% | Users who return day after first check-in |
| D7 retention | ≥ 40% | Users active 7 days after registration |
| D30 retention | ≥ 25% | Users active 30 days after registration |
| Check-in completion rate | ≥ 80% | Started check-ins that reach submission |
| Mission engagement | ≥ 50% | Users who complete ≥ 1 mission/day |
| Time to first value | ≤ 90s | Registration → first check-in submitted |
| Modo Respiro activation | Tracked | Users who enter Modo Respiro (no target — observation) |
| Support message usage | Tracked | Messages requested/day (no target — observation) |

---

## Architecture decision records

| ADR | Decision | Status |
| --- | -------- | ------ |
| ADR-001 | Replace 3-moment EMA with single daily check-in | Proposed |
| ADR-002 | Sky state and Solar Halo as independent visual layers | Accepted |
| ADR-003 | Client-side score engine with localStorage until backend ready | Proposed |
| ADR-004 | Curated message library before community moderation | Accepted |
