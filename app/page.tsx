"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { loadState, resetAll } from "@/lib/storage";

type Status = "no_onboarding" | "training" | "safety" | "stop";

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  const state = useMemo(() => (ready ? loadState() : null), [ready]);

  const status: Status = useMemo(() => {
    if (!state?.onboarding?.decision) return "no_onboarding";
    const r = state.onboarding.decision.resultType;
    if (r === "stop") return "stop";
    if (r === "safety") return "safety";
    return "training";
  }, [state]);

  const currentDay = state?.progress.dayIndex ?? 1;
  const completedDays = state?.progress.completedDays ?? [];

  function primaryCTA() {
    if (status === "no_onboarding") router.push("/onboarding");
    else if (status === "stop") router.push("/stop");
    else if (status === "safety") router.push("/safety");
    else router.push(`/day/${currentDay}`);
  }

  function primaryLabel() {
    if (status === "no_onboarding") return "Bắt đầu thiết lập";
    if (status === "stop") return "Xem thông báo";
    if (status === "safety") return "Xem nội dung an toàn";
    return `Tiếp tục Ngày ${currentDay}`;
  }

  if (!ready || !state) {
    return (
      <main style={{ minHeight: "100vh", padding: 16 }}>
        <div style={{ maxWidth: 420, margin: "0 auto", opacity: 0.7 }}>Đang tải…</div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", padding: 16 }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ opacity: 0.7, fontSize: 14 }}>Begin Right</div>

        <h1 style={{ fontSize: 28, marginTop: 8 }}>Bắt đầu đúng. Đi xa hơn.</h1>

        <p style={{ opacity: 0.85, marginTop: 8 }}>
          Chúng tôi giúp bạn tập từng bước, không quá tải, và an toàn ngay từ đầu.
        </p>

        {/* Status card */}
        <section style={card}>
          <div style={{ fontWeight: 800 }}>Trạng thái</div>

          {status === "no_onboarding" && (
            <p style={{ opacity: 0.85, marginTop: 6 }}>
              Bạn chưa thiết lập. Chúng tôi sẽ hỏi vài câu ngắn để chọn nhịp tập phù hợp.
            </p>
          )}

          {status !== "no_onboarding" && (
            <div style={{ marginTop: 8, opacity: 0.9, fontSize: 14, lineHeight: 1.5 }}>
              <div>
                Kết quả: <b>{state.onboarding!.decision.resultType}</b>
              </div>

              {"level" in state.onboarding!.decision && (
                <>
                  <div>
                    Level: <b>{state.onboarding!.decision.level}</b>
                  </div>
                  <div>
                    Chế độ: <b>{state.onboarding!.decision.healthPreset}</b>
                  </div>
                </>
              )}

              <div>
                Tiến trình: <b>Ngày {currentDay}/14</b>
              </div>
            </div>
          )}
        </section>

        {/* Progress */}
        {status === "training" && (
          <section style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <div style={{ fontWeight: 800 }}>Tiến trình 14 ngày</div>
              <div style={{ opacity: 0.7, fontSize: 13 }}>Tap để xem</div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 8,
                marginTop: 10,
              }}
            >
              {Array.from({ length: 14 }).map((_, i) => {
                const d = i + 1;
                const done = completedDays.includes(d);
                const today = d === currentDay;

                return (
                  <button
                    key={d}
                    onClick={() => router.push(`/day/${d}`)}
                    style={{
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 12,
                      padding: "10px 0",
                      cursor: "pointer",
                      opacity: d > currentDay ? 0.45 : 1,
                      background: today ? "rgba(255,255,255,0.12)" : "transparent",
                    }}
                    aria-label={`Ngày ${d}`}
                  >
                    <div style={{ fontWeight: 800 }}>{d}</div>
                    <div style={{ fontSize: 10, opacity: 0.7 }}>
                      {done ? "xong" : today ? "hôm nay" : "—"}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 10 }}>
              Gợi ý: nếu thấy quá tải, chọn nhịp chậm hơn — mục tiêu là đều và đúng.
            </div>
          </section>
        )}

        {/* CTA */}
        <button onClick={primaryCTA} style={btnPrimary}>
          {primaryLabel()}
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <button onClick={() => router.push("/onboarding")} style={btn}>
            {status === "no_onboarding" ? "Onboarding" : "Chỉnh thiết lập"}
          </button>

          <button
            onClick={() => {
              resetAll();
              router.push("/onboarding");
            }}
            style={btn}
          >
            Làm lại từ đầu
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

const btnPrimary: React.CSSProperties = {
  width: "100%",
  marginTop: 14,
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 16,
  padding: "12px 14px",
  cursor: "pointer",
};

const btn: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 16,
  padding: "12px 14px",
  cursor: "pointer",
};
