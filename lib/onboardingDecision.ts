// lib/onboardingDecision.ts
// Quyết định level & chế độ dựa trên câu trả lời onboarding (MVP đơn giản)

import type {
  OnboardingAnswers,
  OnboardingDecision,
  Level,
} from "./storage";

export function decideOnboarding(answers: OnboardingAnswers): OnboardingDecision {
  // 1) Nếu healthGroup = other → dừng (Begin Right không hỗ trợ)
  if (answers.healthGroup === "other") {
    return {
      resultType: "stop",
      reason:
        "Chúng tôi rất tiếc. Begin Right chưa thể hỗ trợ tình trạng bạn chọn. Để an toàn, chúng tôi không đề xuất lộ trình tập.",
    };
  }

  // 2) Nếu người dùng tự đánh giá form chưa ổn → Safety
  // (MVP: cho xem nội dung an toàn)
  if (answers.levelSelfCheck === "not_ok") {
    return {
      resultType: "safety",
      reason:
        "Chúng tôi sẽ ưu tiên an toàn trước. Bạn có thể xem hướng dẫn nền tảng và các nguyên tắc tập an toàn.",
    };
  }

  // 3) Training: quyết định level theo thời lượng (MVP)
  // - 15 phút: beginner
  // - 25/40 phút: beginner_plus
  const level: Level = answers.sessionLength === 15 ? "beginner" : "beginner_plus";

  // 4) Health preset
  const healthPreset =
    answers.healthGroup === "knee"
      ? "knee_safe"
      : answers.healthGroup === "back"
        ? "back_safe"
        : "normal";

  return {
    resultType: "training",
    level,
    healthPreset,
  };
}
