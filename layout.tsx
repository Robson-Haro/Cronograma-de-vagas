"use client";

import { useMemo, useRef, useState } from "react";

type GroupKey = "adm1" | "adm2" | "especialistas" | "lideranca1" | "gerentes" | "executivos";
type StageConfig = { name: string; days: number; triage?: boolean };
type GroupConfig = { label: string; description: string; timeToFill: number; triageMinimum: number; stages: StageConfig[] };
type ScheduledStage = StageConfig & { start: Date; end: Date };

const GROUPS: Record<GroupKey, GroupConfig> = {
  adm1: { label: "Administrativo 1", description: "Assistentes e Tele Vendas", timeToFill: 15, triageMinimum: 4, stages: [
    { name: "Abertura e briefing", days: 1 }, { name: "Publicação e atração", days: 1 }, { name: "Triagem", days: 4, triage: true },
    { name: "Entrevista Hub de Seleção", days: 2 }, { name: "Entrevista com gestor", days: 2 }, { name: "Pesquisas e validações", days: 1 },
    { name: "Proposta", days: 1 }, { name: "Reserva técnica", days: 3 }
  ]},
  adm2: { label: "Administrativo 2", description: "Analistas e Vendedores", timeToFill: 20, triageMinimum: 4, stages: [
    { name: "Abertura e briefing", days: 2 }, { name: "Publicação e atração", days: 2 }, { name: "Triagem", days: 4, triage: true },
    { name: "Entrevista Hub de Seleção", days: 2 }, { name: "Entrevista com gestor", days: 3 }, { name: "Pesquisas e validações", days: 2 },
    { name: "Proposta", days: 1 }, { name: "Reserva técnica", days: 4 }
  ]},
  especialistas: { label: "Especialistas", description: "Corporativos e Técnicos", timeToFill: 30, triageMinimum: 4, stages: [
    { name: "Abertura e briefing", days: 2 }, { name: "Publicação e atração", days: 2 }, { name: "Triagem", days: 6, triage: true },
    { name: "Entrevista Hub de Seleção", days: 3 }, { name: "Entrevista com gestor", days: 3 }, { name: "Gestão da gestão", days: 3 },
    { name: "Pesquisas e validações", days: 2 }, { name: "Proposta", days: 1 }, { name: "Reserva técnica", days: 8 }
  ]},
  lideranca1: { label: "Liderança 1", description: "Supervisores e Coordenadores", timeToFill: 45, triageMinimum: 7, stages: [
    { name: "Abertura e briefing", days: 2 }, { name: "Publicação e hunting", days: 3 }, { name: "Triagem e mapeamento", days: 7, triage: true },
    { name: "Entrevista Hub de Seleção", days: 7 }, { name: "Entrevista com gestor", days: 3 }, { name: "Entrevista BP da área", days: 3 },
    { name: "Entrevista com Head de Seleção", days: 2 }, { name: "Compliance", days: 3 }, { name: "Gestor do gestor", days: 3 },
    { name: "Decisão e proposta", days: 3 }, { name: "Reserva técnica", days: 9 }
  ]},
  gerentes: { label: "Liderança 2 — Gerentes", description: "Gerentes", timeToFill: 60, triageMinimum: 10, stages: [
    { name: "Abertura e briefing", days: 2 }, { name: "Publicação e hunting", days: 4 }, { name: "Triagem e mapeamento", days: 10, triage: true },
    { name: "Entrevista Hub de Seleção", days: 7 }, { name: "Entrevista com gestor", days: 3 }, { name: "Entrevista BP da área", days: 3 },
    { name: "Entrevista com Head de Seleção", days: 3 }, { name: "Compliance", days: 3 }, { name: "Gestor do gestor", days: 3 },
    { name: "Decisão em comitê", days: 3 }, { name: "Proposta", days: 2 }, { name: "Reserva técnica", days: 17 }
  ]},
  executivos: { label: "Liderança 2 — Executivos", description: "Gerentes Executivos e Diretores", timeToFill: 60, triageMinimum: 15, stages: [
    { name: "Abertura e briefing", days: 2 }, { name: "Publicação e hunting", days: 4 }, { name: "Triagem e mapeamento", days: 15, triage: true },
    { name: "Entrevista Hub de Seleção", days: 7 }, { name: "Entrevista com gestor", days: 3 }, { name: "Entrevista BP da área", days: 3 },
    { name: "Entrevista com Head de Seleção", days: 3 }, { name: "Compliance", days: 3 }, { name: "Gestor do gestor", days: 3 },
    { name: "Assessment", days: 4 }, { name: "Decisão em comitê", days: 3 }, { name: "Proposta", days: 2 }, { name: "Reserva técnica", days: 8 }
  ]}
};

const addDays = (date: Date, days: number) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };
const parseDate = (value: string) => { const [y, m, d] = value.split("-").map(Number); return new Date(y, m - 1, d, 12); };
const formatDate = (date: Date) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
const todayInput = () => { const d = new Date(); const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); };

function buildSchedule(config: GroupConfig, start: Date): ScheduledStage[] {
  let cursor = start;
  return config.stages.map((stage) => {
    const stageStart = cursor;
    const stageEnd = addDays(stageStart, stage.days);
    cursor = stageEnd;
    return { ...stage, start: stageStart, end: stageEnd };
  });
}

async function exportElementAsPng(element: HTMLElement, filename: string) {
  const width = element.scrollWidth;
  const height = element.scrollHeight;
  const clone = element.cloneNode(true) as HTMLElement;
  clone.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  const css = Array.from(document.styleSheets).flatMap((sheet) => {
    try { return Array.from(sheet.cssRules).map((rule) => rule.cssText); } catch { return []; }
  }).join("\n");
  const serialized = new XMLSerializer().serializeToString(clone);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><style>${css}</style><foreignObject width="100%" height="100%">${serialized}</foreignObject></svg>`;
  const image = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("Falha ao gerar imagem")); image.src = url; });
  const canvas = document.createElement("canvas");
  canvas.width = width * 2; canvas.height = height * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.scale(2, 2); ctx.drawImage(image, 0, 0); URL.revokeObjectURL(url);
  const link = document.createElement("a"); link.download = filename; link.href = canvas.toDataURL("image/png"); link.click();
}

export default function Home() {
  const [role, setRole] = useState("");
  const [group, setGroup] = useState<GroupKey>("adm2");
  const [startDate, setStartDate] = useState(todayInput);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

  const config = GROUPS[group];
  const safeStartDate = startDate || todayInput();
  const schedule = useMemo(() => buildSchedule(config, parseDate(safeStartDate)), [config, safeStartDate]);
  const finalDate = schedule.at(-1)?.end ?? parseDate(safeStartDate);
  const totalDays = schedule.reduce((sum, stage) => sum + stage.days, 0);
  const slack = Math.max(0, config.timeToFill - totalDays);
  const slug = (role || "vaga").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const summary = useMemo(() => [
    "VAGAS TIMELINE — CRONOGRAMA DA VAGA", `Cargo: ${role || "Não informado"}`, `Grupo: ${config.label}`,
    `Time to Fill: ${config.timeToFill} dias corridos`, `Abertura: ${formatDate(parseDate(safeStartDate))}`,
    `Previsão de conclusão: ${formatDate(finalDate)}`, "", ...schedule.map((stage, i) => `${i + 1}. ${stage.name}: ${formatDate(stage.start)} a ${formatDate(stage.end)} (${stage.days} dia${stage.days === 1 ? "" : "s"})`),
    "", "Contagem em dias corridos, incluindo finais de semana e feriados."
  ].join("\n"), [config, finalDate, role, safeStartDate, schedule]);

  const copy = async () => { await navigator.clipboard.writeText(summary); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  const exportPng = async () => { if (!panelRef.current) return; try { setExporting(true); await exportElementAsPng(panelRef.current, `vagas-timeline-${slug}.png`); } finally { setExporting(false); } };

  return <main className="page-shell">
    <div className="orb orb-one"/><div className="orb orb-two"/><div className="orb orb-three"/>
    <header className="hero"><span className="eyebrow">✦ Planejamento inteligente de seleção</span><h1>Vagas <span>Timeline</span></h1><p>Transforme a política de Time to Fill em um cronograma automático, visual e pronto para compartilhar.</p></header>
    <section className="workspace">
      <aside className="glass-card form-card">
        <div className="card-title"><div className="icon-box">⏱</div><div><h2>Configurar cronograma</h2><p>Preencha os dados básicos da vaga.</p></div></div>
        <label>Nome do cargo<input value={role} onChange={(e: { target: { value: string } }) => setRole(e.target.value)} placeholder="Ex.: Coordenador de Logística"/></label>
        <label>Grupo de cargo<select value={group} onChange={(e: { target: { value: string } }) => setGroup(e.target.value as GroupKey)}>{Object.entries(GROUPS).map(([key, item]) => <option key={key} value={key}>{item.label} — {item.description}</option>)}</select></label>
        <label>Data de abertura<input type="date" value={safeStartDate} onChange={(e: { target: { value: string } }) => setStartDate(e.target.value)}/></label>
        <div className="sla-summary"><div><span>Time to Fill</span><strong>{config.timeToFill} dias</strong></div><div><span>Triagem mínima</span><strong>{config.triageMinimum} dias</strong></div></div>
        <button className="secondary-button full" onClick={() => { setRole(""); setGroup("adm2"); setStartDate(todayInput()); }}>↻ Limpar</button>
      </aside>
      <section ref={panelRef} className="glass-card timeline-card">
        <div className="timeline-header"><div><span className="mini-label">CRONOGRAMA DA VAGA</span><h2>{role || "Nome do cargo"}</h2><p>{config.label} · {config.description}</p></div><div className="status-chip"><span/> Dentro da SLA</div></div>
        <div className="metrics-grid"><div><span>Início</span><strong>{formatDate(parseDate(safeStartDate))}</strong></div><div><span>Conclusão</span><strong>{formatDate(finalDate)}</strong></div><div><span>Folga</span><strong>{slack} dias</strong></div></div>
        <div className="progress-wrap"><div className="progress-label"><span>Planejamento da SLA</span><strong>{totalDays} / {config.timeToFill} dias</strong></div><div className="progress-track"><div className="progress-bar" style={{ width: `${Math.min(100, totalDays / config.timeToFill * 100)}%` }}/></div></div>
        <div className="timeline-list">{schedule.map((stage, index) => <article className="timeline-item" key={`${stage.name}-${index}`}><div className="step-number">{String(index + 1).padStart(2, "0")}</div><div className="step-line"><span/></div><div className="step-content"><div><h3>{stage.name}</h3><p>{formatDate(stage.start)} até {formatDate(stage.end)}</p></div><div className="days-pill">{stage.days} dia{stage.days === 1 ? "" : "s"}</div></div></article>)}</div>
        <footer className="panel-footer">Dias corridos: a contagem inclui finais de semana e feriados.</footer>
      </section>
    </section>
    <section className="actions-bar glass-card"><button className="primary-button" onClick={copy}>{copied ? "✓ Copiado!" : "▣ Copiar cronograma"}</button><button className="secondary-button" onClick={exportPng} disabled={exporting}>{exporting ? "Gerando…" : "⇩ Exportar PNG"}</button><button className="secondary-button" onClick={() => window.print()}>⎙ Salvar em PDF</button></section>
  </main>;
}
