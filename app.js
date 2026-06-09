(function () {
  const MAX_STEPS = 120;
  const MIN_SECONDS = 1;
  const MAX_SECONDS = 7200;
  const MUSIC_PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLRPR8uJQx5tFv7_Uez_8W1tK2jtoC9A3q";

  const DEFAULT_WORKOUT = {
    v: 1,
    title: "Kettlebell 16 kg",
    athleteNote: "Eviter le volume de poussee devant.",
    start: 0,
    quick: [60, 90],
    add: 30,
    steps: [
      { k: "work", b: "Swings", t: "Swings 2 mains", d: "16 reps", c: "Hanches explosives, dos neutre." },
      { k: "work", b: "Swings", t: "Swings 2 mains", d: "16 reps", c: "Reste explosif, stop si le bas du dos prend." },
      { k: "work", b: "Swings", t: "Swings 2 mains", d: "16 reps", c: "Garde 2 reps en reserve." },
      { k: "rest", b: "Swings", t: "Pause", s: 90 },
      { k: "work", b: "Swings", t: "Swings 2 mains", d: "12 a 16 reps", c: "Garde 2 reps en reserve." },
      { k: "rest", b: "Transition", t: "Pause avant force", s: 120 },
      { k: "work", b: "Force 1/3", t: "Goblet squat", d: "8 a 10 reps" },
      { k: "rest", b: "Force 1/3", t: "Pause", s: 60 },
      { k: "work", b: "Force 1/3", t: "Row 1 bras", d: "8 gauche + 8 droit" },
      { k: "rest", b: "Force 1/3", t: "Pause", s: 60 },
      { k: "work", b: "Force 1/3", t: "Kettlebell deadlift", d: "8 a 10 reps" },
      { k: "rest", b: "Force 1/3", t: "Pause avant tour 2", s: 90 },
      { k: "work", b: "Force 2/3", t: "Goblet squat", d: "8 a 10 reps" },
      { k: "rest", b: "Force 2/3", t: "Pause", s: 60 },
      { k: "work", b: "Force 2/3", t: "Row 1 bras", d: "8 gauche + 8 droit" },
      { k: "rest", b: "Force 2/3", t: "Pause", s: 60 },
      { k: "work", b: "Force 2/3", t: "Kettlebell deadlift", d: "8 a 10 reps" },
      { k: "rest", b: "Force 2/3", t: "Pause avant tour 3", s: 90 },
      { k: "work", b: "Force 3/3", t: "Goblet squat", d: "8 a 10 reps" },
      { k: "rest", b: "Force 3/3", t: "Pause", s: 60 },
      { k: "work", b: "Force 3/3", t: "Row 1 bras", d: "8 gauche + 8 droit" },
      { k: "rest", b: "Force 3/3", t: "Pause", s: 60 },
      { k: "work", b: "Force 3/3", t: "Kettlebell deadlift", d: "8 a 10 reps" },
      { k: "rest", b: "Transition", t: "Pause avant carries", s: 120 },
      { k: "work", b: "Carry 1/2", t: "Suitcase hold/carry droite", d: "45 s", s: 45 },
      { k: "rest", b: "Carry 1/2", t: "Pause", s: 30 },
      { k: "work", b: "Carry 1/2", t: "Suitcase hold/carry gauche", d: "45 s", s: 45 },
      { k: "rest", b: "Carry 1/2", t: "Pause avant tour 2", s: 60 },
      { k: "work", b: "Carry 2/2", t: "Suitcase hold/carry droite", d: "45 s", s: 45 },
      { k: "rest", b: "Carry 2/2", t: "Pause", s: 30 },
      { k: "work", b: "Carry 2/2", t: "Suitcase hold/carry gauche", d: "45 s", s: 45 },
      { k: "rest", b: "Retour au calme", t: "Pause avant retour au calme", s: 60 },
      { k: "timed", b: "Retour au calme", t: "Respiration lente", d: "2 min", s: 120 },
      { k: "timed", b: "Retour au calme", t: "Etirement hanches/ischios droite", d: "30 s", s: 30 },
      { k: "timed", b: "Retour au calme", t: "Etirement hanches/ischios gauche", d: "30 s", s: 30 },
    ],
  };

  const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  function utf8Bytes(input) {
    const text = String(input);
    const bytes = [];
    for (let i = 0; i < text.length; i += 1) {
      let code = text.charCodeAt(i);
      if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
        const next = text.charCodeAt(i + 1);
        if (next >= 0xdc00 && next <= 0xdfff) {
          code = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00);
          i += 1;
        }
      }
      if (code <= 0x7f) {
        bytes.push(code);
      } else if (code <= 0x7ff) {
        bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
      } else if (code <= 0xffff) {
        bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
      } else {
        bytes.push(
          0xf0 | (code >> 18),
          0x80 | ((code >> 12) & 0x3f),
          0x80 | ((code >> 6) & 0x3f),
          0x80 | (code & 0x3f),
        );
      }
    }
    return bytes;
  }

  function utf8String(bytes) {
    let result = "";
    for (let i = 0; i < bytes.length; i += 1) {
      const first = bytes[i];
      let code = first;
      if (first >= 0xf0) {
        code = ((first & 0x07) << 18) | ((bytes[++i] & 0x3f) << 12) | ((bytes[++i] & 0x3f) << 6) | (bytes[++i] & 0x3f);
      } else if (first >= 0xe0) {
        code = ((first & 0x0f) << 12) | ((bytes[++i] & 0x3f) << 6) | (bytes[++i] & 0x3f);
      } else if (first >= 0xc0) {
        code = ((first & 0x1f) << 6) | (bytes[++i] & 0x3f);
      }
      if (code > 0xffff) {
        code -= 0x10000;
        result += String.fromCharCode(0xd800 + (code >> 10), 0xdc00 + (code & 0x3ff));
      } else {
        result += String.fromCharCode(code);
      }
    }
    return result;
  }

  function base64UrlEncode(text) {
    const bytes = utf8Bytes(text);
    let output = "";
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i];
      const b = bytes[i + 1];
      const c = bytes[i + 2];
      const triple = (a << 16) | ((b || 0) << 8) | (c || 0);
      output += BASE64_CHARS[(triple >> 18) & 63];
      output += BASE64_CHARS[(triple >> 12) & 63];
      output += i + 1 < bytes.length ? BASE64_CHARS[(triple >> 6) & 63] : "=";
      output += i + 2 < bytes.length ? BASE64_CHARS[triple & 63] : "=";
    }
    return output.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function base64UrlDecode(value) {
    const padded = String(value).replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(String(value).length / 4) * 4, "=");
    const bytes = [];
    for (let i = 0; i < padded.length; i += 4) {
      const c1 = BASE64_CHARS.indexOf(padded[i]);
      const c2 = BASE64_CHARS.indexOf(padded[i + 1]);
      const c3 = padded[i + 2] === "=" ? -1 : BASE64_CHARS.indexOf(padded[i + 2]);
      const c4 = padded[i + 3] === "=" ? -1 : BASE64_CHARS.indexOf(padded[i + 3]);
      if (c1 < 0 || c2 < 0 || (c3 < 0 && padded[i + 2] !== "=") || (c4 < 0 && padded[i + 3] !== "=")) {
        throw new Error("Encodage Base64URL invalide.");
      }
      const triple = (c1 << 18) | (c2 << 12) | ((c3 < 0 ? 0 : c3) << 6) | (c4 < 0 ? 0 : c4);
      bytes.push((triple >> 16) & 255);
      if (c3 >= 0) bytes.push((triple >> 8) & 255);
      if (c4 >= 0) bytes.push(triple & 255);
    }
    return utf8String(bytes);
  }

  function encodeWorkout(workout) {
    return base64UrlEncode(JSON.stringify(workout));
  }

  function decodeWorkout(encoded) {
    return JSON.parse(base64UrlDecode(encoded));
  }

  function stringValue(value, fallback) {
    if (typeof value !== "string") return fallback;
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  function secondsValue(value, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, Math.round(numeric)));
  }

  function normalizeStep(rawStep, index) {
    if (!rawStep || typeof rawStep !== "object" || Array.isArray(rawStep)) {
      throw new Error(`Etape invalide a l'index ${index + 1}.`);
    }
    const kind = stringValue(rawStep.k || rawStep.kind || rawStep.type, "work").toLowerCase();
    if (!["work", "rest", "timed"].includes(kind)) {
      throw new Error(`Type d'etape invalide a l'index ${index + 1}.`);
    }

    const title = stringValue(rawStep.t || rawStep.title, `Etape ${index + 1}`);
    const step = {
      id: stringValue(rawStep.id, `step-${index + 1}`),
      kind,
      block: stringValue(rawStep.b || rawStep.block, "Seance"),
      title,
      detail: stringValue(rawStep.d || rawStep.detail || rawStep.target, ""),
      cue: stringValue(rawStep.c || rawStep.cue, ""),
    };

    if (kind === "rest" || kind === "timed") {
      step.seconds = secondsValue(rawStep.s || rawStep.seconds, 60);
    } else if (rawStep.s || rawStep.seconds) {
      step.seconds = secondsValue(rawStep.s || rawStep.seconds, 0);
    }

    return step;
  }

  function normalizeWorkout(rawWorkout) {
    if (!rawWorkout || typeof rawWorkout !== "object" || Array.isArray(rawWorkout)) {
      throw new Error("La seance doit etre un objet JSON.");
    }
    if ("v" in rawWorkout && Number(rawWorkout.v) !== 1) {
      throw new Error("Version de seance non supportee.");
    }
    if (!Array.isArray(rawWorkout.steps) || rawWorkout.steps.length === 0) {
      throw new Error("La seance doit contenir au moins une etape.");
    }
    if (rawWorkout.steps.length > MAX_STEPS) {
      throw new Error(`La seance ne peut pas depasser ${MAX_STEPS} etapes.`);
    }

    const steps = rawWorkout.steps.map(normalizeStep);
    const quick = Array.isArray(rawWorkout.quick) && rawWorkout.quick.length
      ? rawWorkout.quick.slice(0, 3).map((duration) => secondsValue(duration, 60))
      : [60, 90];
    const start = Math.min(steps.length - 1, Math.max(0, Math.round(Number(rawWorkout.start) || 0)));

    return {
      v: 1,
      title: stringValue(rawWorkout.title, "The Coach"),
      athleteNote: stringValue(rawWorkout.athleteNote, ""),
      start,
      quick,
      add: secondsValue(rawWorkout.add, 30),
      steps,
    };
  }

  function cloneWorkout(workout) {
    return {
      ...workout,
      quick: [...workout.quick],
      steps: workout.steps.map((step) => ({ ...step })),
    };
  }

  function currentStep(state) {
    return state.workout.steps[state.currentIndex] || null;
  }

  function isTimedStep(step) {
    return step && (step.kind === "rest" || step.kind === "timed");
  }

  function enterStep(state, index) {
    const workout = state.workout;
    const step = workout.steps[index];
    if (!step) {
      return {
        ...state,
        currentIndex: workout.steps.length,
        remainingSeconds: 0,
        running: false,
        done: true,
        finishedAt: state.finishedAt || new Date().toISOString(),
      };
    }

    return {
      ...state,
      currentIndex: index,
      remainingSeconds: isTimedStep(step) ? step.seconds : 0,
      running: isTimedStep(step),
      done: false,
    };
  }

  function createInitialState(workout) {
    const normalized = cloneWorkout(workout);
    return enterStep(
      {
        workout: normalized,
        currentIndex: normalized.start,
        remainingSeconds: 0,
        running: false,
        done: false,
        notes: {},
        manualRestCount: 0,
        startedAt: new Date().toISOString(),
        finishedAt: "",
      },
      normalized.start,
    );
  }

  function completeCurrentStep(state) {
    return enterStep({ ...state, running: false, remainingSeconds: 0 }, state.currentIndex + 1);
  }

  function tick(state) {
    if (!state.running || !isTimedStep(currentStep(state))) {
      return state;
    }
    if (state.remainingSeconds > 1) {
      return { ...state, remainingSeconds: state.remainingSeconds - 1 };
    }
    return completeCurrentStep({ ...state, remainingSeconds: 0 });
  }

  function toggleTimer(state) {
    const step = currentStep(state);
    if (!isTimedStep(step)) return state;
    return {
      ...state,
      remainingSeconds: state.remainingSeconds || step.seconds,
      running: !state.running,
    };
  }

  function updateCurrentNote(state, note) {
    const step = currentStep(state);
    if (!step) return state;
    return {
      ...state,
      notes: {
        ...state.notes,
        [step.id]: String(note),
      },
    };
  }

  function addTime(state, seconds) {
    const step = currentStep(state);
    if (!isTimedStep(step)) return state;
    return {
      ...state,
      remainingSeconds: secondsValue(state.remainingSeconds + seconds, step.seconds),
    };
  }

  function forceRest(state, seconds) {
    const duration = secondsValue(seconds, 60);
    const workout = cloneWorkout(state.workout);
    const manualRestCount = (state.manualRestCount || 0) + 1;
    const rest = {
      id: `manual-rest-${manualRestCount}`,
      kind: "rest",
      block: "Pause manuelle",
      title: `Pause ${duration} s`,
      detail: "",
      cue: "Pause ajoutee manuellement.",
      seconds: duration,
    };
    const step = currentStep(state);
    if (step && step.kind === "rest") {
      workout.steps[state.currentIndex] = rest;
      return enterStep({ ...state, workout, manualRestCount }, state.currentIndex);
    }
    workout.steps.splice(state.currentIndex, 0, rest);
    return enterStep({ ...state, workout, manualRestCount }, state.currentIndex);
  }

  function goToPrevious(state) {
    return enterStep(state, Math.max(0, state.currentIndex - 1));
  }

  function goToNext(state) {
    return completeCurrentStep(state);
  }

  function goToStep(state, index) {
    const nextIndex = Math.min(state.workout.steps.length, Math.max(0, Math.round(Number(index) || 0)));
    return enterStep({ ...state, running: false, remainingSeconds: 0 }, nextIndex);
  }

  function groupStepsByBlock(steps) {
    return steps.reduce((groups, step, index) => {
      const last = groups[groups.length - 1];
      if (!last || last.block !== step.block) {
        groups.push({ block: step.block, steps: [{ step, index }] });
      } else {
        last.steps.push({ step, index });
      }
      return groups;
    }, []);
  }

  function formatTime(totalSeconds) {
    const safe = Math.max(0, Math.round(Number(totalSeconds) || 0));
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function stepLabel(step) {
    if (!step) return "Fin";
    if (step.kind === "rest") return "Pause";
    if (step.kind === "timed") return "Chrono";
    return "Serie";
  }

  function progressPercent(state) {
    if (state.done) return 100;
    return Math.round((state.currentIndex / Math.max(1, state.workout.steps.length - 1)) * 100);
  }

  function buildMarkdownSummary(state) {
    const lines = [
      `# Seance - ${state.workout.title}`,
      "",
      `- Debut: ${state.startedAt || "non renseigne"}`,
      `- Fin: ${state.finishedAt || new Date().toISOString()}`,
    ];
    if (state.workout.athleteNote) {
      lines.push(`- Note athlete: ${state.workout.athleteNote}`);
    }
    lines.push("", "## Etapes", "");

    state.workout.steps.forEach((step, index) => {
      const target = step.detail || (step.seconds ? formatTime(step.seconds) : "");
      const note = String(state.notes[step.id] || "").trim();
      lines.push(`### ${index + 1}. ${step.title}`);
      lines.push(`- Bloc: ${step.block}`);
      lines.push(`- Type: ${stepLabel(step)}`);
      if (target) lines.push(`- Objectif: ${target}`);
      if (step.cue) lines.push(`- Consigne: ${step.cue}`);
      lines.push(`- Note terrain: ${note || "RAS"}`);
      lines.push("");
    });

    return lines.join("\n").trim() + "\n";
  }

  function parseWorkoutFromUrl(search) {
    const params = new URLSearchParams(search || "");
    const payload = params.get("p") || params.get("workout");
    if (!payload) return { workout: normalizeWorkout(DEFAULT_WORKOUT), source: "default", error: "" };
    try {
      const raw = payload.trim().startsWith("{") ? JSON.parse(payload) : decodeWorkout(payload);
      return { workout: normalizeWorkout(raw), source: "url", error: "" };
    } catch (error) {
      return {
        workout: normalizeWorkout(DEFAULT_WORKOUT),
        source: "default",
        error: "Parametre de seance invalide. Verifie le JSON ou l'encodage Base64URL.",
      };
    }
  }

  const api = {
    DEFAULT_WORKOUT,
    MUSIC_PLAYLIST_URL,
    addTime,
    buildMarkdownSummary,
    completeCurrentStep,
    createInitialState,
    currentStep,
    decodeWorkout,
    encodeWorkout,
    forceRest,
    formatTime,
    goToStep,
    goToNext,
    goToPrevious,
    groupStepsByBlock,
    normalizeWorkout,
    parseWorkoutFromUrl,
    progressPercent,
    stepLabel,
    tick,
    toggleTimer,
    updateCurrentNote,
  };

  globalThis.TheCoach = api;
  if (globalThis.window) {
    globalThis.window.TheCoach = api;
  }

  if (!globalThis.document) {
    return;
  }

  const $ = (selector) => document.querySelector(selector);
  const elements = {
    addTime: $("#addTime"),
    athleteNote: $("#athleteNote"),
    block: $("#block"),
    cue: $("#cue"),
    detail: $("#detail"),
    error: $("#error"),
    exampleJson: $("#exampleJson"),
    forceRests: $("#forceRests"),
    jsonInput: $("#jsonInput"),
    loadJson: $("#loadJson"),
    mainAction: $("#mainAction"),
    markdown: $("#markdown"),
    music: $("#music"),
    next: $("#next"),
    note: $("#note"),
    planList: $("#planList"),
    previous: $("#previous"),
    progress: $("#progress"),
    reset: $("#reset"),
    running: $("#running"),
    shareUrl: $("#shareUrl"),
    stepCount: $("#stepCount"),
    stepType: $("#stepType"),
    summaryPanel: $("#summaryPanel"),
    themeSelect: $("#themeSelect"),
    timer: $("#timer"),
    title: $("#title"),
    workoutTitle: $("#workoutTitle"),
  };

  const THEME_STORAGE_KEY = "the-coach-theme";
  let state = createInitialState(parseWorkoutFromUrl(window.location.search).workout);
  let previousIndex = state.currentIndex;

  function setText(element, text) {
    element.textContent = text == null ? "" : String(text);
  }

  function clearNode(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function appendTextNode(parent, tag, text, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text;
    parent.appendChild(node);
    return node;
  }

  function renderForceRestButtons() {
    clearNode(elements.forceRests);
    state.workout.quick.forEach((duration) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `Pause ${duration} s`;
      button.addEventListener("click", () => setState(forceRest(state, duration)));
      elements.forceRests.appendChild(button);
    });
  }

  function renderPlanList() {
    clearNode(elements.planList);

    groupStepsByBlock(state.workout.steps).forEach((group) => {
      const groupNode = document.createElement("section");
      groupNode.className = "plan-group";
      appendTextNode(groupNode, "h3", group.block, "plan-group-title");

      const actions = document.createElement("div");
      actions.className = "plan-actions";

      group.steps.forEach(({ step, index }) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "plan-step";
        if (index < state.currentIndex || state.done) button.classList.add("is-done");
        if (index === state.currentIndex && !state.done) button.classList.add("is-current");
        if (step.kind === "rest") button.classList.add("is-rest");
        button.addEventListener("click", () => setState(goToStep(state, index)));

        appendTextNode(button, "span", String(index + 1), "plan-step-number");
        const text = document.createElement("span");
        text.className = "plan-step-text";
        appendTextNode(text, "strong", step.title, "plan-step-title");
        appendTextNode(text, "small", step.detail || (step.seconds ? formatTime(step.seconds) : stepLabel(step)), "plan-step-meta");
        button.appendChild(text);
        actions.appendChild(button);
      });

      groupNode.appendChild(actions);
      elements.planList.appendChild(groupNode);
    });
  }

  function renderSummary() {
    const markdown = buildMarkdownSummary(state);
    elements.markdown.value = markdown;
    elements.summaryPanel.hidden = !state.done;
  }

  function render() {
    const step = currentStep(state);
    document.body.classList.toggle("is-resting", step && step.kind === "rest");
    document.body.classList.toggle("is-done", state.done);
    setText(elements.workoutTitle, state.workout.title);
    setText(elements.athleteNote, state.workout.athleteNote || "Seance chargee depuis l'URL ou l'exemple local.");

    if (state.done) {
      setText(elements.block, "Seance terminee");
      setText(elements.stepType, "Fin");
      setText(elements.running, "Arrete");
      setText(elements.stepCount, `${state.workout.steps.length}/${state.workout.steps.length}`);
      setText(elements.title, "Resume pret");
      setText(elements.detail, "Copie le markdown pour ton agent IA.");
      setText(elements.timer, "00:00");
      setText(elements.cue, "Ne rajoute pas de volume par inertie. Note le ressenti.");
      elements.progress.style.width = "100%";
      elements.mainAction.textContent = "Recommencer";
      elements.note.value = "";
      elements.note.disabled = true;
      renderPlanList();
      renderSummary();
      return;
    }

    const timed = isTimedStep(step);
    setText(elements.block, step.block);
    setText(elements.stepType, stepLabel(step));
    setText(elements.running, state.running ? "En cours" : "En attente");
    setText(elements.stepCount, `${state.currentIndex + 1}/${state.workout.steps.length}`);
    setText(elements.title, step.title);
    setText(elements.detail, step.detail || (step.seconds ? `${step.seconds} s` : ""));
    setText(elements.timer, timed ? formatTime(state.remainingSeconds) : "A ton rythme");
    setText(elements.cue, step.cue || "Note precisement ce que tu veux transmettre a ton agent IA.");
    elements.progress.style.width = `${progressPercent(state)}%`;
    elements.note.disabled = false;
    elements.note.value = state.notes[step.id] || "";
    elements.addTime.textContent = `+${state.workout.add} s`;
    elements.addTime.disabled = !timed;

    if (step.kind === "work") {
      elements.mainAction.textContent = "Etape faite";
    } else {
      elements.mainAction.textContent = state.running ? "Mettre en pause" : "Reprendre";
    }

    renderPlanList();
    renderSummary();
  }

  function setState(nextState) {
    state = nextState;
    if (state.currentIndex !== previousIndex && navigator.vibrate) {
      navigator.vibrate(60);
    }
    previousIndex = state.currentIndex;
    render();
  }

  function loadWorkout(rawWorkout, pushUrl) {
    const workout = normalizeWorkout(rawWorkout);
    state = createInitialState(workout);
    previousIndex = state.currentIndex;
    elements.error.hidden = true;
    elements.jsonInput.value = JSON.stringify({
      v: 1,
      title: workout.title,
      athleteNote: workout.athleteNote,
      start: workout.start,
      quick: workout.quick,
      add: workout.add,
      steps: workout.steps.map((step) => ({
        id: step.id,
        k: step.kind,
        b: step.block,
        t: step.title,
        d: step.detail,
        c: step.cue,
        s: step.seconds,
      })),
    }, null, 2);
    elements.shareUrl.value = `${window.location.origin}${window.location.pathname}?p=${encodeWorkout(rawWorkout)}`;
    if (pushUrl) {
      window.history.replaceState(null, "", `?p=${encodeWorkout(rawWorkout)}`);
    }
    renderForceRestButtons();
    render();
  }

  function loadFromText() {
    try {
      const raw = JSON.parse(elements.jsonInput.value);
      loadWorkout(raw, true);
    } catch (error) {
      elements.error.hidden = false;
      setText(elements.error, error.message);
    }
  }

  function openMusicPlaylist() {
    window.open(MUSIC_PLAYLIST_URL, "_blank", "noopener,noreferrer");
  }

  function applyTheme(choice) {
    const theme = ["system", "light", "dark"].includes(choice) ? choice : "system";
    elements.themeSelect.value = theme;
    if (theme === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  function loadTheme() {
    applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || "system");
  }

  elements.mainAction.addEventListener("click", () => {
    if (state.done) {
      setState(createInitialState(state.workout));
      return;
    }
    const step = currentStep(state);
    setState(step.kind === "work" ? completeCurrentStep(state) : toggleTimer(state));
  });
  elements.next.addEventListener("click", () => setState(goToNext(state)));
  elements.previous.addEventListener("click", () => setState(goToPrevious(state)));
  elements.addTime.addEventListener("click", () => setState(addTime(state, state.workout.add)));
  elements.reset.addEventListener("click", () => setState(createInitialState(state.workout)));
  elements.note.addEventListener("input", () => setState(updateCurrentNote(state, elements.note.value)));
  elements.loadJson.addEventListener("click", loadFromText);
  elements.music.addEventListener("click", openMusicPlaylist);
  elements.themeSelect.addEventListener("change", () => applyTheme(elements.themeSelect.value));

  $("#copyMarkdown").addEventListener("click", async () => {
    elements.markdown.select();
    try {
      await navigator.clipboard.writeText(elements.markdown.value);
    } catch (error) {
      document.execCommand("copy");
    }
  });

  $("#copyShareUrl").addEventListener("click", async () => {
    elements.shareUrl.select();
    try {
      await navigator.clipboard.writeText(elements.shareUrl.value);
    } catch (error) {
      document.execCommand("copy");
    }
  });

  setInterval(() => {
    const next = tick(state);
    if (next !== state) setState(next);
  }, 1000);

  const parsed = parseWorkoutFromUrl(window.location.search);
  elements.exampleJson.value = JSON.stringify(DEFAULT_WORKOUT, null, 2);
  loadTheme();
  loadWorkout(parsed.workout, false);
  if (parsed.error) {
    elements.error.hidden = false;
    setText(elements.error, parsed.error);
  }
})();
