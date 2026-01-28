// lib/plan14.ts
import type { SessionLength } from "./storage";

export type Exercise = {
  title: string;
  sets: number;
  reps: string;
  rest: string;
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

const squat: Exercise = {
  title: "Squat (Bodyweight)",
  sets: 3,
  reps: "8–10",
  rest: "60s",
  how: {
    start: [
      "Hai chân rộng bằng vai, mũi chân hơi hướng ra ngoài.",
      "Siết nhẹ bụng, lưng trung lập (không gù, không ưỡn quá).",
    ],
    move: [
      "Đẩy hông ra sau rồi ngồi xuống như ngồi ghế.",
      "Gối hướng theo mũi chân, không sụp vào trong.",
      "Đứng lên bằng cách đẩy sàn, giữ thân trên ổn định.",
    ],
    breathe: ["Hít vào khi hạ xuống.", "Thở ra khi đứng lên."],
    safety: [
      "Đau gối: giảm biên độ hoặc chuyển sang Chair Sit-to-Stand.",
      "Lưng khó chịu: giảm tốc độ, ưu tiên kiểm soát.",
    ],
  },
};

const chairSitToStand: Exercise = {
  title: "Chair Sit-to-Stand (đứng lên ngồi xuống ghế)",
  sets: 3,
  reps: "8–10",
  rest: "60s",
  how: {
    start: [
      "Ngồi trên ghế chắc chắn, chân đặt vững, rộng bằng vai.",
      "Ngực mở, lưng trung lập, mắt nhìn thẳng.",
    ],
    move: [
      "Dồn lực vào gót chân, đứng lên chậm rãi.",
      "Chạm mông nhẹ ghế khi ngồi xuống, không “rơi” tự do.",
    ],
    breathe: ["Hít vào khi ngồi xuống.", "Thở ra khi đứng lên."],
    safety: [
      "Đầu gối nhạy: dùng ghế cao hơn hoặc giảm biên độ.",
      "Nếu đau nhói: dừng lại.",
    ],
  },
};

const inclinePushup: Exercise = {
  title: "Incline Push-up (chống đẩy cao)",
  sets: 3,
  reps: "6–10",
  rest: "60s",
  how: {
    start: ["Tay đặt lên bàn/ghế chắc chắn.", "Thân người thẳng, siết mông nhẹ."],
    move: ["Hạ người xuống, khuỷu ~45°.", "Đẩy lên, vai không nhô lên tai."],
    breathe: ["Hít vào khi hạ xuống.", "Thở ra khi đẩy lên."],
    safety: ["Đau vai: nâng cao điểm tựa hơn.", "Đau cổ tay: thử nắm đấm hoặc đổi góc tay."],
  },
};

const deadBug: Exercise = {
  title: "Dead Bug (core kiểm soát)",
  sets: 2,
  reps: "6–8 mỗi bên",
  rest: "45–60s",
  how: {
    start: ["Nằm ngửa, gối 90°, tay hướng lên trần.", "Ép nhẹ lưng dưới xuống sàn."],
    move: ["Duỗi chậm tay phải + chân trái.", "Quay về, đổi bên."],
    breathe: ["Hít vào chuẩn bị.", "Thở ra khi duỗi, giữ bụng ổn định."],
    safety: ["Nếu lưng bật: giảm biên độ.", "Mỏi nhanh: giảm rep, ưu tiên đúng form."],
  },
};

const gluteBridge: Exercise = {
  title: "Glute Bridge (cầu mông)",
  sets: 3,
  reps: "10–12",
  rest: "60s",
  how: {
    start: ["Nằm ngửa, gối gập, bàn chân đặt vững.", "Siết nhẹ bụng, cằm thu nhẹ."],
    move: ["Đẩy hông lên tới khi thân thành đường thẳng.", "Hạ xuống chậm rãi."],
    breathe: ["Hít vào khi hạ.", "Thở ra khi nâng hông."],
    safety: ["Không ưỡn lưng quá.", "Nếu lưng khó chịu: giảm biên độ."],
  },
};

const birdDog: Exercise = {
  title: "Bird Dog (ổn định lưng)",
  sets: 2,
  reps: "6–8 mỗi bên",
  rest: "45–60s",
  how: {
    start: ["Chống tay gối, lưng trung lập.", "Siết bụng nhẹ."],
    move: ["Duỗi tay phải + chân trái chậm.", "Giữ 1 nhịp, đổi bên."],
    breathe: ["Thở đều, không nín thở."],
    safety: ["Không xoay hông.", "Nếu lưng căng: giảm biên độ/giữ thời gian ngắn hơn."],
  },
};

const plank: Exercise = {
  title: "Forearm Plank (plank khuỷu tay)",
  sets: 2,
  reps: "20–30s",
  rest: "60s",
  how: {
    start: ["Khuỷu dưới vai, chân duỗi.", "Siết mông và bụng nhẹ."],
    move: ["Giữ thân thẳng, không võng lưng."],
    breathe: ["Thở đều, chậm."],
    safety: ["Nếu lưng võng: giảm thời gian.", "Đau vai: chuyển sang plank cao."],
  },
};

const stepBackLunge: Exercise = {
  title: "Step-back Lunge (lunge lùi)",
  sets: 3,
  reps: "6–8 mỗi bên",
  rest: "60s",
  how: {
    start: ["Đứng thẳng, chân rộng bằng hông.", "Siết bụng nhẹ."],
    move: ["Bước 1 chân lùi, hạ xuống kiểm soát.", "Đẩy về đứng thẳng."],
    breathe: ["Hít vào khi hạ.", "Thở ra khi đứng lên."],
    safety: ["Gối nhạy: rút ngắn bước, giảm biên độ.", "Đau nhói: dừng."],
  },
};

const rowsTowel: Exercise = {
  title: "Towel Row (kéo khăn – nhẹ)",
  sets: 3,
  reps: "8–10",
  rest: "60s",
  how: {
    start: [
      "Quấn khăn chắc quanh tay nắm cửa (đảm bảo an toàn).",
      "Ngả người nhẹ, lưng trung lập.",
    ],
    move: ["Kéo khuỷu về sau, siết bả vai.", "Trở về chậm."],
    breathe: ["Thở ra khi kéo.", "Hít vào khi về."],
    safety: ["Chỉ làm nếu điểm tựa chắc chắn.", "Đau vai: giảm lực kéo."],
  },
};

export const PLAN_14_DAYS: DayPlan[] = [
  { type: "work", day: 1, title: "Ngày 1 — Nền tảng toàn thân", why: "Làm quen nhịp tập + kiểm soát chuyển động. Ưu tiên an toàn, không kiệt sức.", exercises: [squat, inclinePushup, deadBug] },
  { type: "work", day: 2, title: "Ngày 2 — Mông & core ổn định", why: "Tăng hỗ trợ hông–core để các ngày sau squat/lunge chắc hơn.", exercises: [gluteBridge, birdDog, plank] },
  { type: "recovery", day: 3, title: "Ngày 3 — Hồi phục chủ động", why: "Cơ thể cần nhịp hồi phục để tiến bộ bền, tránh quá tải.", suggestions: ["Đi bộ nhẹ 10–20 phút (thoải mái).", "Giãn nhẹ hông/cổ chân 5 phút.", "Ngủ đủ và uống nước."] },

  { type: "work", day: 4, title: "Ngày 4 — Toàn thân (nhịp chậm)", why: "Lặp lại nền tảng với nhịp chậm hơn để form ổn định.", exercises: [squat, inclinePushup, plank] },
  { type: "work", day: 5, title: "Ngày 5 — Chân (kèm lunge lùi)", why: "Thêm bài 1 chân để cải thiện cân bằng và kiểm soát gối–hông.", exercises: [stepBackLunge, gluteBridge, deadBug] },
  { type: "recovery", day: 6, title: "Ngày 6 — Hồi phục", why: "Giữ nhịp đều: hồi phục giúp bạn tập tiếp mà không nản.", suggestions: ["Đi bộ nhẹ 10–20 phút.", "Thở chậm 3 phút (thở ra dài).", "Nếu mỏi: nghỉ hoàn toàn cũng được."] },

  { type: "work", day: 7, title: "Ngày 7 — Lưng & tư thế", why: "Bổ sung kéo (row) để cân bằng vai – giúp chống đẩy an toàn hơn.", exercises: [rowsTowel, inclinePushup, birdDog] },
  { type: "work", day: 8, title: "Ngày 8 — Toàn thân (tăng chút volume)", why: "Tăng nhẹ khối lượng để bạn thấy mình tiến bộ nhưng vẫn trong kiểm soát.", exercises: [squat, rowsTowel, deadBug] },
  { type: "recovery", day: 9, title: "Ngày 9 — Hồi phục", why: "Giữ cảm giác “không quá tải” đúng triết lý Begin Right.", suggestions: ["Đi bộ nhẹ 15–25 phút.", "Giãn bắp đùi trước/đùi sau nhẹ.", "Nếu có đau nhói: dừng tập."] },

  { type: "work", day: 10, title: "Ngày 10 — Chân & core", why: "Củng cố chân–core: nền tảng cho mọi hoạt động hàng ngày.", exercises: [stepBackLunge, plank, deadBug] },
  { type: "work", day: 11, title: "Ngày 11 — Toàn thân (ôn form)", why: "Ôn form là cách tăng tiến nhanh nhất cho người mới.", exercises: [squat, inclinePushup, birdDog] },
  { type: "recovery", day: 12, title: "Ngày 12 — Hồi phục", why: "Gần về cuối lộ trình, hồi phục giúp bạn hoàn thành đẹp.", suggestions: ["Đi bộ nhẹ 10–20 phút.", "Mobility nhẹ: cổ chân/khớp hông.", "Ngủ đủ."] },

  { type: "work", day: 13, title: "Ngày 13 — Toàn thân (tự tin hơn)", why: "Bạn đã có nền. Hôm nay tập chắc, nhịp đều.", exercises: [squat, rowsTowel, plank] },
  { type: "work", day: 14, title: "Ngày 14 — Kết thúc đẹp", why: "Ngày cuối: làm tốt những thứ cơ bản. Bạn đã bắt đầu đúng.", exercises: [gluteBridge, inclinePushup, deadBug] },
];

// Điều chỉnh nhỏ theo thời lượng buổi tập
export function adjustForSessionLength(ex: Exercise, sessionLength: SessionLength): Exercise {
  if (sessionLength === 15) {
    return { ...ex, sets: Math.max(1, ex.sets - 1) };
  }
  if (sessionLength === 40) {
    return { ...ex, sets: ex.sets + 1 };
  }
  return ex; // 25 phút giữ nguyên
}

// Điều chỉnh theo preset khớp
export function applyHealthPreset(
  dayPlan: DayPlan,
  preset: "normal" | "knee_safe" | "back_safe"
): DayPlan {
  if (dayPlan.type !== "work") return dayPlan;

  let exercises = dayPlan.exercises;

  if (preset === "knee_safe") {
    exercises = exercises.map((e) => (e.title.startsWith("Squat") ? chairSitToStand : e));
    exercises = exercises.map((e) => (e.title.startsWith("Step-back Lunge") ? gluteBridge : e));
  }

  if (preset === "back_safe") {
    // ưu tiên bài ổn định lưng + giảm plank nếu khó
    exercises = exercises.map((e) => (e.title.startsWith("Forearm Plank") ? birdDog : e));
  }

  return { ...dayPlan, exercises };
}
