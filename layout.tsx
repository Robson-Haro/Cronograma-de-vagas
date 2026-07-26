"use client";

import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import {
  CalendarDays,
  Check,
  Clipboard,
  Download,
  RotateCcw,
  Sparkles,
  TimerReset
} from "lucide-react";

type Stage = {
  name: string;
  days: number;
  start: Date;
  end: Date;
};

type GroupKey = "adm1" | "adm2" | "especialistas" | "lideranca1" | "gerentes" | "executivos";

type GroupConfig = {
  label: string;
  description: string;
  timeToFill: number;
  triageMinimum: number;
  stages: Array<{ name: string; base: number; flexible?: boolean }>;
};

const GROUPS: Record<GroupKey, GroupConfig> = {
  adm1: {
    label: "Administrativo 1",
    description: "Assistentes e Tele Vendas",
    timeToFill: 15,
    triageMinimum: 4,
    stages: [
      { name: "Abertura e briefing", base: 1 },
      { name: "Publicação e atração", base: 1 },
      { name: "Triagem", base: 4, flexible: true },
      { name: "Entrevista Hub de Seleção", base: 2 },
      { name: "Entrevista com gestor", base: 2 },
      { name: "Pesquisas e validações", base: 1 },
      { name: "Proposta", base: 1 },
      { name: "Reserva técnica", base: 3, flexible: true }
    ]
  },
  adm2: {
    label: "Administrativo 2",
    description: "Analistas e Vendedores",
    timeToFill: 20,
    triageMinimum: 4,
    stages: [
      { name: "Abertura e briefing", base: 2 },
      { name: "Publicação e atração", base: 2 },
      { name: "Triagem", base: 4, flexible: true },
      { name: "Entrevista Hub de Seleção", base: 2 },
      { name: "Entrevista com gestor", base: 3 },
      { name: "Pesquisas e validações", base: 2 },
      { name: "Proposta", base: 1 },
      { name: "Reserva técnica", base: 4, flexible: true }
    ]
  },
  especialistas: {
    label: "Especialistas",
    description: "Corporativos e Técnicos",
    timeToFill: 30,
    triageMinimum: 4,
    stages: [
      { name: "Abertura e briefing", base: 2 },
      { name: "Publicação e atração", base: 2 },
      { name: "Triagem", base: 6, flexible: true },
      { name: "Entrevista Hub de Seleção", base: 3 },
      { name: "Entrevista com gestor", base: 3 },
      { name: "Gestão da gestão", base: 3 },
      { name: "Pesquisas e validações", base: 2 },
      { name: "Proposta", base: 1 },
      { name: "Reserva técnica", base: 8, flexible: true }
    ]
  },
  lideranca1: {
    label: "Liderança 1",
    description: "Supervisores e Coordenadores",
    timeToFill: 45,
    triageMinimum: 7,
    stages: [
      { name: "Abertura e briefing", base: 2 },
      { name: "Publicação e hunting", base: 3 },
      { name: "Triagem e mapeamento", base: 7, flexible: true },
      { name: "Entrevista Hub de Seleção", base: 7 },
      { name: "Entrevista com gestor", base: 3 },
      { name: "Entrevista BP da área", base: 3 },
      { name: "Entrevista com Head de Seleção", base: 2 },
      { name: "Compliance", base: 3 },
      { name: "Gestor do gestor", base: 3 },
      { name: "Decisão e proposta", base: 3 },
      { name: "Reserva técnica", base: 9, flexible: true }
    ]
  },
  gerentes: {
    label: "Liderança 2 — Gerentes",
    description: "Gerentes",
    timeToFill: 60,
    triageMinimum: 10,
    stages: [
      { name: "Abertura e briefing", base: 2 },
      { name: "Publicação e hunting", base: 4 },
      { name: "Triagem e mapeamento", base: 10, flexible: true },
      { name: "Entrevista Hub de Seleção", base: 7 },
      { name: "Entrevista com gestor", base: 3 },
      { name: "Entrevista BP da área", base: 3 },
      { name: "Entrevista com Head de Seleção", base: 3 },
      { name: "Compliance", base: 3 },
      { name: "Gestor do gestor", base: 3 },
      { name: "Decisão em comitê", base: 3 },
      { name: "Proposta", base: 2 },
      { name: "Reserva técnica", base: 17, flexible: true }
    ]
  },
  executivos: {
    label: "Liderança 2 — Executivos",
    description: "Gerentes Executivos e Diretores",
    timeToFill: 60,
    triageMinimum: 15,
    stages: [
      { name: "Abertura e briefing", base: 2 },
      { name: "Publicação e hunting", base: 4 },
      { name: "Triagem e mapeamento", base: 15, flexible: true },
      { name: "Entrevista Hub de Seleção", base: 7 },
      { name: "Entrevista com gestor", base: 3 },
      { name: "Entrevista BP da área", base: 3 },
      { name: "Entrevista com Head de Seleção", base: 3 },
      { name: "Compliance", base: 3 },
      { name: "Gestor do gestor", base: 3 },
      { name: "Assessment", base: 4 },
      { name: "Decisão em comitê", base: 3 },
      { name: "Proposta", base: 2 },
      { name: "Reserva técnica", base: 8, flexible: true }
    ]
  }
};

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function dateFromInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function buildSchedule(config: GroupConfig, startDate: Date): Stage[] {
  const totalBase = config.stages.reduce((sum, stage) => sum + stage.base, 0);
  const delta = config.timeToFill - totalBase;
  const stages = config.stages.map(stage => ({ ...stage }));

  if (delta !== 0) {
    const flexible = stages.filter(stage => stage.flexible);
    if (flexible.length) {
      const last = flexible[flexible.length - 1];
      last.base = Math.max(0, last.base + delta);
    }
  }

  let cursor = startDate;
  return stages.map(stage => {
    const start = cursor;
    const end = addDays(start, stage.base);
    cursor = end;
    return { name: stage.name, days: stage.base, start, end };
  });
}

export default function Home() {
  const [role, setRole] = useState("");
  const [group, setGroup] = useState<GroupKey>("adm2");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const config = GROUPS[group];
  const schedule = useMemo(() => buildSchedule(config, dateFromInput(startDate)), [config, startDate]);
  const finalDate = schedule[schedule.length - 1].end;
  const totalDays = schedule.reduce((sum, stage) => sum + stage.days, 0);

  const textSummary = useMemo(() => {
    const lines = schedule.map(
      (stage, index) => `${index + 1}. ${stage.name} — ${stage.days} dia(s) — até ${formatDate(stage.end)}`
    );
    return [
      "CRONOGRAMA DA VAGA",
      `Cargo: ${role || "Não informado"}`,
      `Grupo: ${config.label}`,
      `Time to Fill: ${config.timeToFill} dias corridos`,
      `Data de abertura: ${formatDate(dateFromInput(startDate))}`,
      `Previsão de conclusão: ${formatDate(finalDate)}`,
      "",
      ...lines,
      "",
      "Observação: contagem em dias corridos, incluindo finais de semana e feriados."
    ].join("\n");
  }, [config, finalDate, role, schedule, startDate]);

  async function copyText() {
    await navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function exportImage() {
    if (!panelRef.current) return;
    const canvas = await html2canvas(panelRef.current, { scale: 2, backgroundColor: null });
    const link = document.createElement("a");
    link.download = `cronograma-${(role || "vaga").toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function resetForm() {
    setRole("");
    setGroup("adm2");
    setStartDate(new Date().toISOString().slice(0, 10));
  }

  return (
    <main className="page-shell">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />

      <section className="hero">
        <div className="eyebrow"><Sparkles size={16} /> Planejamento inteligente de seleção</div>
        <h1>Vagas <span>Timeline</span></h1>
        <p>Transforme a política de Time to Fill em um cronograma claro, automático e pronto para compartilhar.</p>
      </section>

      <section className="workspace">
        <aside className="glass-card form-card">
          <div className="card-title">
            <div className="icon-box"><TimerReset size={22} /></div>
            <div>
              <h2>Configurar cronograma</h2>
              <p>Preencha os dados básicos da vaga.</p>
            </div>
          </div>

          <label>
            Nome do cargo
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="Ex.: Coordenador de Logística" />
          </label>

          <label>
            Grupo de cargo
            <select value={group} onChange={e => setGroup(e.target.value as GroupKey)}>
              {Object.entries(GROUPS).map(([key, item]) => (
                <option key={key} value={key}>{item.label} — {item.description}</option>
              ))}
            </select>
          </label>

          <label>
            Data de abertura
            <div className="date-field">
              <CalendarDays size={18} />
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
          </label>

          <div className="sla-summary">
            <div><span>Time to Fill</span><strong>{config.timeToFill} dias</strong></div>
            <div><span>Triagem mínima</span><strong>{config.triageMinimum} dias</strong></div>
          </div>

          <button className="secondary-button" onClick={resetForm}><RotateCcw size={17} /> Limpar</button>
        </aside>

        <section ref={panelRef} className="glass-card timeline-card">
          <div className="timeline-header">
            <div>
              <span className="mini-label">CRONOGRAMA DA VAGA</span>
              <h2>{role || "Nome do cargo"}</h2>
              <p>{config.label} · {config.description}</p>
            </div>
            <div className="status-chip"><span /> Dentro da SLA</div>
          </div>

          <div className="metrics-grid">
            <div><span>Início</span><strong>{formatDate(dateFromInput(startDate))}</strong></div>
            <div><span>Conclusão</span><strong>{formatDate(finalDate)}</strong></div>
            <div><span>Prazo planejado</span><strong>{totalDays} dias</strong></div>
          </div>

          <div className="progress-wrap">
            <div className="progress-label"><span>Planejamento da SLA</span><strong>{totalDays} / {config.timeToFill} dias</strong></div>
            <div className="progress-track"><div className="progress-bar" style={{ width: `${Math.min(100, totalDays / config.timeToFill * 100)}%` }} /></div>
          </div>

          <div className="timeline-list">
            {schedule.map((stage, index) => (
              <article className="timeline-item" key={`${stage.name}-${index}`}>
                <div className="step-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="step-line"><span /></div>
                <div className="step-content">
                  <div>
                    <h3>{stage.name}</h3>
                    <p>{formatDate(stage.start)} até {formatDate(stage.end)}</p>
                  </div>
                  <div className="days-pill">{stage.days} dia{stage.days !== 1 ? "s" : ""}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="panel-footer">Dias corridos: a contagem inclui finais de semana e feriados.</div>
        </section>
      </section>

      <section className="actions-bar glass-card">
        <button className="primary-button" onClick={copyText}>{copied ? <Check size={18} /> : <Clipboard size={18} />}{copied ? "Copiado!" : "Copiar cronograma"}</button>
        <button className="secondary-button" onClick={exportImage}><Download size={18} /> Exportar como PNG</button>
      </section>
    </main>
  );
}
