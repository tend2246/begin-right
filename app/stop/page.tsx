"use client";

import { useRouter } from "next/navigation";
import { resetAll } from "@/lib/storage";

export default function StopPage() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", padding: 16 }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ opacity: 0.7, fontSize: 14 }}>Begin Right · Stop</div>

        <h1 style={{ fontSize: 26, marginTop: 8 }}>
          Chúng tôi cần dừng lại ở đây
        </h1>

        <p style={{ opacity: 0.85, marginTop: 8 }}>
          Chúng tôi rất tiếc. Begin Right chưa được thiết kế để hỗ trợ tình trạng bạn chọn.
          Để đảm bảo an toàn, chúng tôi không thể đề xuất lộ trình tập luyện.
        </p>

        <section style={card}>
          <div style={{ fontWeight: 700 }}>Bạn có thể làm gì tiếp theo?</div>
          <ul style={{ marginTop: 8, paddingLeft: 18, opacity: 0.9 }}>
            <li>Tham khảo ý kiến bác sĩ hoặc chuyên gia phục hồi chức năng.</li>
            <li>Hỏi rõ: “Tôi có thể vận động bodyweight mức nhẹ không?”</li>
            <li>Nếu có đau nhói/lan/tê, hãy ưu tiên kiểm tra y tế.</li>
          </ul>
        </section>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <button
            onClick={() => router.push("/")}
            style={btn}
          >
            Về Home
          </button>

          <button
            onClick={() => {
              resetAll();
              router.push("/onboarding");
            }}
            style={btn}
          >
            Làm lại onboarding
          </button>
        </div>

        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>
          Nội dung mang tính tham khảo, không thay thế tư vấn y tế.
        </div>
      </div>
    </main>
  );
}

const card: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 16,
  padding: 14,
  marginTop: 14,
};

const btn: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 16,
  padding: "12px 14px",
  cursor: "pointer",
};
