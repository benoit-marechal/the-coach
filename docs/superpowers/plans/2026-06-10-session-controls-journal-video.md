# Session Controls, Journal, and Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a global workout session controller, live dated JSON journal, movement videos, and fix the notes/annex layout overlap.

**Architecture:** Keep the existing vanilla JS single-file engine and DOM renderer. Add small pure functions for global timer state, French session date labels, video URL normalization, and live session JSON generation, then bind them to compact UI controls in `index.html` and `style.css`.

**Tech Stack:** Vanilla JS, HTML, CSS, Node test runner, GitHub Pages.

---

### Task 1: Engine Behaviors

**Files:**
- Modify: `app.js`
- Test: `tests/app.test.mjs`

- [x] Add failing tests for session timer state, French date label, video URL normalization, and live session JSON.
- [x] Run `node --test tests/app.test.mjs` and verify the new tests fail for missing functions.
- [x] Implement pure helpers in `app.js`: `createSessionClock`, `playSessionClock`, `pauseSessionClock`, `stopSessionClock`, `elapsedSessionSeconds`, `formatSessionDateLabel`, `youtubeEmbedUrl`, and `buildLiveSessionJson`.
- [x] Run `node --test tests/app.test.mjs` and verify all tests pass.

### Task 2: Default Program Video Metadata

**Files:**
- Modify: `app.js`
- Test: `tests/app.test.mjs`

- [x] Add failing tests proving default movement steps expose embeddable YouTube video URLs and rest steps do not require video.
- [x] Run the test command and verify failure.
- [x] Add `video` URLs to the default workout movement steps and accept `video`, `youtube`, and `u` aliases in `normalizeStep`.
- [x] Run the test command and verify success.

### Task 3: UI Rendering

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`

- [x] Add top session controls: a large Play/Pause/Stop button group and a global elapsed timer.
- [x] Add a current-step video panel using an iframe with `youtube-nocookie.com`.
- [x] Rename annex labels to `Programme de seance`, `Programme partageable`, and add `Seance du DATE`.
- [x] Make the dated session JSON textarea readonly and clickable to copy, with a small notification element.
- [x] Make `A ton rythme` render as a compact tempo text instead of the large timer style.
- [x] Fix layout so annex panels cannot overlap the note area when content height grows.

### Task 4: Verification and Publication

**Files:**
- Modify: `QCD.md`
- Modify: `CLAUDE.md`

- [x] Document LOT 3 constraints and schema additions.
- [x] Run `node --test tests/app.test.mjs`, `node --check app.js`, and `git diff --check`.
- [x] Verify in browser at 1280x720 and screenshot-like viewport that note and annex panels do not overlap.
- [ ] Verify production URL after push.
