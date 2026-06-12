(function () {
  const MAX_STEPS = 120;
  const MIN_SECONDS = 1;
  const MAX_SECONDS = 7200;
  const DEFAULT_LOAD_KG = 16;
  const COMPLETED_ACTIONS_STORAGE_PREFIX = "the-coach-completed-actions-v1";
  const PROGRAM_LIBRARY_STORAGE_KEY = "the-coach-program-library-v1";
  const MUSIC_PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLRPR8uJQx5tFv7_Uez_8W1tK2jtoC9A3q";
  const VIDEO_URLS = {
    breathing: "https://www.youtube.com/watch?v=QUFRhuEvp0g",
    deadlift: "https://www.youtube.com/watch?v=LDfnyt0Rmaw",
    row: "https://www.youtube.com/watch?v=l5qelXL5nfs",
    squat: "https://www.youtube.com/watch?v=aNDUbH_Uv4g",
    stretch: "https://www.youtube.com/watch?v=UIRTPXj1Q1U",
    suitcase: "https://www.youtube.com/watch?v=tNHdx7pmrGI",
    swing: "https://www.youtube.com/watch?v=uMqcv_O7ppI",
  };

  const DEFAULT_WORKOUT = {
    v: 1,
    id: "kettlebell-16-base",
    title: "Kettlebell 16 kg",
    athleteNote: "Eviter le volume de poussee devant.",
    start: 0,
    quick: [60, 90],
    add: 30,
    steps: [
      { k: "work", b: "Swings", t: "Swings 2 mains", d: "16 reps", kg: DEFAULT_LOAD_KG, reps: 16, s: 32, c: "Hanches explosives, dos neutre.", u: VIDEO_URLS.swing },
      { k: "rest", b: "Swings", t: "Pause", s: 60 },
      { k: "work", b: "Swings", t: "Swings 2 mains", d: "16 reps", kg: DEFAULT_LOAD_KG, reps: 16, s: 32, c: "Reste explosif, stop si le bas du dos prend.", u: VIDEO_URLS.swing },
      { k: "rest", b: "Swings", t: "Pause", s: 60 },
      { k: "work", b: "Swings", t: "Swings 2 mains", d: "16 reps", kg: DEFAULT_LOAD_KG, reps: 16, s: 32, c: "Garde 2 reps en reserve.", u: VIDEO_URLS.swing },
      { k: "rest", b: "Swings", t: "Pause", s: 90 },
      { k: "work", b: "Swings", t: "Swings 2 mains", d: "14 reps", kg: DEFAULT_LOAD_KG, reps: 14, s: 28, c: "Garde 2 reps en reserve.", u: VIDEO_URLS.swing },
      { k: "rest", b: "Transition", t: "Pause avant force", s: 120 },
      { k: "work", b: "Force 1/3", t: "Goblet squat", d: "9 reps", kg: DEFAULT_LOAD_KG, reps: 9, s: 36, u: VIDEO_URLS.squat },
      { k: "rest", b: "Force 1/3", t: "Pause", s: 60 },
      { k: "work", b: "Force 1/3", t: "Row 1 bras", d: "8 gauche + 8 droit", kg: DEFAULT_LOAD_KG, reps: 16, s: 48, u: VIDEO_URLS.row },
      { k: "rest", b: "Force 1/3", t: "Pause", s: 60 },
      { k: "work", b: "Force 1/3", t: "Kettlebell deadlift", d: "9 reps", kg: DEFAULT_LOAD_KG, reps: 9, s: 27, u: VIDEO_URLS.deadlift },
      { k: "rest", b: "Force 1/3", t: "Pause avant tour 2", s: 90 },
      { k: "work", b: "Force 2/3", t: "Goblet squat", d: "9 reps", kg: DEFAULT_LOAD_KG, reps: 9, s: 36, u: VIDEO_URLS.squat },
      { k: "rest", b: "Force 2/3", t: "Pause", s: 60 },
      { k: "work", b: "Force 2/3", t: "Row 1 bras", d: "8 gauche + 8 droit", kg: DEFAULT_LOAD_KG, reps: 16, s: 48, u: VIDEO_URLS.row },
      { k: "rest", b: "Force 2/3", t: "Pause", s: 60 },
      { k: "work", b: "Force 2/3", t: "Kettlebell deadlift", d: "9 reps", kg: DEFAULT_LOAD_KG, reps: 9, s: 27, u: VIDEO_URLS.deadlift },
      { k: "rest", b: "Force 2/3", t: "Pause avant tour 3", s: 90 },
      { k: "work", b: "Force 3/3", t: "Goblet squat", d: "9 reps", kg: DEFAULT_LOAD_KG, reps: 9, s: 36, u: VIDEO_URLS.squat },
      { k: "rest", b: "Force 3/3", t: "Pause", s: 60 },
      { k: "work", b: "Force 3/3", t: "Row 1 bras", d: "8 gauche + 8 droit", kg: DEFAULT_LOAD_KG, reps: 16, s: 48, u: VIDEO_URLS.row },
      { k: "rest", b: "Force 3/3", t: "Pause", s: 60 },
      { k: "work", b: "Force 3/3", t: "Kettlebell deadlift", d: "9 reps", kg: DEFAULT_LOAD_KG, reps: 9, s: 27, u: VIDEO_URLS.deadlift },
      { k: "rest", b: "Transition", t: "Pause avant carries", s: 120 },
      { k: "work", b: "Carry 1/2", t: "Suitcase hold/carry droite", d: "45 s", kg: DEFAULT_LOAD_KG, s: 45, u: VIDEO_URLS.suitcase },
      { k: "rest", b: "Carry 1/2", t: "Pause", s: 30 },
      { k: "work", b: "Carry 1/2", t: "Suitcase hold/carry gauche", d: "45 s", kg: DEFAULT_LOAD_KG, s: 45, u: VIDEO_URLS.suitcase },
      { k: "rest", b: "Carry 1/2", t: "Pause avant tour 2", s: 60 },
      { k: "work", b: "Carry 2/2", t: "Suitcase hold/carry droite", d: "45 s", kg: DEFAULT_LOAD_KG, s: 45, u: VIDEO_URLS.suitcase },
      { k: "rest", b: "Carry 2/2", t: "Pause", s: 30 },
      { k: "work", b: "Carry 2/2", t: "Suitcase hold/carry gauche", d: "45 s", kg: DEFAULT_LOAD_KG, s: 45, u: VIDEO_URLS.suitcase },
      { k: "rest", b: "Retour au calme", t: "Pause avant retour au calme", s: 60 },
      { k: "timed", b: "Retour au calme", t: "Respiration lente", d: "2 min", s: 120, u: VIDEO_URLS.breathing },
      { k: "timed", b: "Retour au calme", t: "Etirement hanches/ischios droite", d: "30 s", s: 30, u: VIDEO_URLS.stretch },
      { k: "timed", b: "Retour au calme", t: "Etirement hanches/ischios gauche", d: "30 s", s: 30, u: VIDEO_URLS.stretch },
    ],
  };

  const MOBILITY_CORE_WORKOUT = {
    v: 1,
    id: "mobility-core-no-equipment",
    title: "Mobilite + tronc sans materiel",
    athleteNote: "Materiel: aucun. Reste facile, respiration calme.",
    start: 0,
    quick: [30, 45],
    add: 15,
    steps: [
      { k: "timed", b: "Echauffement", t: "Respiration crocodile", d: "60 s", s: 60 },
      { k: "timed", b: "Echauffement", t: "Cat cow", d: "60 s", s: 60 },
      { k: "work", b: "Circuit 1/2", t: "Dead bug", d: "8 gauche + 8 droit", reps: 16, s: 48 },
      { k: "rest", b: "Circuit 1/2", t: "Pause", s: 30 },
      { k: "timed", b: "Circuit 1/2", t: "Planche basse", d: "30 s", s: 30 },
      { k: "rest", b: "Circuit 1/2", t: "Pause", s: 30 },
      { k: "work", b: "Circuit 1/2", t: "Bird dog", d: "8 gauche + 8 droit", reps: 16, s: 48 },
      { k: "rest", b: "Circuit 1/2", t: "Pause avant tour 2", s: 45 },
      { k: "work", b: "Circuit 2/2", t: "Dead bug", d: "8 gauche + 8 droit", reps: 16, s: 48 },
      { k: "rest", b: "Circuit 2/2", t: "Pause", s: 30 },
      { k: "timed", b: "Circuit 2/2", t: "Planche basse", d: "30 s", s: 30 },
      { k: "rest", b: "Circuit 2/2", t: "Pause", s: 30 },
      { k: "work", b: "Circuit 2/2", t: "Bird dog", d: "8 gauche + 8 droit", reps: 16, s: 48 },
      { k: "timed", b: "Retour au calme", t: "Etirement hanches", d: "60 s", s: 60 },
    ],
  };

  const KETTLEBELL_TECHNIQUE_WORKOUT = {
    v: 1,
    id: "kettlebell-technique-short",
    title: "Kettlebell technique courte",
    athleteNote: "Materiel: une kettlebell legere a moderee. Priorite technique.",
    start: 0,
    quick: [45, 60],
    add: 15,
    steps: [
      { k: "timed", b: "Prep", t: "Charniere a vide", d: "60 s", s: 60 },
      { k: "work", b: "Technique 1/3", t: "Kettlebell deadlift", d: "8 reps", kg: DEFAULT_LOAD_KG, reps: 8, s: 32, u: VIDEO_URLS.deadlift },
      { k: "rest", b: "Technique 1/3", t: "Pause", s: 45 },
      { k: "work", b: "Technique 1/3", t: "Goblet squat", d: "6 reps", kg: DEFAULT_LOAD_KG, reps: 6, s: 30, u: VIDEO_URLS.squat },
      { k: "rest", b: "Technique 1/3", t: "Pause avant tour 2", s: 60 },
      { k: "work", b: "Technique 2/3", t: "Kettlebell deadlift", d: "8 reps", kg: DEFAULT_LOAD_KG, reps: 8, s: 32, u: VIDEO_URLS.deadlift },
      { k: "rest", b: "Technique 2/3", t: "Pause", s: 45 },
      { k: "work", b: "Technique 2/3", t: "Goblet squat", d: "6 reps", kg: DEFAULT_LOAD_KG, reps: 6, s: 30, u: VIDEO_URLS.squat },
      { k: "rest", b: "Technique 2/3", t: "Pause avant tour 3", s: 60 },
      { k: "work", b: "Technique 3/3", t: "Kettlebell deadlift", d: "8 reps", kg: DEFAULT_LOAD_KG, reps: 8, s: 32, u: VIDEO_URLS.deadlift },
      { k: "rest", b: "Technique 3/3", t: "Pause", s: 45 },
      { k: "work", b: "Technique 3/3", t: "Goblet squat", d: "6 reps", kg: DEFAULT_LOAD_KG, reps: 6, s: 30, u: VIDEO_URLS.squat },
      { k: "timed", b: "Retour au calme", t: "Respiration lente", d: "90 s", s: 90, u: VIDEO_URLS.breathing },
    ],
  };

  const MINIMAL_CARRIES_WORKOUT = {
    v: 1,
    id: "minimal-carries-core",
    title: "Gainage + carries minimal",
    athleteNote: "Materiel: une kettlebell ou un sac charge. Aucun autre materiel.",
    start: 0,
    quick: [30, 60],
    add: 15,
    steps: [
      { k: "timed", b: "Prep", t: "Marche facile", d: "2 min", s: 120 },
      { k: "work", b: "Carry 1/3", t: "Suitcase carry droite", d: "40 s", kg: DEFAULT_LOAD_KG, s: 40, u: VIDEO_URLS.suitcase },
      { k: "rest", b: "Carry 1/3", t: "Pause", s: 30 },
      { k: "work", b: "Carry 1/3", t: "Suitcase carry gauche", d: "40 s", kg: DEFAULT_LOAD_KG, s: 40, u: VIDEO_URLS.suitcase },
      { k: "rest", b: "Carry 1/3", t: "Pause avant tour 2", s: 60 },
      { k: "work", b: "Carry 2/3", t: "Suitcase carry droite", d: "40 s", kg: DEFAULT_LOAD_KG, s: 40, u: VIDEO_URLS.suitcase },
      { k: "rest", b: "Carry 2/3", t: "Pause", s: 30 },
      { k: "work", b: "Carry 2/3", t: "Suitcase carry gauche", d: "40 s", kg: DEFAULT_LOAD_KG, s: 40, u: VIDEO_URLS.suitcase },
      { k: "rest", b: "Carry 2/3", t: "Pause avant tour 3", s: 60 },
      { k: "work", b: "Carry 3/3", t: "Suitcase carry droite", d: "40 s", kg: DEFAULT_LOAD_KG, s: 40, u: VIDEO_URLS.suitcase },
      { k: "rest", b: "Carry 3/3", t: "Pause", s: 30 },
      { k: "work", b: "Carry 3/3", t: "Suitcase carry gauche", d: "40 s", kg: DEFAULT_LOAD_KG, s: 40, u: VIDEO_URLS.suitcase },
      { k: "timed", b: "Retour au calme", t: "Respiration lente", d: "90 s", s: 90, u: VIDEO_URLS.breathing },
    ],
  };

  const DEFAULT_PROGRAMS = [
    DEFAULT_WORKOUT,
    MOBILITY_CORE_WORKOUT,
    KETTLEBELL_TECHNIQUE_WORKOUT,
    MINIMAL_CARRIES_WORKOUT,
  ];

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

  function hasValue(value) {
    return value !== undefined && value !== null && value !== "";
  }

  function positiveNumberValue(value, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return fallback;
    return numeric;
  }

  function optionalSecondsValue(value) {
    if (!hasValue(value)) return 0;
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return 0;
    return secondsValue(numeric, MIN_SECONDS);
  }

  function fixedRepDetail(detail, reps) {
    const text = stringValue(detail, "");
    if (reps && /\b\d+\s*(?:a|à|-)\s*\d+\s*reps\b/i.test(text)) {
      return `${reps} reps`;
    }
    return text;
  }

  function youtubeVideoId(value) {
    const raw = stringValue(value, "");
    if (!raw) return "";
    const direct = raw.match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{6,})/);
    const watch = raw.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
    const short = raw.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
    const shorts = raw.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/);
    return (direct || watch || short || shorts || [])[1] || "";
  }

  function youtubeEmbedUrl(value) {
    const id = youtubeVideoId(value);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : "";
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
    const rawSeconds = rawStep.s ?? rawStep.seconds ?? rawStep.durationSeconds ?? rawStep.targetSeconds;
    const weightKg = positiveNumberValue(rawStep.kg ?? rawStep.weightKg ?? rawStep.loadKg ?? rawStep.load, 0);
    const reps = positiveNumberValue(rawStep.reps ?? rawStep.r ?? rawStep.repCount, 0);
    const step = {
      id: stringValue(rawStep.id, `step-${index + 1}`),
      kind,
      block: stringValue(rawStep.b || rawStep.block, "Seance"),
      title,
      detail: fixedRepDetail(rawStep.d || rawStep.detail || rawStep.target, reps),
      cue: stringValue(rawStep.c || rawStep.cue, ""),
      video: youtubeEmbedUrl(rawStep.u || rawStep.video || rawStep.youtube),
    };

    if (weightKg) step.weightKg = weightKg;
    if (reps) step.reps = reps;

    if (kind === "rest" || kind === "timed") {
      step.seconds = secondsValue(hasValue(rawSeconds) ? rawSeconds : 60, 60);
    } else if (hasValue(rawSeconds)) {
      const seconds = optionalSecondsValue(rawSeconds);
      if (seconds) step.seconds = seconds;
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
      id: stringValue(rawWorkout.id || rawWorkout.slug, stableHash(`${stringValue(rawWorkout.title, "The Coach")}:${JSON.stringify(rawWorkout.steps)}`)),
      title: stringValue(rawWorkout.title, "The Coach"),
      athleteNote: stringValue(rawWorkout.athleteNote, ""),
      start,
      quick,
      add: secondsValue(rawWorkout.add, 30),
      steps,
    };
  }

  function workoutToJson(workout) {
    const normalized = normalizeWorkout(workout);
    return {
      id: normalized.id,
      v: 1,
      title: normalized.title,
      athleteNote: normalized.athleteNote,
      start: normalized.start,
      quick: normalized.quick,
      add: normalized.add,
      steps: normalized.steps.map((step) => ({
        id: step.id,
        kind: step.kind,
        block: step.block,
        title: step.title,
        detail: step.detail,
        cue: step.cue,
        seconds: step.seconds,
        weightKg: step.weightKg,
        reps: step.reps,
        video: step.video,
      })),
    };
  }

  function normalizeProgramLibrary(rawLibrary) {
    const source = Array.isArray(rawLibrary) ? rawLibrary : rawLibrary && Array.isArray(rawLibrary.programs) ? rawLibrary.programs : [];
    return source.map(normalizeWorkout);
  }

  function exportProgramLibrary(library) {
    return JSON.stringify({
      v: 1,
      programs: normalizeProgramLibrary(library).map(workoutToJson),
    }, null, 2);
  }

  function saveProgramLibrary(storage, library) {
    const normalized = normalizeProgramLibrary(library);
    if (storage) {
      storage.setItem(PROGRAM_LIBRARY_STORAGE_KEY, exportProgramLibrary(normalized));
    }
    return normalized;
  }

  function loadProgramLibrary(storage) {
    if (storage) {
      try {
        const raw = storage.getItem(PROGRAM_LIBRARY_STORAGE_KEY);
        if (raw) {
          const saved = normalizeProgramLibrary(JSON.parse(raw));
          if (saved.length) return saved;
        }
      } catch (error) {
        storage.removeItem(PROGRAM_LIBRARY_STORAGE_KEY);
      }
    }
    return saveProgramLibrary(storage, DEFAULT_PROGRAMS);
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
    return step && Boolean(step.seconds);
  }

  function stepVolumeKg(step) {
    const weightKg = positiveNumberValue(step && step.weightKg, 0);
    const reps = positiveNumberValue(step && step.reps, 0);
    return weightKg && reps ? weightKg * reps : 0;
  }

  function workoutMetrics(workout) {
    const steps = workout && Array.isArray(workout.steps) ? workout.steps : [];
    const totalWeightKg = steps.reduce((total, step) => total + stepVolumeKg(step), 0);
    const targetSeconds = steps.reduce((total, step) => total + (Number(step.seconds) || 0), 0);
    return {
      totalWeightKg: Math.round(totalWeightKg * 10) / 10,
      targetSeconds,
      kgPerMinute: targetSeconds > 0 ? Math.round((totalWeightKg / targetSeconds) * 600) / 10 : 0,
    };
  }

  function stableHash(text) {
    let hash = 2166136261;
    const value = String(text);
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function workoutSignature(workout) {
    const normalized = normalizeWorkout(workout);
    return JSON.stringify({
      v: normalized.v,
      title: normalized.title,
      athleteNote: normalized.athleteNote,
      start: normalized.start,
      steps: normalized.steps.map((step) => ({
        id: step.id,
        kind: step.kind,
        block: step.block,
        title: step.title,
        detail: step.detail,
        seconds: step.seconds || 0,
        weightKg: step.weightKg || 0,
        reps: step.reps || 0,
      })),
    });
  }

  function completedActionsStorageKey(workout, dateValue) {
    return `${COMPLETED_ACTIONS_STORAGE_PREFIX}:${dateKey(dateValue)}:${stableHash(workoutSignature(workout))}`;
  }

  function completedActionJournal(workout, dateValue, actions) {
    return {
      v: 1,
      date: dateKey(dateValue),
      workoutKey: completedActionsStorageKey(workout, dateValue),
      workoutTitle: workout.title,
      actions: Array.isArray(actions) ? actions : [],
    };
  }

  function readCompletedActions(storage, workout, dateValue) {
    const empty = completedActionJournal(workout, dateValue, []);
    if (!storage) return empty;
    try {
      const raw = storage.getItem(completedActionsStorageKey(workout, dateValue));
      if (!raw) return empty;
      const parsed = JSON.parse(raw);
      return completedActionJournal(workout, dateValue, Array.isArray(parsed.actions) ? parsed.actions : []);
    } catch (error) {
      return empty;
    }
  }

  function buildStepCompletionRecord(state, completedAt) {
    const step = currentStep(state);
    if (!step) return null;
    const safeDate = new Date(completedAt || Date.now());
    const at = Number.isNaN(safeDate.getTime()) ? new Date() : safeDate;
    const targetSeconds = Number(step.seconds) || 0;
    const remainingSeconds = targetSeconds ? Math.min(targetSeconds, Math.max(0, Math.round(Number(state.remainingSeconds) || 0))) : 0;
    const elapsedSeconds = targetSeconds ? Math.min(targetSeconds, Math.max(0, targetSeconds - remainingSeconds)) : 0;
    return {
      v: 1,
      date: dateKey(at),
      completedAt: at.toISOString(),
      index: state.currentIndex + 1,
      stepId: step.id,
      kind: step.kind,
      block: step.block,
      title: step.title,
      target: step.detail || (step.seconds ? formatTime(step.seconds) : ""),
      targetSeconds,
      elapsedSeconds,
      remainingSeconds,
      weightKg: step.weightKg || 0,
      reps: step.reps || 0,
      volumeKg: stepVolumeKg(step),
      note: String(state.notes[step.id] || ""),
      done: true,
    };
  }

  function recordCompletedStep(state, storage, completedAt) {
    const record = buildStepCompletionRecord(state, completedAt);
    if (!record || !storage) return record;
    try {
      const journal = readCompletedActions(storage, state.workout, record.completedAt);
      const nextJournal = completedActionJournal(state.workout, record.completedAt, [...journal.actions, record]);
      storage.setItem(completedActionsStorageKey(state.workout, record.completedAt), JSON.stringify(nextJournal));
    } catch (error) {
      return record;
    }
    return record;
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

  function goToNext(state, confirmSkip) {
    const step = currentStep(state);
    if (step && step.kind === "work" && typeof confirmSkip === "function") {
      const message = "Êtes-vous sûr de ne pas avoir fait cette étape ? Elle ne sera pas comptée dans la séance vraiment réalisée.";
      if (!confirmSkip(message, step)) return state;
    }
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

  function formatKg(value) {
    return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(Number(value) || 0)} kg`;
  }

  function formatKgPerMinute(value) {
    return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(Number(value) || 0)} kg/min`;
  }

  function stepTempoText(step) {
    if (!step) return "";
    if (step.kind !== "work") return "";
    const parts = [];
    if (step.reps && step.seconds) {
      const repsPerMinute = Math.round((step.reps / step.seconds) * 600) / 10;
      parts.push(`Rythme cible: ${repsPerMinute} reps/min, ${formatTime(step.seconds)} pour ${step.reps} reps`);
    } else if (step.seconds) {
      parts.push(`Rythme cible: ${formatTime(step.seconds)}`);
    } else {
      parts.push("Rythme cible non renseigne");
    }
    if (step.weightKg) {
      parts.push(step.reps ? `Charge: ${formatKg(step.weightKg)} x ${step.reps} = ${formatKg(stepVolumeKg(step))}` : `Charge: ${formatKg(step.weightKg)}`);
    }
    return parts.join(" · ");
  }

  function dateKey(value) {
    const date = value instanceof Date ? value : new Date(value || Date.now());
    if (Number.isNaN(date.getTime())) return dateKey(Date.now());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  function formatSessionDateLabel(value) {
    const date = value instanceof Date ? value : new Date(value || Date.now());
    const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(safeDate);
  }

  function createSessionClock(options) {
    const settings = options || {};
    return {
      date: settings.date || dateKey(settings.now || Date.now()),
      startedAt: settings.startedAt || "",
      runningSince: Number(settings.runningSince) || 0,
      elapsedSeconds: Math.max(0, Math.round(Number(settings.elapsedSeconds) || 0)),
      running: Boolean(settings.running),
      stopped: Boolean(settings.stopped),
      stoppedAt: settings.stoppedAt || "",
    };
  }

  function elapsedSessionSeconds(clock, now) {
    const session = createSessionClock(clock);
    if (!session.running || !session.runningSince) return session.elapsedSeconds;
    const delta = Math.max(0, Math.floor(((Number(now) || Date.now()) - session.runningSince) / 1000));
    return session.elapsedSeconds + delta;
  }

  function playSessionClock(clock, now) {
    const at = Number(now) || Date.now();
    const session = createSessionClock(clock);
    if (session.running) return session;
    return {
      ...session,
      startedAt: session.startedAt || new Date(at).toISOString(),
      running: true,
      runningSince: at,
      stopped: false,
      stoppedAt: "",
    };
  }

  function pauseSessionClock(clock, now) {
    const at = Number(now) || Date.now();
    const session = createSessionClock(clock);
    return {
      ...session,
      elapsedSeconds: elapsedSessionSeconds(session, at),
      running: false,
      runningSince: 0,
    };
  }

  function stopSessionClock(clock, now) {
    const at = Number(now) || Date.now();
    const paused = pauseSessionClock(clock, at);
    return {
      ...paused,
      stopped: true,
      stoppedAt: new Date(at).toISOString(),
    };
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
    const metrics = workoutMetrics(state.workout);
    const lines = [
      `# Seance - ${state.workout.title}`,
      "",
      `- Debut: ${state.startedAt || "non renseigne"}`,
      `- Fin: ${state.finishedAt || new Date().toISOString()}`,
      `- Poids total souleve: ${formatKg(metrics.totalWeightKg)}`,
      `- Rythme cible: ${formatKgPerMinute(metrics.kgPerMinute)}`,
      `- Temps cible: ${formatTime(metrics.targetSeconds)}`,
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
      if (step.weightKg) lines.push(`- Charge: ${formatKg(step.weightKg)}`);
      if (step.reps) lines.push(`- Repetitions mesurees: ${step.reps}`);
      if (step.seconds) lines.push(`- Temps cible: ${formatTime(step.seconds)}`);
      if (stepVolumeKg(step)) lines.push(`- Poids souleve: ${formatKg(stepVolumeKg(step))}`);
      if (step.cue) lines.push(`- Consigne: ${step.cue}`);
      lines.push(`- Note terrain: ${note || "RAS"}`);
      lines.push("");
    });

    return lines.join("\n").trim() + "\n";
  }

  function buildLiveSessionJson(state, clock, now, completedActions) {
    const label = formatSessionDateLabel(now || Date.now());
    const sessionClock = createSessionClock(clock);
    const step = currentStep(state);
    const nowMs = now instanceof Date ? now.getTime() : typeof now === "number" ? now : Date.parse(now) || Date.now();
    const elapsedSeconds = elapsedSessionSeconds(sessionClock, nowMs);
    const metrics = workoutMetrics(state.workout);
    return {
      v: 1,
      title: `Séance du ${label}`,
      dateLabel: label,
      workoutTitle: state.workout.title,
      athleteNote: state.workout.athleteNote,
      startedAt: state.startedAt,
      finishedAt: state.finishedAt,
      elapsedSeconds,
      elapsed: formatTime(elapsedSeconds),
      metrics: {
        totalWeightKg: metrics.totalWeightKg,
        targetSeconds: metrics.targetSeconds,
        targetDuration: formatTime(metrics.targetSeconds),
        kgPerMinute: metrics.kgPerMinute,
      },
      completedActions: Array.isArray(completedActions) ? completedActions : [],
      session: {
        date: sessionClock.date,
        startedAt: sessionClock.startedAt,
        stoppedAt: sessionClock.stoppedAt,
        running: sessionClock.running,
        stopped: sessionClock.stopped,
      },
      current: step ? {
        index: state.currentIndex + 1,
        id: step.id,
        title: step.title,
        block: step.block,
        type: stepLabel(step),
        remainingSeconds: state.remainingSeconds,
      } : {
        index: state.workout.steps.length,
        id: "",
        title: "Fin",
        block: "Seance terminee",
        type: "Fin",
        remainingSeconds: 0,
      },
      steps: state.workout.steps.map((item, index) => ({
        index: index + 1,
        id: item.id,
        type: stepLabel(item),
        kind: item.kind,
        block: item.block,
        title: item.title,
        target: item.detail || (item.seconds ? formatTime(item.seconds) : ""),
        seconds: item.seconds || 0,
        weightKg: item.weightKg || 0,
        reps: item.reps || 0,
        volumeKg: stepVolumeKg(item),
        video: item.video || "",
        note: String(state.notes[item.id] || ""),
        current: index === state.currentIndex && !state.done,
        done: state.done || index < state.currentIndex,
      })),
    };
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
    DEFAULT_PROGRAMS,
    MUSIC_PLAYLIST_URL,
    PROGRAM_LIBRARY_STORAGE_KEY,
    addTime,
    buildLiveSessionJson,
    buildStepCompletionRecord,
    buildMarkdownSummary,
    completedActionsStorageKey,
    completeCurrentStep,
    createSessionClock,
    createInitialState,
    currentStep,
    decodeWorkout,
    encodeWorkout,
    elapsedSessionSeconds,
    exportProgramLibrary,
    forceRest,
    formatKg,
    formatKgPerMinute,
    formatSessionDateLabel,
    formatTime,
    goToStep,
    goToNext,
    goToPrevious,
    groupStepsByBlock,
    loadProgramLibrary,
    normalizeWorkout,
    normalizeProgramLibrary,
    parseWorkoutFromUrl,
    pauseSessionClock,
    playSessionClock,
    progressPercent,
    stepLabel,
    readCompletedActions,
    recordCompletedStep,
    saveProgramLibrary,
    stopSessionClock,
    tick,
    toggleTimer,
    updateCurrentNote,
    workoutMetrics,
    youtubeEmbedUrl,
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
    cancelSkip: $("#cancelSkip"),
    confirmSkip: $("#confirmSkip"),
    cue: $("#cue"),
    detail: $("#detail"),
    error: $("#error"),
    exampleJson: $("#exampleJson"),
    forceRests: $("#forceRests"),
    globalTimer: $("#globalTimer"),
    jsonInput: $("#jsonInput"),
    kgPerMinute: $("#kgPerMinute"),
    loadJson: $("#loadJson"),
    liveSessionJson: $("#liveSessionJson"),
    liveSessionTitle: $("#liveSessionTitle"),
    mainAction: $("#mainAction"),
    markdown: $("#markdown"),
    music: $("#music"),
    next: $("#next"),
    note: $("#note"),
    copyNotice: $("#copyNotice"),
    pauseSession: $("#pauseSession"),
    planList: $("#planList"),
    playSession: $("#playSession"),
    previous: $("#previous"),
    programActionCount: $("#programActionCount"),
    programLibraryExport: $("#programLibraryExport"),
    programSelect: $("#programSelect"),
    progress: $("#progress"),
    reset: $("#reset"),
    running: $("#running"),
    shareUrl: $("#shareUrl"),
    sessionStatus: $("#sessionStatus"),
    skipDialog: $("#skipDialog"),
    stepCount: $("#stepCount"),
    stepType: $("#stepType"),
    stopSession: $("#stopSession"),
    tempo: $("#tempo"),
    summaryPanel: $("#summaryPanel"),
    targetDuration: $("#targetDuration"),
    themeSelect: $("#themeSelect"),
    timer: $("#timer"),
    title: $("#title"),
    totalWeight: $("#totalWeight"),
    videoFallback: $("#videoFallback"),
    videoFrame: $("#videoFrame"),
    videoTitle: $("#videoTitle"),
    workoutTitle: $("#workoutTitle"),
  };

  const THEME_STORAGE_KEY = "the-coach-theme";
  const SESSION_CLOCK_STORAGE_KEY = "the-coach-session-clock-v1";
  let programLibrary = loadProgramLibrary(localStorage);
  let state = createInitialState(parseWorkoutFromUrl(window.location.search).workout);
  let previousIndex = state.currentIndex;
  let sessionClock = loadSessionClock();
  let copyNoticeTimer = 0;
  let pendingSkipState = null;

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

  function loadSessionClock() {
    const today = dateKey(Date.now());
    try {
      const raw = localStorage.getItem(SESSION_CLOCK_STORAGE_KEY);
      if (raw) {
        const saved = createSessionClock(JSON.parse(raw));
        if (saved.date === today) return saved;
      }
    } catch (error) {
      localStorage.removeItem(SESSION_CLOCK_STORAGE_KEY);
    }
    return createSessionClock({ date: today, now: Date.now() });
  }

  function saveSessionClock() {
    localStorage.setItem(SESSION_CLOCK_STORAGE_KEY, JSON.stringify(sessionClock));
  }

  function setSessionClock(nextClock) {
    sessionClock = createSessionClock(nextClock);
    saveSessionClock();
    render();
  }

  function renderSessionClock() {
    const elapsed = elapsedSessionSeconds(sessionClock, Date.now());
    setText(elements.globalTimer, formatTime(elapsed));
    setText(elements.sessionStatus, sessionClock.stopped ? "Seance stoppee" : sessionClock.running ? "Seance en cours" : "Seance en pause");
    elements.playSession.disabled = sessionClock.running;
    elements.pauseSession.disabled = !sessionClock.running;
    elements.stopSession.disabled = sessionClock.stopped && !sessionClock.running;
  }

  function renderWorkoutMetrics() {
    const metrics = workoutMetrics(state.workout);
    setText(elements.totalWeight, formatKg(metrics.totalWeightKg));
    setText(elements.kgPerMinute, formatKgPerMinute(metrics.kgPerMinute));
    setText(elements.targetDuration, formatTime(metrics.targetSeconds));
  }

  function currentProgramIndex() {
    return Math.max(0, programLibrary.findIndex((program) => program.id === state.workout.id || program.title === state.workout.title));
  }

  function renderProgramLibrary() {
    clearNode(elements.programSelect);
    programLibrary.forEach((program, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `${program.title} (${program.steps.length} actions)`;
      elements.programSelect.appendChild(option);
    });
    elements.programSelect.value = String(currentProgramIndex());
    elements.programLibraryExport.value = exportProgramLibrary(programLibrary);
  }

  function renderVideo(step) {
    const video = step && step.video;
    setText(elements.videoTitle, step ? step.title : "Mouvement");
    if (!video) {
      elements.videoFrame.hidden = true;
      elements.videoFrame.removeAttribute("src");
      elements.videoFrame.removeAttribute("srcdoc");
      elements.videoFrame.removeAttribute("data-video");
      elements.videoFallback.hidden = false;
      setText(elements.videoFallback, step && step.kind === "rest" ? "Pas de video pour cette pause." : "Aucune video renseignee pour cette etape.");
      return;
    }
    const videoId = youtubeVideoId(video);
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const srcdoc = `<style>*{box-sizing:border-box}body{margin:0;background:#111;color:#fff;font-family:system-ui,sans-serif}a{display:grid;place-items:center;min-height:100vh;color:#fff;text-decoration:none;position:relative;overflow:hidden}img{width:100%;height:100%;object-fit:cover;filter:brightness(.72)}span{position:absolute;display:grid;place-items:center;width:76px;height:54px;border-radius:8px;background:#dc2626;font-weight:900;box-shadow:0 12px 40px rgba(0,0,0,.45)}</style><a href="${video}?autoplay=1"><img src="${thumbnail}" alt=""><span>Play</span></a>`;
    elements.videoFallback.hidden = true;
    elements.videoFrame.hidden = false;
    elements.videoFrame.title = `Video - ${step.title}`;
    if (elements.videoFrame.getAttribute("data-video") !== video) {
      elements.videoFrame.removeAttribute("src");
      elements.videoFrame.setAttribute("srcdoc", srcdoc);
      elements.videoFrame.setAttribute("data-video", video);
    }
  }

  function renderLiveSessionJson() {
    const now = new Date();
    const completedActions = readCompletedActions(localStorage, state.workout, now).actions;
    const liveSession = buildLiveSessionJson(state, sessionClock, now, completedActions);
    setText(elements.liveSessionTitle, liveSession.title);
    elements.liveSessionJson.value = JSON.stringify(liveSession, null, 2);
  }

  async function copyLiveSessionJson() {
    elements.liveSessionJson.select();
    try {
      await navigator.clipboard.writeText(elements.liveSessionJson.value);
    } catch (error) {
      document.execCommand("copy");
    }
    setText(elements.copyNotice, "Copié");
    clearTimeout(copyNoticeTimer);
    copyNoticeTimer = setTimeout(() => setText(elements.copyNotice, ""), 1800);
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
        appendTextNode(
          text,
          "small",
          [step.detail || stepLabel(step), step.seconds ? formatTime(step.seconds) : "", stepVolumeKg(step) ? formatKg(stepVolumeKg(step)) : ""]
            .filter(Boolean)
            .join(" · "),
          "plan-step-meta",
        );
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
    renderSessionClock();
    renderWorkoutMetrics();
    renderVideo(step);
    setText(elements.workoutTitle, state.workout.title);
    setText(elements.athleteNote, state.workout.athleteNote || "Seance chargee depuis l'URL ou l'exemple local.");
    setText(elements.programActionCount, `${state.workout.steps.length} actions`);

    if (state.done) {
      setText(elements.block, "Seance terminee");
      setText(elements.stepType, "Fin");
      setText(elements.running, "Arrete");
      setText(elements.stepCount, `${state.workout.steps.length}/${state.workout.steps.length}`);
      setText(elements.title, "Resume pret");
      setText(elements.detail, "Copie le markdown pour ton agent IA.");
      setText(elements.timer, "00:00");
      elements.timer.hidden = false;
      setText(elements.tempo, "");
      elements.tempo.hidden = true;
      setText(elements.cue, "Ne rajoute pas de volume par inertie. Note le ressenti.");
      elements.progress.style.width = "100%";
      elements.mainAction.textContent = "Recommencer";
      elements.note.value = "";
      elements.note.disabled = true;
      renderPlanList();
      renderSummary();
      renderLiveSessionJson();
      return;
    }

    const timed = isTimedStep(step);
    const tempo = stepTempoText(step);
    setText(elements.block, step.block);
    setText(elements.stepType, stepLabel(step));
    setText(elements.running, state.running ? "En cours" : "En attente");
    setText(elements.stepCount, `${state.currentIndex + 1}/${state.workout.steps.length}`);
    setText(elements.title, step.title);
    setText(elements.detail, step.detail || (step.seconds ? `${step.seconds} s` : ""));
    elements.timer.hidden = !timed;
    elements.tempo.hidden = !tempo;
    setText(elements.timer, timed ? formatTime(state.remainingSeconds) : "");
    setText(elements.tempo, tempo);
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
    renderLiveSessionJson();
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
        kg: step.weightKg,
        reps: step.reps,
        u: step.video,
      })),
    }, null, 2);
    elements.shareUrl.value = `${window.location.origin}${window.location.pathname}?p=${encodeWorkout(rawWorkout)}`;
    if (pushUrl) {
      window.history.replaceState(null, "", `?p=${encodeWorkout(rawWorkout)}`);
    }
    renderForceRestButtons();
    renderProgramLibrary();
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

  function loadSelectedProgram() {
    const index = Math.max(0, Math.min(programLibrary.length - 1, Math.round(Number(elements.programSelect.value) || 0)));
    const selected = programLibrary[index];
    if (selected) loadWorkout(workoutToJson(selected), true);
  }

  function saveCurrentProgram() {
    const current = normalizeWorkout(state.workout);
    const index = programLibrary.findIndex((program) => program.id === current.id || program.title === current.title);
    const nextLibrary = [...programLibrary];
    if (index >= 0) {
      nextLibrary[index] = current;
    } else {
      nextLibrary.push(current);
    }
    programLibrary = saveProgramLibrary(localStorage, nextLibrary);
    renderProgramLibrary();
  }

  async function copyProgramLibraryExport() {
    elements.programLibraryExport.value = exportProgramLibrary(programLibrary);
    elements.programLibraryExport.select();
    try {
      await navigator.clipboard.writeText(elements.programLibraryExport.value);
    } catch (error) {
      document.execCommand("copy");
    }
  }

  function closeSkipDialog() {
    pendingSkipState = null;
    if (elements.skipDialog.open) elements.skipDialog.close();
  }

  function requestSkipCurrentStep() {
    pendingSkipState = state;
    if (elements.skipDialog.showModal) {
      elements.skipDialog.showModal();
      return;
    }
    setState(goToNext(state, (message) => window.confirm(message)));
  }

  elements.mainAction.addEventListener("click", () => {
    if (state.done) {
      setState(createInitialState(state.workout));
      return;
    }
    const step = currentStep(state);
    if (step.kind === "work") {
      recordCompletedStep(state, localStorage, new Date());
      setState(completeCurrentStep(state));
      return;
    }
    setState(toggleTimer(state));
  });
  elements.next.addEventListener("click", () => {
    const step = currentStep(state);
    if (step && step.kind === "work") {
      requestSkipCurrentStep();
      return;
    }
    setState(goToNext(state));
  });
  elements.cancelSkip.addEventListener("click", closeSkipDialog);
  elements.confirmSkip.addEventListener("click", () => {
    const stateToSkip = pendingSkipState || state;
    closeSkipDialog();
    setState(goToNext(stateToSkip, () => true));
  });
  elements.previous.addEventListener("click", () => setState(goToPrevious(state)));
  elements.addTime.addEventListener("click", () => setState(addTime(state, state.workout.add)));
  elements.reset.addEventListener("click", () => setState(createInitialState(state.workout)));
  elements.note.addEventListener("input", () => setState(updateCurrentNote(state, elements.note.value)));
  elements.loadJson.addEventListener("click", loadFromText);
  $("#loadProgram").addEventListener("click", loadSelectedProgram);
  $("#saveProgram").addEventListener("click", saveCurrentProgram);
  $("#exportPrograms").addEventListener("click", copyProgramLibraryExport);
  elements.programLibraryExport.addEventListener("click", copyProgramLibraryExport);
  elements.music.addEventListener("click", openMusicPlaylist);
  elements.playSession.addEventListener("click", () => setSessionClock(playSessionClock(sessionClock, Date.now())));
  elements.pauseSession.addEventListener("click", () => setSessionClock(pauseSessionClock(sessionClock, Date.now())));
  elements.stopSession.addEventListener("click", () => setSessionClock(stopSessionClock(sessionClock, Date.now())));
  elements.liveSessionJson.addEventListener("click", copyLiveSessionJson);
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
    const stepBeforeTick = currentStep(state);
    const next = tick(state);
    if (sessionClock.running) saveSessionClock();
    if (next !== state) {
      if (stepBeforeTick && stepBeforeTick.kind === "work" && next.currentIndex !== state.currentIndex) {
        recordCompletedStep({ ...state, remainingSeconds: 0 }, localStorage, new Date());
      }
      setState(next);
    } else if (sessionClock.running) {
      render();
    }
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
