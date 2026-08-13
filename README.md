# payout-service

A small NestJS service that manages contractor payout requests: employees submit
requests, managers approve or reject them, finance pays approved ones out.

This repository is also a **teaching fixture** for AI code-review demos: pull
requests here get reviewed by several AI agents wired up as GitHub Actions
(see `.github/workflows/`). The reviews are triggered by labels — add
`review:all` (or `review:claude`, `review:codex`, `review:pi`,
`review:opencode`) to a PR to fire them.

A sixth label, `review:security`, runs a narrower job: Claude Code delegates to
the read-only `security-review` sub-agent defined in `.claude/agents/`, which
sweeps the diff against a fixed payments-security checklist.

## Domain

- `POST /payouts` — an employee submits a payout request (amount, currency,
  reason, approval deadline).
- `GET /payouts/mine` — an employee lists their own requests.
- `GET /payouts/:id` — owner, managers, and finance can view a request.

Identity is demo-grade: callers identify with an `x-user-id` header matching a
seeded employee (`src/employees/employees.service.ts`). There is no database;
state is in-memory.

## Run

```sh
npm install
npm run start:dev
# in another terminal:
curl -s -X POST localhost:3000/payouts \
  -H 'content-type: application/json' -H 'x-user-id: emp-001' \
  -d '{"amount": 1200, "currency": "USD", "reason": "Contract milestone payment", "approvalDeadline": "2026-09-01"}'
```

## Test

```sh
npm test
```
