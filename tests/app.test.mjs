import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadApp() {
  const code = readFileSync(resolve(PROJECT_ROOT, "app.js"), "utf8");
  const sandbox = {
    console,
    setInterval: () => 1,
    clearInterval: () => {},
    URLSearchParams,
    window: {},
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: "app.js" });
  return sandbox.window.TheCoach;
}

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, String(value)),
  };
}

test("encodes and decodes workout payloads for URL transport", () => {
  const app = loadApp();
  const workout = {
    v: 1,
    title: "Test",
    steps: [{ k: "work", b: "Bloc", t: "Squat", d: "8 reps" }],
  };

  const encoded = app.encodeWorkout(workout);
  const decoded = app.decodeWorkout(encoded);

  assert.match(encoded, /^[A-Za-z0-9_-]+$/);
  assert.equal(JSON.stringify(decoded), JSON.stringify(workout));
});

test("normalizes compact and readable workout schemas", () => {
  const app = loadApp();
  const workout = app.normalizeWorkout({
    title: "Full body",
    athleteNote: "Pas de pompes",
    start: 1,
    quick: [45, 90],
    add: 15,
    steps: [
      { type: "work", block: "A", title: "Row", target: "10 reps", cue: "Tire propre." },
      { k: "rest", b: "A", t: "Pause", s: 60 },
      { k: "timed", b: "B", t: "Carry", seconds: 45 },
    ],
  });

  assert.equal(workout.title, "Full body");
  assert.equal(workout.start, 1);
  assert.deepEqual(workout.quick, [45, 90]);
  assert.equal(workout.add, 15);
  assert.equal(workout.steps[0].kind, "work");
  assert.equal(workout.steps[0].detail, "10 reps");
  assert.equal(workout.steps[1].seconds, 60);
  assert.equal(workout.steps[2].kind, "timed");
});

test("normalizes load, reps, and target seconds for measured work steps", () => {
  const app = loadApp();
  const workout = app.normalizeWorkout({
    title: "Measured work",
    steps: [
      { k: "work", b: "A", t: "Goblet squat", d: "9 reps", kg: 16, reps: 9, s: 36 },
    ],
  });

  assert.equal(workout.steps[0].weightKg, 16);
  assert.equal(workout.steps[0].reps, 9);
  assert.equal(workout.steps[0].seconds, 36);
});

test("normalizes youtube video URLs and preserves step video metadata", () => {
  const app = loadApp();
  const workout = app.normalizeWorkout({
    title: "Videos",
    steps: [
      { k: "work", b: "A", t: "Swing", video: "https://www.youtube.com/watch?v=uMqcv_O7ppI" },
      { k: "timed", b: "B", t: "Respiration", youtube: "https://youtu.be/QUFRhuEvp0g" },
      { k: "rest", b: "B", t: "Pause", s: 60 },
    ],
  });

  assert.equal(workout.steps[0].video, "https://www.youtube-nocookie.com/embed/uMqcv_O7ppI");
  assert.equal(workout.steps[1].video, "https://www.youtube-nocookie.com/embed/QUFRhuEvp0g");
  assert.equal(workout.steps[2].video, "");
  assert.equal(app.youtubeEmbedUrl("https://www.youtube.com/embed/aNDUbH_Uv4g"), "https://www.youtube-nocookie.com/embed/aNDUbH_Uv4g");
});

test("rejects unsupported versions and invalid step entries explicitly", () => {
  const app = loadApp();

  assert.throws(
    () => app.normalizeWorkout({ v: 2, title: "Future", steps: [{ k: "work", b: "A", t: "Row" }] }),
    /Version de seance non supportee/,
  );
  assert.throws(
    () => app.normalizeWorkout({ v: null, title: "Null", steps: [{ k: "work", b: "A", t: "Row" }] }),
    /Version de seance non supportee/,
  );
  assert.throws(
    () => app.normalizeWorkout({ title: "Invalid", steps: [null] }),
    /Etape invalide/,
  );
});

test("normalizing an already normalized workout preserves timed kinds", () => {
  const app = loadApp();
  const first = app.normalizeWorkout({
    title: "Roundtrip",
    steps: [
      { k: "work", b: "A", t: "Row" },
      { k: "rest", b: "A", t: "Pause", s: 60 },
      { k: "timed", b: "B", t: "Carry", s: 45 },
    ],
  });

  const second = app.normalizeWorkout(first);

  assert.equal(second.steps[1].kind, "rest");
  assert.equal(second.steps[2].kind, "timed");
});

test("auto-runs rest and timed steps when entering them", () => {
  const app = loadApp();
  const workout = app.normalizeWorkout({
    title: "Timer",
    steps: [
      { k: "work", b: "A", t: "Row" },
      { k: "rest", b: "A", t: "Pause", s: 2 },
      { k: "timed", b: "A", t: "Carry", s: 3 },
    ],
  });
  const initial = app.createInitialState(workout);

  const rest = app.completeCurrentStep(initial);
  assert.equal(app.currentStep(rest).kind, "rest");
  assert.equal(rest.running, true);
  assert.equal(rest.remainingSeconds, 2);

  const timed = app.tick(app.tick(rest));
  assert.equal(app.currentStep(timed).kind, "timed");
  assert.equal(timed.running, true);
  assert.equal(timed.remainingSeconds, 3);
});

test("auto-runs measured work steps that define target seconds", () => {
  const app = loadApp();
  const workout = app.normalizeWorkout({
    title: "Measured timer",
    steps: [
      { k: "work", b: "A", t: "Swings", kg: 16, reps: 16, s: 2 },
      { k: "rest", b: "A", t: "Pause", s: 60 },
    ],
  });
  const initial = app.createInitialState(workout);

  assert.equal(app.currentStep(initial).kind, "work");
  assert.equal(initial.running, true);
  assert.equal(initial.remainingSeconds, 2);

  const next = app.tick(app.tick(initial));
  assert.equal(app.currentStep(next).kind, "rest");
  assert.equal(next.running, true);
});

test("can jump directly to any workout step", () => {
  const app = loadApp();
  const state = app.createInitialState(
    app.normalizeWorkout({
      title: "Jump",
      steps: [
        { k: "work", b: "A", t: "Row" },
        { k: "rest", b: "A", t: "Pause", s: 60 },
        { k: "timed", b: "B", t: "Carry", s: 45 },
      ],
    }),
  );

  const jumped = app.goToStep(state, 2);

  assert.equal(app.currentStep(jumped).title, "Carry");
  assert.equal(jumped.running, true);
  assert.equal(jumped.remainingSeconds, 45);
});

test("next asks before skipping an uncounted work step", () => {
  const app = loadApp();
  const state = app.createInitialState(
    app.normalizeWorkout({
      title: "Skip",
      steps: [
        { k: "work", b: "A", t: "Swing", kg: 16, reps: 16, s: 32 },
        { k: "rest", b: "A", t: "Pause", s: 60 },
      ],
    }),
  );
  let confirmMessage = "";

  const blocked = app.goToNext(state, (message) => {
    confirmMessage = message;
    return false;
  });
  const skipped = app.goToNext(state, () => true);

  assert.equal(confirmMessage, "Êtes-vous sûr de ne pas avoir fait cette étape ? Elle ne sera pas comptée dans la séance vraiment réalisée.");
  assert.equal(blocked.currentIndex, 0);
  assert.equal(app.currentStep(blocked).title, "Swing");
  assert.equal(skipped.currentIndex, 1);
  assert.equal(app.currentStep(skipped).title, "Pause");
});

test("next does not ask before moving past a rest step", () => {
  const app = loadApp();
  const state = app.goToNext(
    app.createInitialState(
      app.normalizeWorkout({
        title: "Rest skip",
        steps: [
          { k: "work", b: "A", t: "Swing", kg: 16, reps: 16, s: 32 },
          { k: "rest", b: "A", t: "Pause", s: 60 },
          { k: "work", b: "A", t: "Squat", kg: 16, reps: 9, s: 36 },
        ],
      }),
    ),
    () => true,
  );

  const next = app.goToNext(state, () => {
    throw new Error("Rest steps should not ask for skip confirmation.");
  });

  assert.equal(app.currentStep(next).title, "Squat");
});

test("groups the full plan by visible workout rounds", () => {
  const app = loadApp();
  const workout = app.normalizeWorkout(app.DEFAULT_WORKOUT);
  const groups = app.groupStepsByBlock(workout.steps);

  assert.ok(workout.steps.length > 35);
  assert.equal(
    JSON.stringify(groups.map((group) => group.block)),
    JSON.stringify([
      "Swings",
      "Transition",
      "Force 1/3",
      "Force 2/3",
      "Force 3/3",
      "Transition",
      "Carry 1/2",
      "Carry 2/2",
      "Retour au calme",
    ]),
  );
});

test("default workout puts rests between the first swing work sets", () => {
  const app = loadApp();
  const workout = app.normalizeWorkout(app.DEFAULT_WORKOUT);
  const firstSixKinds = workout.steps.slice(0, 6).map((step) => step.kind);

  assert.equal(JSON.stringify(firstSixKinds), JSON.stringify(["work", "rest", "work", "rest", "work", "rest"]));
});

test("ships complementary low-equipment programs", () => {
  const app = loadApp();
  const titles = app.DEFAULT_PROGRAMS.map((program) => program.title);

  assert.ok(app.DEFAULT_PROGRAMS.length >= 4);
  assert.ok(titles.includes("Kettlebell 16 kg"));
  assert.ok(titles.includes("Mobilite + tronc sans materiel"));
  assert.ok(titles.includes("Kettlebell technique courte"));
  assert.ok(titles.includes("Gainage + carries minimal"));
});

test("default programs never expose ranged repetition targets", () => {
  const app = loadApp();
  const exported = app.exportProgramLibrary(app.DEFAULT_PROGRAMS);

  assert.equal(/\b\d+\s*(?:a|à|-)\s*\d+\s*reps\b/i.test(exported), false);
});

test("stores the program library in localStorage when no library exists yet", () => {
  const app = loadApp();
  const storage = createMemoryStorage();

  const library = app.loadProgramLibrary(storage);
  const saved = JSON.parse(storage.getItem(app.PROGRAM_LIBRARY_STORAGE_KEY));

  assert.ok(library.length >= 4);
  assert.equal(saved.programs.length, library.length);
  assert.equal(saved.programs[0].title, "Kettlebell 16 kg");
});

test("exports the local program library as reusable JSON", () => {
  const app = loadApp();
  const library = app.normalizeProgramLibrary([
    {
      id: "custom",
      title: "Custom minimal",
      steps: [{ k: "work", b: "A", t: "Squat", kg: 16, reps: 8, s: 32 }],
    },
  ]);

  const exported = JSON.parse(app.exportProgramLibrary(library));

  assert.equal(exported.v, 1);
  assert.equal(exported.programs.length, 1);
  assert.equal(exported.programs[0].id, "custom");
  assert.equal(exported.programs[0].steps[0].title, "Squat");
});

test("default workout gives every non-rest action an embeddable video", () => {
  const app = loadApp();
  const workout = app.normalizeWorkout(app.DEFAULT_WORKOUT);
  const actions = workout.steps.filter((step) => step.kind !== "rest");

  assert.ok(actions.length > 0);
  assert.equal(actions.every((step) => /^https:\/\/www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]+$/.test(step.video)), true);
});

test("computes total lifted weight and target kilograms per minute for a workout", () => {
  const app = loadApp();
  const workout = app.normalizeWorkout({
    title: "Metrics",
    steps: [
      { k: "work", b: "A", t: "Swing", kg: 16, reps: 16, s: 32 },
      { k: "rest", b: "A", t: "Pause", s: 28 },
      { k: "work", b: "A", t: "Row", kg: 16, reps: 16, s: 60 },
    ],
  });

  const metrics = app.workoutMetrics(workout);

  assert.equal(metrics.totalWeightKg, 512);
  assert.equal(metrics.targetSeconds, 120);
  assert.equal(metrics.kgPerMinute, 256);
});

test("session clock accumulates elapsed seconds across play, pause, and stop", () => {
  const app = loadApp();
  const clock = app.createSessionClock({ date: "2026-06-10", now: 1000 });

  const running = app.playSessionClock(clock, 1000);
  assert.equal(app.elapsedSessionSeconds(running, 3500), 2);

  const paused = app.pauseSessionClock(running, 4000);
  assert.equal(paused.running, false);
  assert.equal(app.elapsedSessionSeconds(paused, 9000), 3);

  const resumed = app.playSessionClock(paused, 9000);
  const stopped = app.stopSessionClock(resumed, 12000);
  assert.equal(stopped.running, false);
  assert.equal(stopped.stopped, true);
  assert.equal(app.elapsedSessionSeconds(stopped, 20000), 6);
});

test("formats the live session date label in French", () => {
  const app = loadApp();

  assert.equal(app.formatSessionDateLabel("2026-05-24T12:00:00.000Z"), "24 mai 2026");
});

test("stores notes per step without losing navigation state", () => {
  const app = loadApp();
  const state = app.createInitialState(
    app.normalizeWorkout({
      title: "Notes",
      steps: [{ k: "work", b: "A", t: "Deadlift" }],
    }),
  );

  const withNote = app.updateCurrentNote(state, "RPE 7, facile.");

  assert.equal(withNote.notes[app.currentStep(state).id], "RPE 7, facile.");
  assert.equal(withNote.currentIndex, 0);
});

test("builds a completed action record from the click-time remaining timer", () => {
  const app = loadApp();
  const workout = app.normalizeWorkout({
    title: "Completion",
    steps: [
      { id: "swing", k: "work", b: "A", t: "Swing", d: "16 reps", kg: 16, reps: 16, s: 32 },
      { id: "pause", k: "rest", b: "A", t: "Pause", s: 60 },
    ],
  });
  const state = {
    ...app.createInitialState(workout),
    remainingSeconds: 12,
    notes: {
      swing: "Propres.",
    },
  };

  const record = app.buildStepCompletionRecord(state, "2026-06-12T10:00:00.000Z");

  assert.equal(record.date, "2026-06-12");
  assert.equal(record.completedAt, "2026-06-12T10:00:00.000Z");
  assert.equal(record.index, 1);
  assert.equal(record.stepId, "swing");
  assert.equal(record.title, "Swing");
  assert.equal(record.kind, "work");
  assert.equal(record.targetSeconds, 32);
  assert.equal(record.elapsedSeconds, 20);
  assert.equal(record.remainingSeconds, 12);
  assert.equal(record.weightKg, 16);
  assert.equal(record.reps, 16);
  assert.equal(record.volumeKg, 256);
  assert.equal(record.note, "Propres.");
});

test("stores completed actions per workout program and local session date", () => {
  const app = loadApp();
  const storage = createMemoryStorage();
  const workout = app.normalizeWorkout({
    title: "Program A",
    steps: [
      { id: "row", k: "work", b: "A", t: "Row", d: "8 reps", kg: 16, reps: 8, s: 24 },
    ],
  });
  const state = {
    ...app.createInitialState(workout),
    remainingSeconds: 4,
  };

  const record = app.recordCompletedStep(state, storage, "2026-06-12T10:00:00.000Z");
  const key = app.completedActionsStorageKey(workout, "2026-06-12T10:00:00.000Z");
  const otherDateKey = app.completedActionsStorageKey(workout, "2026-06-13T10:00:00.000Z");
  const saved = JSON.parse(storage.getItem(key));

  assert.equal(record.elapsedSeconds, 20);
  assert.equal(saved.date, "2026-06-12");
  assert.equal(saved.workoutTitle, "Program A");
  assert.equal(saved.actions.length, 1);
  assert.equal(saved.actions[0].stepId, "row");
  assert.equal(saved.actions[0].elapsedSeconds, 20);
  assert.equal(storage.getItem(otherDateKey), null);
});

test("forced rests do not reassign notes to shifted workout steps", () => {
  const app = loadApp();
  const state = app.createInitialState(
    app.normalizeWorkout({
      title: "Notes",
      steps: [
        { k: "work", b: "A", t: "Row" },
        { k: "work", b: "A", t: "Deadlift" },
      ],
    }),
  );
  const withNote = app.updateCurrentNote(state, "Note row");

  const withForcedRest = app.forceRest(withNote, 30);
  const afterRest = app.completeCurrentStep(withForcedRest);
  const markdown = app.buildMarkdownSummary(afterRest);
  const pauseIndex = markdown.indexOf("Pause 30 s");
  const rowIndex = markdown.indexOf("Row");

  assert.ok(pauseIndex >= 0);
  assert.ok(rowIndex > pauseIndex);
  assert.match(markdown, /Row[\s\S]*Note row/);
  assert.equal(markdown.slice(pauseIndex, rowIndex).includes("Note row"), false);
});

test("parses encoded URL workouts and reports malformed payloads", () => {
  const app = loadApp();
  const workout = {
    v: 1,
    title: "URL workout",
    steps: [{ k: "work", b: "A", t: "Row" }],
  };

  const parsed = app.parseWorkoutFromUrl(`?p=${app.encodeWorkout(workout)}`);
  const malformed = app.parseWorkoutFromUrl("?p=not-base64");

  assert.equal(parsed.source, "url");
  assert.equal(parsed.workout.title, "URL workout");
  assert.equal(malformed.source, "default");
  assert.match(malformed.error, /invalide|Unexpected|JSON/i);
});

test("generates a markdown summary for AI handoff", () => {
  const app = loadApp();
  const workout = app.normalizeWorkout({
    title: "Kettlebell",
    athleteNote: "Eviter les pompes.",
    steps: [
      { k: "work", b: "Force", t: "Goblet squat", d: "10 reps" },
      { k: "rest", b: "Force", t: "Pause", s: 60 },
    ],
  });
  const state = {
    ...app.createInitialState(workout),
    notes: {
      [workout.steps[0].id]: "OK, RPE 8",
      [workout.steps[1].id]: "Respiration revenue.",
    },
    done: true,
  };

  const markdown = app.buildMarkdownSummary(state);

  assert.match(markdown, /^# Seance - Kettlebell/m);
  assert.match(markdown, /Eviter les pompes\./);
  assert.match(markdown, /Goblet squat/);
  assert.match(markdown, /OK, RPE 8/);
});

test("builds a dated live session JSON for AI storage", () => {
  const app = loadApp();
  const workout = app.normalizeWorkout({
    title: "Kettlebell",
    athleteNote: "Eviter les pompes.",
    steps: [
      { id: "squat", k: "work", b: "Force", t: "Goblet squat", d: "10 reps", video: "https://www.youtube.com/watch?v=aNDUbH_Uv4g" },
      { id: "pause", k: "rest", b: "Force", t: "Pause", s: 60 },
    ],
  });
  const state = {
    ...app.createInitialState(workout),
    notes: {
      squat: "RPE 8",
    },
  };
  const clock = app.pauseSessionClock(app.playSessionClock(app.createSessionClock({ date: "2026-05-24", now: 1000 }), 1000), 62000);

  const journal = app.buildLiveSessionJson(state, clock, "2026-05-24T12:00:00.000Z");

  assert.equal(journal.title, "Séance du 24 mai 2026");
  assert.equal(journal.elapsedSeconds, 61);
  assert.equal(journal.current.index, 1);
  assert.equal(journal.steps[0].note, "RPE 8");
  assert.equal(journal.steps[0].video, "https://www.youtube-nocookie.com/embed/aNDUbH_Uv4g");
  assert.equal(journal.steps[1].note, "");
});

test("includes stored completed actions in the live session JSON", () => {
  const app = loadApp();
  const workout = app.normalizeWorkout({
    title: "Kettlebell",
    steps: [
      { id: "swing", k: "work", b: "A", t: "Swing", kg: 16, reps: 16, s: 32 },
    ],
  });
  const state = app.createInitialState(workout);
  const completion = app.buildStepCompletionRecord(
    {
      ...state,
      remainingSeconds: 10,
    },
    "2026-05-24T12:00:00.000Z",
  );

  const journal = app.buildLiveSessionJson(state, app.createSessionClock({ date: "2026-05-24", now: 1000 }), "2026-05-24T12:00:00.000Z", [completion]);

  assert.equal(journal.completedActions.length, 1);
  assert.equal(journal.completedActions[0].stepId, "swing");
  assert.equal(journal.completedActions[0].elapsedSeconds, 22);
  assert.equal(journal.completedActions[0].volumeKg, 256);
});

test("default workout avoids pushups", () => {
  const app = loadApp();
  const titles = app.DEFAULT_WORKOUT.steps.map((step) => step.t || step.title);

  assert.equal(titles.some((title) => /pompes|push/i.test(title)), false);
  assert.equal(/pompes|push/i.test(JSON.stringify(app.DEFAULT_WORKOUT)), false);
});

test("music opens a public YouTube playlist instead of local audio", () => {
  const app = loadApp();

  assert.match(app.MUSIC_PLAYLIST_URL, /^https:\/\/www\.youtube\.com\/playlist\?list=/);
});
