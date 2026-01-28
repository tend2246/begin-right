"use client";

import { useRouter } from "next/navigation";
import { resetAll } from "@/lib/storage";

export default function SafetyPage() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", padding: 16 }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ opacity: 0.7, fontSize: 14 }}>Begin Right · Safety</div>

        <h1 style={{ fontSize: 26, marginTop: 8 }}>
          Chúng tôi sẽ ưu tiên an toàn cho bạn
        </h1>

        <p style={{ opacity: 0.85, marginTop: 8 }}>
          Dựa trên câu trả lời của bạn, chúng tôi chưa đề xuất lộ trình 14 ngày ngay.
          Bạn vẫn có thể xem những nguyên tắc tập an toàn để xây nền đúng trước.
        </p>

        <section style={card}>
          <div style={{ fontWeight: 700 }}>Nguyên tắc an toàn (rất ngắn)</div>
          <ul style={{ marginTop: 8, paddingLeft: 18, opacity: 0.9 }}>
            <li>Dừng lại nếu đau nhói, đau lan, tê hoặc chóng mặt.</li>
            <li>Ưu tiên tập chậm, kiểm soát, không “cố thêm rep”.</li>
            <li>Nếu phân vân, chọn phiên bản nhẹ hơn.</li>
          </ul>
        </section>

        <section style={card}>
          <div style={{ fontWeight: 700 }}>Gợi ý bắt đầu (MVP)</div>
          <ul style={{ marginTop: 8, paddingLeft: 18, opacity: 0.9 }}>
            <li>Đi bộ nhẹ 5–10 phút nếu thấy thoải mái.</li>
            <li>Tập thở chậm 3 phút (hít vào mũi, thở ra dài).</li>
            <li>Mobility rất nhẹ cho hông/cổ chân.</li>
          </ul>
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
            (Sau này mình sẽ thêm “Safety Plan 7 ngày” cho trang này.)
          </div>
        </section>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <button
            onClick={() => router.push("/onboarding")}
            style={btn}
          >
            Làm lại onboarding
          </button>

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
            style={{ ...btn, opacity: 0.85 }}
          >
            Xoá thiết lập trên thiết bị
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
