# SchreckNet QA

This directory holds the durable artifacts for SchreckNet's end-to-end QA workflow. Everything here is meant to be re-used across runs and to survive worktree cleanup.

## Layout

```
docs/qa/
├── README.md                       — this file
├── test-flow.md                    — self-contained prompt to drive a full QA pass
├── prompts/
│   ├── fix-bugs.md                 — prompt template to fix bugs from a QA report
│   └── extend-coverage.md          — prompt template to fill coverage gaps from a QA report
└── reports/
    ├── YYYY-MM-DD-<feature>.md     — archived QA report per run
    └── YYYY-MM-DD-<feature>-screenshots/
        └── *.png
```

## How to use

### Run a new QA pass

Paste [test-flow.md](test-flow.md) verbatim into a new Claude Code session. It is self-contained: it sets up a fresh worktree off `origin/main`, installs deps, starts MySQL/dev servers, authenticates, drives the priority-ordered test scope (P1 character creation → P2 XP Log + Undo → P3 cross-cutting → P4 stress), and outputs a new dated report under [reports/](reports/).

Realistic full pass: 60-90 minutes. The flow has explicit guidance for time-budget compromises.

### Fix bugs found in a QA report

Open [prompts/fix-bugs.md](prompts/fix-bugs.md). The template currently targets the 2026-05-15 XP Log + Undo run; if a newer report is the source of truth, edit the report-path/date references at the top of the template before pasting. Then paste into a new Claude Code session.

The template enforces TDD: write a failing test reproducing the bug, then fix, then verify with a manual repro.

### Extend coverage from a QA report

Open [prompts/extend-coverage.md](prompts/extend-coverage.md). Same retargeting note as above. Drives a second-round QA pass focused on whatever the prior report listed in §4 ("Flows not tested"). Outputs a new dated report that links back to its predecessor.

## Reports

| Date | Feature | Report | Headline |
|---|---|---|---|
| 2026-05-15 | XP Log + Undo (PR #281, merged at `54343a3`) | [reports/2026-05-15-xp-log.md](reports/2026-05-15-xp-log.md) | 1 High bug (multi-buy advantage/flaw undo overshoots intermediate state); 1 Low cosmetic; 1 pre-existing Low |

When you add a new report, append a row here so the trail is easy to follow.

## Conventions

- **Reports are append-only.** Don't edit prior reports retroactively (except to fix typos or to add a "Status: fixed in commit X" note at the top). When you do a follow-up run, write a new dated report and link back to the predecessor.
- **Screenshots go alongside.** `reports/2026-05-15-xp-log-screenshots/` — same date stem as the report. Use relative paths from the report (e.g. `[…](2026-05-15-xp-log-screenshots/foo.png)`).
- **The QA worktree is throwaway.** Reports and prompts live here in the repo; the actual test run uses `.worktrees/qa-<date>/` which can be removed once the report is filed.
- **Prompts are templates.** They have a date-stamped "as of …" reference at the top. Re-date them when retargeting; don't fork them per-run unless the template structure itself needs to change.
