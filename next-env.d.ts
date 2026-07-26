:root {
  --bg: #07111f;
  --panel: rgba(10, 28, 53, 0.62);
  --panel-strong: rgba(15, 38, 70, 0.88);
  --line: rgba(255, 255, 255, 0.12);
  --text: #f4f8ff;
  --muted: #a8b7cc;
  --blue: #4ca4ff;
  --cyan: #67e8f9;
  --green: #54d8a3;
}

* { box-sizing: border-box; }
html { background: var(--bg); }
body {
  margin: 0;
  min-height: 100vh;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at 10% 10%, rgba(41, 125, 255, .18), transparent 28%),
    radial-gradient(circle at 90% 20%, rgba(102, 232, 249, .10), transparent 28%),
    linear-gradient(145deg, #050b14 0%, #091829 55%, #07111f 100%);
}

button, input, select { font: inherit; }
button { cursor: pointer; }

.page-shell {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  padding: 54px 24px 42px;
}

.orb {
  position: fixed;
  border-radius: 999px;
  filter: blur(18px);
  opacity: .45;
  pointer-events: none;
}
.orb-one { width: 280px; height: 280px; background: #1858d8; top: 9%; left: -100px; }
.orb-two { width: 220px; height: 220px; background: #0da7b7; top: 48%; right: -70px; }
.orb-three { width: 180px; height: 180px; background: #5a2fd8; bottom: -50px; left: 35%; }

.hero {
  position: relative;
  z-index: 2;
  max-width: 1180px;
  margin: 0 auto 34px;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #cce7ff;
  background: rgba(69, 151, 255, .12);
  border: 1px solid rgba(115, 186, 255, .24);
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 13px;
}
.hero h1 { margin: 14px 0 8px; font-size: clamp(40px, 7vw, 78px); line-height: .95; letter-spacing: -3px; }
.hero h1 span { background: linear-gradient(90deg, #79baff, #70f0e8); -webkit-background-clip: text; color: transparent; }
.hero p { max-width: 720px; margin: 0; color: var(--muted); font-size: 17px; line-height: 1.6; }

.workspace {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 22px;
  max-width: 1180px;
  margin: 0 auto;
  align-items: start;
}

.glass-card {
  background: linear-gradient(160deg, rgba(25, 56, 96, .68), rgba(7, 20, 38, .62));
  border: 1px solid rgba(255, 255, 255, .12);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, .34),
    inset 0 1px 0 rgba(255, 255, 255, .12),
    inset 0 -1px 0 rgba(0, 0, 0, .25);
  backdrop-filter: blur(22px) saturate(140%);
  -webkit-backdrop-filter: blur(22px) saturate(140%);
  border-radius: 26px;
}

.form-card { padding: 24px; position: sticky; top: 24px; }
.card-title { display: flex; gap: 12px; align-items: center; margin-bottom: 22px; }
.card-title h2, .timeline-header h2 { margin: 0; }
.card-title p, .timeline-header p { margin: 4px 0 0; color: var(--muted); font-size: 13px; }
.icon-box {
  width: 46px; height: 46px; display: grid; place-items: center;
  border-radius: 15px;
  background: linear-gradient(145deg, rgba(91, 167, 255, .35), rgba(27, 86, 166, .22));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 10px 22px rgba(0,0,0,.28);
}

label { display: grid; gap: 8px; color: #dbe9fb; font-size: 13px; font-weight: 700; margin-bottom: 18px; }
input, select {
  width: 100%;
  color: var(--text);
  background: rgba(2, 12, 25, .58);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 14px;
  padding: 13px 14px;
  outline: none;
  transition: .2s ease;
}
input:focus, select:focus { border-color: rgba(94, 180, 255, .65); box-shadow: 0 0 0 4px rgba(76,164,255,.10); }
select option { background: #0d1b2d; }
.date-field { position: relative; }
.date-field svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--blue); }
.date-field input { padding-left: 42px; }

.sla-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 4px 0 18px; }
.sla-summary div { padding: 14px; border-radius: 16px; background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.08); }
.sla-summary span { display: block; color: var(--muted); font-size: 11px; margin-bottom: 5px; }
.sla-summary strong { font-size: 15px; }

.timeline-card { padding: 28px; }
.timeline-header { display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; }
.timeline-header h2 { font-size: clamp(28px, 4vw, 44px); letter-spacing: -1.5px; margin-top: 5px; }
.mini-label { color: #78bfff; font-size: 11px; font-weight: 900; letter-spacing: 1.5px; }
.status-chip { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; color: #bff5dc; border: 1px solid rgba(84,216,163,.28); background: rgba(84,216,163,.10); border-radius: 999px; padding: 9px 12px; font-size: 12px; font-weight: 800; }
.status-chip span { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 14px var(--green); }

.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 24px 0 20px; }
.metrics-grid div { padding: 16px; border-radius: 17px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); }
.metrics-grid span { display: block; color: var(--muted); font-size: 11px; margin-bottom: 6px; }
.metrics-grid strong { font-size: 15px; }

.progress-wrap { margin: 4px 0 24px; }
.progress-label { display: flex; justify-content: space-between; color: var(--muted); font-size: 12px; margin-bottom: 9px; }
.progress-label strong { color: #dcecff; }
.progress-track { height: 10px; border-radius: 999px; background: rgba(255,255,255,.08); overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,.3); }
.progress-bar { height: 100%; border-radius: inherit; background: linear-gradient(90deg, #3c8dff, #64e6db); box-shadow: 0 0 22px rgba(85,190,255,.5); }

.timeline-list { display: grid; gap: 0; }
.timeline-item { display: grid; grid-template-columns: 42px 22px 1fr; min-height: 76px; }
.step-number { width: 38px; height: 38px; border-radius: 13px; display: grid; place-items: center; font-size: 12px; font-weight: 900; color: #d8ecff; background: linear-gradient(145deg, rgba(71,151,255,.36), rgba(26,65,117,.20)); border: 1px solid rgba(130,194,255,.20); box-shadow: inset 0 1px 0 rgba(255,255,255,.16), 0 8px 20px rgba(0,0,0,.25); }
.step-line { position: relative; }
.step-line::before { content: ""; position: absolute; top: 17px; left: 10px; bottom: -18px; width: 1px; background: linear-gradient(#4eaaff, rgba(78,170,255,.10)); }
.timeline-item:last-child .step-line::before { display: none; }
.step-line span { position: absolute; width: 8px; height: 8px; top: 15px; left: 6px; border-radius: 50%; background: #62dbe0; box-shadow: 0 0 15px rgba(98,219,224,.8); }
.step-content { margin: 0 0 14px 8px; padding: 14px 16px; border-radius: 17px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); display: flex; justify-content: space-between; gap: 14px; align-items: center; }
.step-content h3 { margin: 0 0 5px; font-size: 14px; }
.step-content p { margin: 0; color: var(--muted); font-size: 12px; }
.days-pill { white-space: nowrap; color: #cfe8ff; background: rgba(76,164,255,.12); border: 1px solid rgba(76,164,255,.18); padding: 7px 10px; border-radius: 999px; font-size: 11px; font-weight: 900; }
.panel-footer { color: var(--muted); font-size: 11px; text-align: center; padding-top: 8px; }

.actions-bar { position: relative; z-index: 2; max-width: 1180px; margin: 20px auto 0; padding: 16px; display: flex; justify-content: flex-end; gap: 12px; }
.primary-button, .secondary-button { min-height: 46px; border-radius: 14px; border: 1px solid rgba(255,255,255,.12); padding: 0 17px; display: inline-flex; align-items: center; justify-content: center; gap: 9px; font-weight: 900; }
.primary-button { color: #06111f; background: linear-gradient(145deg, #73c5ff, #66eadf); box-shadow: inset 0 1px 0 rgba(255,255,255,.7), 0 10px 24px rgba(52,168,255,.22), 0 4px 0 #267a91; }
.primary-button:active { transform: translateY(3px); box-shadow: inset 0 1px 0 rgba(255,255,255,.7), 0 5px 14px rgba(52,168,255,.18), 0 1px 0 #267a91; }
.secondary-button { color: #dcecff; background: linear-gradient(145deg, rgba(255,255,255,.09), rgba(255,255,255,.035)); box-shadow: inset 0 1px 0 rgba(255,255,255,.13), 0 8px 18px rgba(0,0,0,.22), 0 3px 0 rgba(0,0,0,.26); }
.form-card > .secondary-button { width: 100%; }
.secondary-button:active { transform: translateY(2px); }

@media (max-width: 900px) {
  .workspace { grid-template-columns: 1fr; }
  .form-card { position: static; }
}

@media (max-width: 620px) {
  .page-shell { padding: 32px 14px 28px; }
  .hero h1 { letter-spacing: -2px; }
  .timeline-card, .form-card { padding: 19px; border-radius: 21px; }
  .timeline-header { flex-direction: column; }
  .metrics-grid { grid-template-columns: 1fr; }
  .actions-bar { flex-direction: column; }
  .actions-bar button { width: 100%; }
  .step-content { align-items: flex-start; }
}
