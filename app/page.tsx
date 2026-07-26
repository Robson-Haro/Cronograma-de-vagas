"use client";

import { useMemo, useState } from "react";

type GroupKey = "adm1" | "adm2" | "especialistas" | "lideranca1" | "gerentes" | "executivos";
type Stage = { name: string; days: number };
type GroupConfig = { label: string; description: string; timeToFill: number; triageMinimum: number; stages: Stage[] };
type ScheduledStage = Stage & { start: Date; end: Date };

const MINERVA_LOGO = "data:image/webp;base64,UklGRoxjAABXRUJQVlA4WAoAAAAQAAAA/wMAwgEAQUxQSKk6AAA...";

const GROUPS: Record<GroupKey, GroupConfig> = {
  adm1: { label: "Administrativo 1", description: "Assistentes e Tele Vendas", timeToFill: 15, triageMinimum: 4, stages: [
    { name: "Abertura e briefing", days: 1 }, { name: "Publicação e atração", days: 1 }, { name: "Triagem", days: 4 }, { name: "Entrevista Hub de Seleção", days: 2 }, { name: "Entrevista com gestor", days: 2 }, { name: "Pesquisas e validações", days: 1 }, { name: "Proposta", days: 1 }, { name: "Reserva técnica", days: 3 }
  ]},
  adm2: { label: "Administrativo 2", description: "Analistas e Vendedores", timeToFill: 20, triageMinimum: 4, stages: [
    { name: "Abertura e briefing", days: 2 }, { name: "Publicação e atração", days: 2 }, { name: "Triagem", days: 4 }, { name: "Entrevista Hub de Seleção", days: 2 }, { name: "Entrevista com gestor", days: 3 }, { name: "Pesquisas e validações", days: 2 }, { name: "Proposta", days: 1 }, { name: "Reserva técnica", days: 4 }
  ]},
  especialistas: { label: "Especialistas", description: "Corporativos e Técnicos", timeToFill: 30, triageMinimum: 4, stages: [
    { name: "Abertura e briefing", days: 2 }, { name: "Publicação e atração", days: 2 }, { name: "Triagem", days: 6 }, { name: "Entrevista Hub de Seleção", days: 3 }, { name: "Entrevista com gestor", days: 3 }, { name: "Gestão da gestão", days: 3 }, { name: "Pesquisas e validações", days: 2 }, { name: "Proposta", days: 1 }, { name: "Reserva técnica", days: 8 }
  ]},
  lideranca1: { label: "Liderança 1", description: "Supervisores e Coordenadores", timeToFill: 45, triageMinimum: 7, stages: [
    { name: "Abertura e briefing", days: 2 }, { name: "Publicação e hunting", days: 3 }, { name: "Triagem e mapeamento", days: 7 }, { name: "Entrevista Hub de Seleção", days: 7 }, { name: "Entrevista com gestor", days: 3 }, { name: "Entrevista BP da área", days: 3 }, { name: "Entrevista com Head de Seleção", days: 2 }, { name: "Compliance", days: 3 }, { name: "Gestor do gestor", days: 3 }, { name: "Decisão e proposta", days: 3 }, { name: "Reserva técnica", days: 9 }
  ]},
  gerentes: { label: "Liderança 2 — Gerentes", description: "Gerentes", timeToFill: 60, triageMinimum: 10, stages: [
    { name: "Abertura e briefing", days: 2 }, { name: "Publicação e hunting", days: 4 }, { name: "Triagem e mapeamento", days: 10 }, { name: "Entrevista Hub de Seleção", days: 7 }, { name: "Entrevista com gestor", days: 3 }, { name: "Entrevista BP da área", days: 3 }, { name: "Entrevista com Head de Seleção", days: 3 }, { name: "Compliance", days: 3 }, { name: "Gestor do gestor", days: 3 }, { name: "Decisão em comitê", days: 3 }, { name: "Proposta", days: 2 }, { name: "Reserva técnica", days: 17 }
  ]},
  executivos: { label: "Liderança 2 — Executivos", description: "Gerentes Executivos e Diretores", timeToFill: 60, triageMinimum: 15, stages: [
    { name: "Abertura e briefing", days: 2 }, { name: "Publicação e hunting", days: 4 }, { name: "Triagem e mapeamento", days: 15 }, { name: "Entrevista Hub de Seleção", days: 7 }, { name: "Entrevista com gestor", days: 3 }, { name: "Entrevista BP da área", days: 3 }, { name: "Entrevista com Head de Seleção", days: 3 }, { name: "Compliance", days: 3 }, { name: "Gestor do gestor", days: 3 }, { name: "Assessment", days: 4 }, { name: "Decisão em comitê", days: 3 }, { name: "Proposta", days: 2 }, { name: "Reserva técnica", days: 8 }
  ]}
};

const addDays = (date: Date, days: number) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };
const parseDate = (value: string) => { const [year, month, day] = value.split("-").map(Number); return new Date(year, month - 1, day, 12); };
const formatDate = (date: Date) => new Intl.DateTimeFormat("pt-BR").format(date);
const todayInput = () => { const date = new Date(); const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); };

function buildSchedule(config: GroupConfig, start: Date): ScheduledStage[] {
  let cursor = start;
  return config.stages.map((stage) => {
    const stageStart = cursor;
    const stageEnd = addDays(stageStart, stage.days);
    cursor = stageEnd;
    return { ...stage, start: stageStart, end: stageEnd };
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else { line = test; }
  });
  if (line) lines.push(line);
  return lines;
}

async function createPanelBlob(role: string, config: GroupConfig, schedule: ScheduledStage[], startDate: string, finalDate: Date, slack: number): Promise<Blob> {
  const cardWidth = 220;
  const gap = 26;
  const side = 70;
  const width = Math.max(1500, side * 2 + schedule.length * cardWidth + (schedule.length - 1) * gap);
  const height = 760;
  const canvas = document.createElement("canvas");
  canvas.width = width * 2;
  canvas.height = height * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.scale(2, 2);

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#040a12");
  bg.addColorStop(.55, "#091a2e");
  bg.addColorStop(1, "#06111f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(180, 100, 10, 180, 100, 360);
  glow.addColorStop(0, "rgba(43,125,255,.26)");
  glow.addColorStop(1, "rgba(43,125,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 600, 500);

  ctx.beginPath();
  ctx.roundRect(36, 34, width - 72, height - 68, 30);
  const panel = ctx.createLinearGradient(36, 34, width - 36, height - 34);
  panel.addColorStop(0, "rgba(27,59,101,.92)");
  panel.addColorStop(1, "rgba(7,20,38,.94)");
  ctx.fillStyle = panel;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.16)";
  ctx.stroke();

  const logo = await loadImage(MINERVA_LOGO);
  const logoW = 190;
  const logoH = logo.height * (logoW / logo.width);
  ctx.drawImage(logo, width - side - logoW, 66, logoW, logoH);

  ctx.fillStyle = "#78bfff";
  ctx.font = "800 16px Arial";
  ctx.fillText("CRONOGRAMA DA VAGA", side, 90);
  ctx.fillStyle = "#f5f9ff";
  ctx.font = "700 42px Arial";
  ctx.fillText(role || "Nome do cargo", side, 140);
  ctx.fillStyle = "#9fb0c8";
  ctx.font = "500 18px Arial";
  ctx.fillText(`${config.label} · ${config.description}`, side, 172);

  [["INÍCIO", formatDate(parseDate(startDate))], ["CONCLUSÃO", formatDate(finalDate)], ["TIME TO FILL", `${config.timeToFill} dias`], ["FOLGA", `${slack} dias`]].forEach(([label, value], index) => {
    const x = side + index * 225;
    ctx.beginPath(); ctx.roundRect(x, 205, 200, 78, 16);
    ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.09)"; ctx.stroke();
    ctx.fillStyle = "#9fb0c8"; ctx.font = "700 12px Arial"; ctx.fillText(label, x + 16, 230);
    ctx.fillStyle = "#f5f9ff"; ctx.font = "700 21px Arial"; ctx.fillText(value, x + 16, 260);
  });

  const timelineY = 420;
  ctx.strokeStyle = "rgba(98,219,224,.55)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(side + cardWidth / 2, timelineY);
  ctx.lineTo(width - side - cardWidth / 2, timelineY);
  ctx.stroke();

  schedule.forEach((stage, index) => {
    const x = side + index * (cardWidth + gap);
    const center = x + cardWidth / 2;
    ctx.fillStyle = "#62dbe0";
    ctx.shadowColor = "rgba(98,219,224,.9)";
    ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.arc(center, timelineY, 9, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

    ctx.beginPath(); ctx.roundRect(x, 330, cardWidth, 170, 20);
    ctx.fillStyle = "rgba(255,255,255,.065)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.10)"; ctx.stroke();

    ctx.beginPath(); ctx.roundRect(x + 14, 346, 42, 42, 13);
    ctx.fillStyle = "rgba(71,151,255,.35)"; ctx.fill();
    ctx.fillStyle = "#d8ecff"; ctx.font = "800 14px Arial"; ctx.fillText(String(index + 1).padStart(2, "0"), x + 25, 373);

    ctx.fillStyle = "#f5f9ff"; ctx.font = "700 17px Arial";
    wrapText(ctx, stage.name, cardWidth - 28).slice(0, 3).forEach((line, lineIndex) => ctx.fillText(line, x + 14, 416 + lineIndex * 22));
    ctx.fillStyle = "#9fb0c8"; ctx.font = "500 13px Arial";
    ctx.fillText(formatDate(stage.start), x + 14, 476); ctx.fillText(`até ${formatDate(stage.end)}`, x + 14, 496);
    ctx.beginPath(); ctx.roundRect(x + 14, 515, 86, 30, 15);
    ctx.fillStyle = "rgba(76,164,255,.15)"; ctx.fill();
    ctx.fillStyle = "#cfe8ff"; ctx.font = "700 12px Arial"; ctx.fillText(`${stage.days} dia${stage.days === 1 ? "" : "s"}`, x + 29, 535);
  });

  ctx.fillStyle = "#9fb0c8";
  ctx.font = "500 14px Arial";
  ctx.fillText("Dias corridos: a contagem inclui finais de semana e feriados.", side, height - 74);

  return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Falha ao gerar imagem")), "image/png"));
}

export default function Home() {
  const [role, setRole] = useState("");
  const [group, setGroup] = useState<GroupKey>("adm2");
  const [startDate, setStartDate] = useState(todayInput);
  const [copyState, setCopyState] = useState<"idle" | "working" | "copied" | "downloaded">("idle");

  const config = GROUPS[group];
  const safeStartDate = startDate || todayInput();
  const schedule = useMemo(() => buildSchedule(config, parseDate(safeStartDate)), [config, safeStartDate]);
  const finalDate = schedule.length ? schedule[schedule.length - 1].end : parseDate(safeStartDate);
  const totalDays = schedule.reduce((sum, stage) => sum + stage.days, 0);
  const slack = Math.max(0, config.timeToFill - totalDays);

  async function copyPanel() {
    setCopyState("working");
    try {
      const blob = await createPanelBlob(role, config, schedule, safeStartDate, finalDate, slack);
      if (navigator.clipboard && "write" in navigator.clipboard && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopyState("copied");
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url; link.download = "vagas-timeline.png"; link.click(); URL.revokeObjectURL(url);
        setCopyState("downloaded");
      }
    } catch {
      setCopyState("idle");
      alert("O navegador bloqueou a cópia da imagem. Use o botão Exportar PNG.");
    }
    window.setTimeout(() => setCopyState("idle"), 2200);
  }

  async function exportPng() {
    const blob = await createPanelBlob(role, config, schedule, safeStartDate, finalDate, slack);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "vagas-timeline.png"; link.click(); URL.revokeObjectURL(url);
  }

  return (
    <main className="page-shell">
      <div className="orb orb-one"/><div className="orb orb-two"/><div className="orb orb-three"/>
      <header className="hero">
        <span className="eyebrow">✦ Planejamento inteligente de seleção</span>
        <h1>Vagas <span>Timeline</span></h1>
        <p>Transforme a política de Time to Fill em um cronograma automático, visual e pronto para compartilhar.</p>
      </header>

      <section className="workspace">
        <aside className="glass-card form-card">
          <div className="card-title"><div className="icon-box">⏱</div><div><h2>Configurar cronograma</h2><p>Preencha os dados básicos da vaga.</p></div></div>
          <label>Nome do cargo<input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Ex.: Coordenador de Logística"/></label>
          <label>Grupo de cargo<select value={group} onChange={(event) => setGroup(event.target.value as GroupKey)}>{Object.entries(GROUPS).map(([key, item]) => <option key={key} value={key}>{item.label} — {item.description}</option>)}</select></label>
          <label>Data de abertura<input type="date" value={safeStartDate} onChange={(event) => setStartDate(event.target.value)}/></label>
          <div className="sla-summary"><div><span>Time to Fill</span><strong>{config.timeToFill} dias</strong></div><div><span>Triagem mínima</span><strong>{config.triageMinimum} dias</strong></div></div>
          <button className="secondary-button full" onClick={() => { setRole(""); setGroup("adm2"); setStartDate(todayInput()); }}>↻ Limpar</button>
        </aside>

        <section className="glass-card timeline-card">
          <div className="timeline-header">
            <div><span className="mini-label">CRONOGRAMA DA VAGA</span><h2>{role || "Nome do cargo"}</h2><p>{config.label} · {config.description}</p></div>
            <div className="brand-block"><img src={MINERVA_LOGO} alt="Minerva Foods"/><div className="status-chip"><span/> Dentro da SLA</div></div>
          </div>
          <div className="metrics-grid"><div><span>Início</span><strong>{formatDate(parseDate(safeStartDate))}</strong></div><div><span>Conclusão</span><strong>{formatDate(finalDate)}</strong></div><div><span>Folga</span><strong>{slack} dias</strong></div></div>
          <div className="progress-wrap"><div className="progress-label"><span>Planejamento da SLA</span><strong>{totalDays} / {config.timeToFill} dias</strong></div><div className="progress-track"><div className="progress-bar" style={{ width: `${Math.min(100, totalDays / config.timeToFill * 100)}%` }}/></div></div>

          <div className="horizontal-scroll">
            <div className="horizontal-timeline">
              {schedule.map((stage, index) => (
                <article className="horizontal-item" key={`${stage.name}-${index}`}>
                  <div className="horizontal-card">
                    <div className="step-number">{String(index + 1).padStart(2, "0")}</div>
                    <h3>{stage.name}</h3>
                    <p>{formatDate(stage.start)} até {formatDate(stage.end)}</p>
                    <div className="days-pill">{stage.days} dia{stage.days === 1 ? "" : "s"}</div>
                  </div>
                  <div className="timeline-node"><span/></div>
                </article>
              ))}
            </div>
          </div>
          <footer className="panel-footer">Dias corridos: a contagem inclui finais de semana e feriados.</footer>
        </section>
      </section>

      <section className="actions-bar glass-card">
        <button className="primary-button" onClick={copyPanel} disabled={copyState === "working"}>
          {copyState === "working" ? "Gerando imagem…" : copyState === "copied" ? "✓ Imagem copiada!" : copyState === "downloaded" ? "✓ PNG baixado!" : "▣ Copiar painel com imagem"}
        </button>
        <button className="secondary-button" onClick={exportPng}>⇩ Exportar PNG</button>
        <button className="secondary-button" onClick={() => window.print()}>⎙ Salvar em PDF</button>
      </section>
    </main>
  );
}
