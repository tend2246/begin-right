"use client";

import CoachTimerOverlay, { type CoachTimerPlan } from "@/components/CoachTimerOverlay";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { loadState, markDayComplete } from "@/lib/storage";
import { PLAN_14_DAYS, adjustForSessionLength, applyHealthPreset } from "@/lib/plan14";

export default function DayPage() {
  const router = useRouter();
  const params = useParams<{ n: string }>();

  const day = Number(params.n);
  const [ready, setReady] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerPlan, setTimerPlan] = useState<CoachTimerPlan | null>(null);

  useEffect(() => setReady(true), []);

  const state = useMemo(() => (ready ? loadState() : null), [ready]);

  const resolved = useMemo(() => {
    if (!state) return null;

    const decision = state.onboarding?.decision;
    const answers = state.onboarding?.answers;

    if (!decision || !answers) return null;

    const base = PLAN_14_DAYS.find((d) => d.day === day);
    if (!base) return null;

    if (decision.resultType !== "training") return null;

    // health preset
    let plan = applyHealthPreset(base, decision.healthPreset);

    // session length (chỉ áp cho ngày work)
    if (plan.type === "work") {
      plan = {
        ...plan,
        exercises: plan.exercises.map((ex) => adjustForSessionLength(ex, answers.sessionLength)),
      };
    }

    return plan;
  }, [state, day]);

  useEffect(() => {
    if (!ready) return;

    if (!Number.isFinite(day) || day < 1 || day > 14) {
      router.replace("/");
      return;
    }

    const s = loadState();
    const decision = s.onboarding?.decision;

    if (!decision) {
      router.replace("/onboarding");
      return;
    }
    if (decision.resultType === "stop") {
      router.replace("/stop");
      return;
    }
    if (decision.resultType === "safety") {
      router.replace("/safety");
      return;
    }
  }, [day, ready, router]);

  if (!ready || !state) {
    return (
      <main style={{ minHeight: "100vh", padding: 16 }}>
        <div style={{ maxWidth: 420, margin: "0 auto", opacity: 0.7 }}>Đang tải…</div>
      </main>
    );
  }

  if (!resolved) {
    return (
      <main style={{ minHeight: "100vh", padding: 16 }}>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <div style={{ opacity: 0.7 }}>Không tìm thấy kế hoạch cho ngày này.</div>
          <button onClick={() => router.push("/")} style={btnPrimary}>Về Home</button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", padding: 16 }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <button onClick={() => router.push("/")} style={btnSmall}>Home</button>
          <div style={{ opacity: 0.7, fontSize: 14 }}>Ngày {day}/14</div>
          <button onClick={() => router.push("/onboarding")} style={btnSmall}>Onboarding</button>
        </div>

        <h1 style={{ fontSize: 24, marginTop: 12 }}>{resolved.title}</h1>

        <section style={card}>
          <div style={{ opacity: 0.7, fontSize: 14 }}>Vì sao hôm nay tập như vậy?</div>
          <p style={{ opacity: 0.9, marginTop: 6 }}>{resolved.why}</p>
        </section>

        {resolved.type === "recovery" ? (
          <section style={card}>
            <div style={{ fontWeight: 800 }}>Hôm nay là ngày hồi phục</div>
            <ul style={{ marginTop: 8, paddingLeft: 18, opacity: 0.9 }}>
              {resolved.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <button
              onClick={() => {
                markDayComplete(day);
                router.push(`/day/${Math.min(day + 1, 14)}`);
              }}
              style={btnPrimary}
            >
              Hoàn thành ngày hôm nay
            </button>
          </section>
        ) : (
          <>
            <section style={{ marginTop: 12, display: "grid", gap: 12 }}>
              {resolved.exercises.map((ex, idx) => (
                <article key={idx} style={card}>
                  <div style={{ fontWeight: 800 }}>{ex.title}</div>
                  <div style={{ opacity: 0.7, fontSize: 13, marginTop: 4 }}>
                    {ex.sets} hiệp · {ex.reps} · nghỉ {ex.rest}
                  </div>

                  <details style={details}>
                    <summary style={{ cursor: "pointer" }}>Cách thực hiện</summary>
                    <div style={{ marginTop: 10, display: "grid", gap: 10, opacity: 0.92 }}>
                      <Block title="Bắt đầu" items={ex.how.start} />
                      <Block title="Chuyển động" items={ex.how.move} />
                      <Block title="Nhịp thở" items={ex.how.breathe} />
                      <Block title="An toàn" items={ex.how.safety} />
                    </div>
                  </details>
                  <button
  onClick={() => {
    const r = parseInt(ex.rest, 10) || 60;
    const repsText = ex.reps.toLowerCase();
    const isTime = repsText.includes("s");
    const target = parseInt(repsText, 10) || (isTime ? 20 : 8);

    setTimerPlan({
      title: ex.title,
      sets: ex.sets,
      mode: isTime ? "time" : "reps",
      workTarget: target,
      restSeconds: r,
    });
    setTimerOpen(true);
  }}
  style={{
    marginTop: 10,
    width: "100%",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: "12px 12px",
    cursor: "pointer",
    fontWeight: 800,
  }}
>
  Bắt đầu bài này
</button>

                </article>
              ))}
            </section>

            <button
              onClick={() => {
                markDayComplete(day);
                router.push(`/day/${Math.min(day + 1, 14)}`);
              }}
              style={btnPrimary}
            >
              Hoàn thành ngày hôm nay
            </button>
          </>
        )}
<CoachTimerOverlay
  open={timerOpen}
  plan={timerPlan}
  onClose={() => {
    setTimerOpen(false);
    setTimerPlan(null);
  }}
/>

        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>
          Nếu đau nhói/choáng/tê, hãy dừng và ưu tiên an toàn.
        </div>
      </div>
    </main>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <ul style={{ marginTop: 6, paddingLeft: 18 }}>
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

const card: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 16,
  padding: 14,
  marginTop: 12,
};

const details: React.CSSProperties = {
  marginTop: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  padding: 10,
};

const btnPrimary: React.CSSProperties = {
  width: "100%",
  marginTop: 14,
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 16,
  padding: "12px 14px",
  cursor: "pointer",
};

const btnSmall: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 14,
  padding: "8px 10px",
  cursor: "pointer",
  fontSize: 13,
};
