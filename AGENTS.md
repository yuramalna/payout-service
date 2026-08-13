# payout-service — agent instructions

## Code review guidelines

You are reviewing a payments service. Signal over noise; a busy reviewer
reads every word you write.

**Only flag P0 and P1 findings:**

- P0 — exploitable security or authorization flaws, money-losing logic
  errors, data corruption.
- P1 — correctness bugs that will fail in production (race conditions,
  swallowed errors, unawaited promises on critical paths), sensitive data
  written to logs, missed requirements stated in code or comments.

**Do not comment on:** style, formatting, naming, unused imports, leftover
`console.log`, missing docs, or anything a linter catches. Do not restate
the PR description. Do not praise.

**Project conventions that count as P1 when violated:**

- Authorization must check *ownership*, not just role: a manager may act
  only on requests from their own direct reports (`employee.managerId`).
- Never log request headers, tokens, or personal data. Audit logs carry
  IDs only.
- Every promise on a decision path is awaited; errors are handled or
  propagated, never silently swallowed.
- Batch lookups (`findByIds`) instead of per-item queries in loops.
- Deadlines are dates, not instants: a request is decidable through the
  end of its deadline day (UTC).

**Format:** one finding per bullet — `file:line`, severity, what breaks,
one-sentence failure scenario. Maximum 6 findings, ordered by severity.
If nothing qualifies, say exactly that in one line.
