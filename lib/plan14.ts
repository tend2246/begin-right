// lib/plan14.ts
import type { OnboardingAnswers, SessionLength } from "./storage";

/* =========================
   TYPES
========================= */

export type ExerciseId =
  | "squat"
  | "chair_sit_to_stand"
  | "incline_pushup"
  | "glute_bridge"
  | "dead_bug"
  | "bird_dog"
  | "plank"
  | "step_back_lunge"
  | "row_towel";

export type Exercise = {
  id: ExerciseId;
  title: string;
  sets: number;
  reps: string;
  rest: string;
  /**
   * Tempo hard-code theo bài (chỉ áp dụng cho mode=reps).
   * - Với bài "mỗi bên": 1 rep = đủ 2 bên (trái + phải)
   */
  secondsPerRep?: number;
  how: {
    start: string[];
    move: string[];
    breathe: string[];
    safety: string[];
  };
};

export type DayPlan =
  | {
      type: "work";
      day: number;
      title: string;
      why: string;
      exercises: Exercise[];
    }
  | {
      type: "recovery";
      day: number;
      title: string;
      why: string;
      suggestions: string[];
    };

/* =========================
   EXERCISES
========================= */

const squat: Exercise = {
  id: "squat",
  title: "Squat (Bodyweight)",
  sets: 3,
  reps: "8–10",
  rest: "60s",
  secondsPerRep: 3,
  how: {
    start: [
      "Hai chân rộng bằng vai, mũi chân hơi hướng ra ngoài.",
      "Siết nhẹ bụng, lưng trung lập.",
    ],
    move: [
      "Hạ người xuống 2 giây, đẩy hông ra sau.",
      "Gối hướng theo mũi chân.",
      "Đẩy sàn để đứng lên 1 giây.",
    ],
    breathe: ["Hít vào khi hạ xuống.", "Thở ra khi đứng lên."],
    safety: [
      "Đau gối: giảm biên độ.",
      "Lưng khó chịu: giảm tốc độ.",
    ],
  },
};

const chairSitToStand: Exercise = {
  id: "chair_sit_to_stand",
  title: "Chair Sit-to-Stand",
  sets: 3,
  reps: "8–10",
  rest: "60s",
  secondsPerRep: 3,
  how: {
    start: [
      "Ngồi trên ghế chắc chắn, bàn chân đặt chắc trên sàn.",
      "Chân rộng bằng vai.",
    ],
    move: [
      "Ngồi xuống ghế chậm 2 giây.",
      "Đứng dậy bằng lực chân 1 giây.",
      "Chuyển động mượt, không bật mạnh.",
    ],
    breathe: ["Hít vào khi ngồi xuống.", "Thở ra khi đứng lên."],
    safety: [
      "Gối nhạy: dùng ghế cao.",
      "Đau nhói: dừng.",
    ],
  },
};

const inclinePushup: Exercise = {
  id: "incline_pushup",
  title: "Incline Push-up",
  sets: 3,
  reps: "6–10",
  rest: "60s",
  secondsPerRep: 4,
  how: {
    start: [
      "Tay đặt trên bàn/ghế chắc chắn.",
      "Thân người thẳng.",
    ],
    move: [
      "Hạ người xuống 2 giây (khuỷu ~45°).",
      "Đẩy người lên 2 giây, không giật.",
      "Giữ thân người thẳng trong suốt chuyển động.",
    ],
    breathe: [
      "Hít vào khi hạ.",
      "Thở ra khi đẩy.",
    ],
    safety: [
      "Đau vai: nâng cao điểm tựa.",
      "Đau cổ tay: đổi góc tay.",
    ],
  },
};

const deadBug: Exercise = {
  id: "dead_bug",
  title: "Dead Bug",
  sets: 2,
  reps: "6–8 mỗi bên",
  rest: "45–60s",
  // 1 rep = trái + phải (tổng ~6 giây)
  secondsPerRep: 6,
  how: {
    start: [
      "Nằm ngửa, tay hướng lên, gối co.",
      "Lưng áp sát sàn, bụng căng nhẹ.",
    ],
    move: [
      "Duỗi tay và chân bên trái chậm 3 giây.",
      "Thu về vị trí ban đầu.",
      "Đổi sang bên phải chậm 3 giây.",
      "(1 rep = trái + phải)",
    ],
    breathe: ["Thở đều, không nín thở."],
    safety: [
      "Lưng bật: giảm biên độ.",
    ],
  },
};

const gluteBridge: Exercise = {
  id: "glute_bridge",
  title: "Glute Bridge",
  sets: 3,
  reps: "10–12",
  rest: "60s",
  secondsPerRep: 3,
  how: {
    start: [
      "Nằm ngửa, gối gập.",
      "Siết bụng nhẹ.",
    ],
    move: [
      "Nâng hông lên 1 giây.",
      "Giữ và siết mông ở đỉnh 1 giây.",
      "Hạ hông xuống 1 giây.",
    ],
    breathe: [
      "Hít vào khi hạ.",
      "Thở ra khi nâng.",
    ],
    safety: [
      "Không ưỡn lưng quá.",
    ],
  },
};

const birdDog: Exercise = {
  id: "bird_dog",
  title: "Bird Dog",
  sets: 2,
  reps: "6–8 mỗi bên",
  rest: "45–60s",
  // 1 rep = trái + phải (tổng ~6 giây)
  secondsPerRep: 6,
  how: {
    start: [
      "Chống tay gối.",
      "Lưng trung lập.",
    ],
    move: [
      "Duỗi tay và chân bên trái 3 giây.",
      "Giữ thân người ổn định.",
      "Đổi sang bên phải 3 giây.",
      "(1 rep = trái + phải)",
    ],
    breathe: ["Thở đều, không nín thở."],
    safety: [
      "Không xoay hông.",
    ],
  },
};

const plank: Exercise = {
  id: "plank",
  title: "Forearm Plank",
  sets: 2,
  reps: "20–30s",
  rest: "60s",
  how: {
    start: [
      "Chống khuỷu tay ngay dưới vai.",
      "Duỗi thẳng chân ra sau, thân người thẳng.",
    ],
    move: [
      "Siết bụng và mông liên tục.",
      "Giữ lưng thẳng, không võng.",
      "(Thời gian giữ do app quản lý)",
    ],
    breathe: ["Thở đều, chậm và sâu."],
    safety: [
      "Võng lưng: hạ gối xuống sàn.",
      "Đau vai: thu hẹp khoảng cách khuỷu tay.",
    ],
  },
};

const stepBackLunge: Exercise = {
  id: "step_back_lunge",
  title: "Step-back Lunge",
  sets: 3,
  reps: "6–8 mỗi bên",
  rest: "60s",
  // 1 rep = trái + phải (mỗi bên ~4 giây)
  secondsPerRep: 8,
  how: {
    start: [
      "Đứng thẳng.",
      "Siết bụng nhẹ.",
    ],
    move: [
      "Bước lùi và hạ người bên trái 4 giây.",
      "Đẩy gót chân trước để đứng lên.",
      "Đổi sang bên phải 4 giây.",
      "(1 rep = trái + phải)",
    ],
    breathe: [
      "Hít vào khi hạ.",
      "Thở ra khi đứng.",
    ],
    safety: [
      "Gối nhạy: giảm biên độ.",
    ],
  },
};

const rowsTowel: Exercise = {
  id: "row_towel",
  title: "Towel Row",
  sets: 3,
  reps: "8–10",
  rest: "60s",
  secondsPerRep: 3,
  how: {
    start: [
      "Quấn khăn qua điểm tựa chắc chắn (cột, thanh cố định).",
      "Hai tay giữ khăn, bước chân ra sau và hơi ngả người.",
      "Giữ lưng thẳng, bụng siết nhẹ.",
    ],
    move: [
      "Kéo người về phía điểm tựa 1 giây.",
      "Giữ siết cơ lưng 1 giây.",
      "Duỗi tay ra chậm 1 giây, không thả rơi.",
    ],
    breathe: [
      "Thở ra khi kéo.",
      "Hít vào khi về.",
    ],
    safety: [
      "Chỉ làm nếu điểm tựa chắc.",
    ],
  },
};

/* =========================
   PLAN
========================= */

export const PLAN_14_DAYS: DayPlan[] = [
  { type: "work", day: 1, title: "Ngày 1 — Nền tảng", why: "Làm quen nhịp tập.", exercises: [squat, inclinePushup, deadBug] },
  { type: "work", day: 2, title: "Ngày 2 — Mông & core", why: "Ổn định hông–core.", exercises: [gluteBridge, birdDog, plank] },
  { type: "recovery", day: 3, title: "Ngày 3 — Hồi phục", why: "Tránh quá tải.", suggestions: ["Đi bộ nhẹ.", "Giãn nhẹ."] },

  { type: "work", day: 4, title: "Ngày 4 — Toàn thân", why: "Nhịp chậm, form chắc.", exercises: [squat, inclinePushup, plank] },
  { type: "work", day: 5, title: "Ngày 5 — Chân", why: "Cân bằng & kiểm soát.", exercises: [stepBackLunge, gluteBridge, deadBug] },
  { type: "recovery", day: 6, title: "Ngày 6 — Hồi phục", why: "Giữ nhịp.", suggestions: ["Đi bộ.", "Thở chậm."] },

  { type: "work", day: 7, title: "Ngày 7 — Lưng", why: "Cân bằng vai.", exercises: [rowsTowel, inclinePushup, birdDog] },
  { type: "work", day: 8, title: "Ngày 8 — Toàn thân", why: "Tăng nhẹ volume.", exercises: [squat, rowsTowel, deadBug] },
  { type: "recovery", day: 9, title: "Ngày 9 — Hồi phục", why: "Không quá tải.", suggestions: ["Đi bộ.", "Giãn nhẹ."] },

  { type: "work", day: 10, title: "Ngày 10 — Chân & core", why: "Củng cố nền.", exercises: [stepBackLunge, plank, deadBug] },
  { type: "work", day: 11, title: "Ngày 11 — Ôn form", why: "Tập chắc.", exercises: [squat, inclinePushup, birdDog] },
  { type: "recovery", day: 12, title: "Ngày 12 — Hồi phục", why: "Chuẩn bị kết.", suggestions: ["Mobility nhẹ."] },

  { type: "work", day: 13, title: "Ngày 13 — Tự tin", why: "Nhịp đều.", exercises: [squat, rowsTowel, plank] },
  { type: "work", day: 14, title: "Ngày 14 — Kết thúc", why: "Giữ cơ bản.", exercises: [gluteBridge, inclinePushup, deadBug] },
];

/* =========================
   HELPERS
========================= */

export function adjustForSessionLength(ex: Exercise, sessionLength: SessionLength): Exercise {
  if (sessionLength === 15) {
    return { ...ex, sets: Math.max(1, ex.sets - 1) };
  }
  if (sessionLength === 40 && !ex.reps.includes("s")) {
    return { ...ex, sets: ex.sets + 1 };
  }
  return ex;
}

export function applyHealthPreset(
  dayPlan: DayPlan,
  preset: "normal" | "knee_safe" | "back_safe"
): DayPlan {
  if (dayPlan.type !== "work") return dayPlan;

  let exercises = dayPlan.exercises;

  if (preset === "knee_safe") {
    exercises = exercises.map((e) =>
      e.id === "squat" ? chairSitToStand :
      e.id === "step_back_lunge" ? gluteBridge :
      e
    );
  }

  if (preset === "back_safe") {
    exercises = exercises.map((e) =>
      e.id === "plank" ? birdDog : e
    );
  }

  return { ...dayPlan, exercises };
}

export function applyFitnessCheckPreset(
  dayPlan: DayPlan,
  answers: OnboardingAnswers
): DayPlan {
  if (dayPlan.type !== "work") return dayPlan;

  const { squat, push, balance } = answers.fitnessCheck;

  let exercises = dayPlan.exercises;

  if (squat === "C" || squat === "D") {
    exercises = exercises.map((e) =>
      e.id === "squat" ? chairSitToStand : e
    );
  }

  if (push === "C" || push === "D") {
    exercises = exercises.map((e) =>
      e.id === "incline_pushup" ? inclinePushup : e
    );
  }

  if (balance === "C" || balance === "D") {
    exercises = exercises.map((e) =>
      e.id === "step_back_lunge" ? gluteBridge : e
    );
  }

  return { ...dayPlan, exercises };
}
