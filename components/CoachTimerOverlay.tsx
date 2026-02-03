"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "reps" | "time";

export type CoachTimerPlan = {
  title: string;
  sets: number;
  mode: Mode;
  workTarget: number; // reps hoặc seconds
  restSeconds: number;
  /**
   * Chỉ dùng khi mode=reps. Mỗi bao nhiêu giây thì tự +1 rep.
   */
  secondsPerRep?: number;
};

export default function CoachTimerOverlay({
  open,
  plan,
  onClose,
}: {
  open: boolean;
  plan: CoachTimerPlan | null;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"work" | "rest">("work");
  const [setIndex, setSetIndex] = useState(1);
  const [count, setCount] = useState(0); // reps done OR seconds elapsed (work time)
  const [restLeft, setRestLeft] = useState(0);
  const [paused, setPaused] = useState(false);

  // --- refs to avoid recreating intervals / reduce lag in dev ---
  const tickRef = useRef<number | null>(null);
  const repRef = useRef<number | null>(null);

  const pausedRef = useRef(false);
  const phaseRef = useRef<"work" | "rest">("work");
  const countRef = useRef(0);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  const active = open && !!plan;

  // Using a stable key prevents effects from restarting just because `plan` object reference changed.
  const planKey = useMemo(() => {
    if (!plan) return "";
    return [
      plan.title,
      plan.sets,
      plan.mode,
      plan.workTarget,
      plan.restSeconds,
      plan.secondsPerRep ?? "",
    ].join("|");
  }, [plan]);

  const workLabel = useMemo(() => {
    if (!plan) return "";
    return plan.mode === "reps"
      ? `Rep ${count}/${plan.workTarget}`
      : `${count}s / ${plan.workTarget}s`;
  }, [plan, count]);

  // Reset state whenever opening with a new plan
  useEffect(() => {
    if (!active || !plan) return;

    setPhase("work");
    setSetIndex(1);
    setCount(0);
    setRestLeft(0);
    setPaused(false);
  }, [active, planKey]);

  // 1s tick: REST, and WORK when mode=time
  // Optimized: interval is created once per open+planKey, not on every re-render / pause toggle.
  useEffect(() => {
    if (!active || !plan) return;

    if (tickRef.current) window.clearInterval(tickRef.current);

    tickRef.current = window.setInterval(() => {
      if (pausedRef.current) return;

      // REST countdown
      if (phaseRef.current === "rest") {
        setRestLeft((v) => (v <= 1 ? 0 : v - 1));
        return;
      }

      // WORK timer (time mode)
      if (phaseRef.current === "work" && plan.mode === "time") {
        setCount((v) => v + 1);
      }
    }, 1000);

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [active, planKey]);

  // Auto +1 rep on WORK when mode=reps
  // Optimized: interval is created once per (open+planKey+phase), and uses refs for pause.
  useEffect(() => {
    if (!active || !plan) return;

    if (repRef.current) window.clearInterval(repRef.current);
    repRef.current = null;

    if (phase !== "work") return;
    if (plan.mode !== "reps") return;

    const ms = Math.max(250, Math.round((plan.secondsPerRep ?? 3) * 1000));

    repRef.current = window.setInterval(() => {
      if (pausedRef.current) return;

      setCount((v) => {
        if (v >= plan.workTarget) return v;

        const next = Math.min(v + 1, plan.workTarget);

        // Khi đủ rep: dừng lại ở max, CHỜ người dùng bấm Next
        if (next >= plan.workTarget && repRef.current) {
          window.clearInterval(repRef.current);
          repRef.current = null;
          haptic(40);
        }
        return next;
      });
    }, ms);

    return () => {
      if (repRef.current) window.clearInterval(repRef.current);
      repRef.current = null;
    };
  }, [active, planKey, phase]);

  // Auto-advance when REST reaches 0
  useEffect(() => {
    if (!active || !plan) return;
    if (phase !== "rest") return;
    if (restLeft !== 0) return;

    // when rest finishes -> next set (or done)
    if (setIndex >= plan.sets) {
      haptic(80);
      onClose();
      return;
    }

    haptic(40);
    setSetIndex((s) => s + 1);
    setPhase("work");
    setCount(0);
  }, [active, planKey, plan, phase, restLeft, setIndex, onClose]);

  // Auto-advance WORK when mode=time reaches target
  useEffect(() => {
    if (!active || !plan) return;
    if (phase !== "work") return;
    if (plan.mode !== "time") return;

    if (count >= plan.workTarget) {
      goNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, active, planKey, plan, phase]);

  function goNext() {
    if (!plan) return;

    if (phaseRef.current === "work") {
      // finish work -> rest (unless last set)
      if (setIndex >= plan.sets) {
        haptic(80);
        onClose();
        return;
      }
      haptic(40);
      setPhase("rest");
      setRestLeft(plan.restSeconds);
      return;
    }

    // phase === rest, skip rest -> next set
    haptic(40);
    setRestLeft(0);
  }

  function onWorkTap() {
    if (!plan) return;
    if (phaseRef.current !== "work") return;
    if (plan.mode !== "reps") return;

    setCount((v) => Math.min(v + 1, plan.workTarget));
    // nếu chạm target: dừng ở max, chờ người dùng bấm Next
  }

  if (!active || !plan) return null;

  const repHelper =
    plan.mode === "reps"
      ? `Tự đếm: +1 rep mỗi ${plan.secondsPerRep ?? 3}s${
          count >= plan.workTarget ? " (đã đủ rep — bấm Next)" : ""
        }`
      : "";

  return (
<div style={backdrop}>
      <div style={sheet}>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontWeight: 800 }}>{plan.title}</div>
<button
  onClick={(e) => {
    e.stopPropagation();
    onClose();
  }}
  style={iconBtn}
>
  ✕
</button>
        </div>

        <div style={{ marginTop: 10, opacity: 0.75, fontSize: 13 }}>
          Hiệp {setIndex}/{plan.sets} · {phase.toUpperCase()}
        </div>

        <div style={bigNumber}>
          {phase === "rest" ? `${restLeft}s` : plan.mode === "reps" ? `${count}/${plan.workTarget}` : `${count}s`}
        </div>

        <div style={{ opacity: 0.8, textAlign: "center", marginTop: -6 }}>
          {phase === "rest" ? "Nghỉ" : plan.mode === "reps" ? repHelper : workLabel}
        </div>

        {phase === "work" && plan.mode === "reps" && (
          <button onClick={onWorkTap} style={tapBtn}>
            +1 rep (chỉnh tay)
          </button>
        )}

        <div
          onClick={(e) => e.stopPropagation()}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}
        >
          <button onClick={() => setPaused((p) => !p)} style={btn}>
            {paused ? "Tiếp tục" : "Tạm dừng"}
          </button>
          <button onClick={goNext} style={btn}>
            Next
          </button>
        </div>

        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 10, textAlign: "center" }}>
          Mục tiêu: {plan.mode === "reps" ? `${plan.workTarget} rep` : `${plan.workTarget}s`} · Nghỉ {plan.restSeconds}s
        </div>
      </div>
    </div>
  );
}

function haptic(ms: number) {
  // rung nhẹ nếu thiết bị hỗ trợ
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    // @ts-ignore
    navigator.vibrate(ms);
  }
}

const backdrop: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "grid",
  placeItems: "end center",
  zIndex: 50,
  padding: 12,
};

const sheet: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(16,18,24,0.98)",
  color: "rgba(255,255,255,0.92)",
  padding: 14,
};



const bigNumber: React.CSSProperties = {
  marginTop: 8,
  fontSize: 48,
  fontWeight: 900,
  textAlign: "center",
  letterSpacing: 1,
};

const btn: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 14,
  padding: "12px 12px",
  cursor: "pointer",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
};

const tapBtn: React.CSSProperties = {
  marginTop: 10,
  width: "100%",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 14,
  padding: "14px 12px",
  cursor: "pointer",
  fontWeight: 800,
  background: "rgba(255,255,255,0.10)",
  color: "rgba(255,255,255,0.92)",
};



const iconBtn: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 12,
  padding: "6px 10px",
  cursor: "pointer",
};
