"use client";

import { useMemo, useRef, useState } from "react";

type GroupKey = "adm1" | "adm2" | "especialistas" | "lideranca1" | "gerentes" | "executivos";
type Stage = { name: string; days: number };
type Group = { label: string; description: string; timeToFill: number; triageMinimum: number; stages: Stage[] };
type ScheduledStage = Stage & { start: Date; end: Date };

const LOGO = "/minerva-logo.svg";

const GROUPS: Record<GroupKey, Group> = {
  adm1:{label:"Administrativo 1",description:"Assistentes e Tele Vendas",timeToFill:15,triageMinimum:4,stages:[{name:"Abertura e briefing",days:1},{name:"Publicação e atração",days:1},{name:"Triagem",days:4},{name:"Entrevista Hub",days:2},{name:"Entrevista gestor",days:2},{name:"Pesquisas",days:1},{name:"Proposta",days:1},{name:"Reserva técnica",days:3}]},
  adm2:{label:"Administrativo 2",description:"Analistas e Vendedores",timeToFill:20,triageMinimum:4,stages:[{name:"Abertura e briefing",days:2},{name:"Publicação e atração",days:2},{name:"Triagem",days:4},{name:"Entrevista Hub",days:2},{name:"Entrevista gestor",days:3},{name:"Pesquisas",days:2},{name:"Proposta",days:1},{name:"Reserva técnica",days:4}]},
  especialistas:{label:"Especialistas",description:"Corporativos e Técnicos",timeToFill:30,triageMinimum:4,stages:[{name:"Abertura e briefing",days:2},{name:"Publicação e atração",days:2},{name:"Triagem",days:6},{name:"Entrevista Hub",days:3},{name:"Entrevista gestor",days:3},{name:"Gestão da gestão",days:3},{name:"Pesquisas",days:2},{name:"Proposta",days:1},{name:"Reserva técnica",days:8}]},
  lideranca1:{label:"Liderança 1",description:"Supervisores e Coordenadores",timeToFill:45,triageMinimum:7,stages:[{name:"Abertura e briefing",days:2},{name:"Publicação e hunting",days:3},{name:"Triagem e mapeamento",days:7},{name:"Entrevista Hub",days:7},{name:"Entrevista gestor",days:3},{name:"Entrevista BP",days:3},{name:"Head de Seleção",days:2},{name:"Compliance",days:3},{name:"Gestor do gestor",days:3},{name:"Decisão e proposta",days:3},{name:"Reserva técnica",days:9}]},
  gerentes:{label:"Liderança 2 — Gerentes",description:"Gerentes",timeToFill:60,triageMinimum:10,stages:[{name:"Abertura e briefing",days:2},{name:"Publicação e hunting",days:4},{name:"Triagem e mapeamento",days:10},{name:"Entrevista Hub",days:7},{name:"Entrevista gestor",days:3},{name:"Entrevista BP",days:3},{name:"Head de Seleção",days:3},{name:"Compliance",days:3},{name:"Gestor do gestor",days:3},{name:"Decisão em comitê",days:3},{name:"Proposta",days:2},{name:"Reserva técnica",days:17}]},
  executivos:{label:"Liderança 2 — Executivos",description:"Gerentes Executivos e Diretores",timeToFill:60,triageMinimum:15,stages:[{name:"Abertura e briefing",days:2},{name:"Publicação e hunting",days:4},{name:"Triagem e mapeamento",days:15},{name:"Entrevista Hub",days:7},{name:"Entrevista gestor",days:3},{name:"Entrevista BP",days:3},{name:"Head de Seleção",days:3},{name:"Compliance",days:3},{name:"Gestor do gestor",days:3},{name:"Assessment",days:4},{name:"Decisão em comitê",days:3},{name:"Proposta",days:2},{name:"Reserva técnica",days:8}]}
};

const addDays=(date:Date,days:number)=>{const d=new Date(date);d.setDate(d.getDate()+days);return d};
const parseDate=(value:string)=>{const[y,m,d]=value.split("-").map(Number);return new Date(y,m-1,d,12)};
const formatDate=(date:Date)=>new Intl.DateTimeFormat("pt-BR").format(date);
const todayInput=()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)};
const buildSchedule=(config:Group,start:Date)=>{let cursor=start;return config.stages.map(stage=>{const stageStart=cursor;const stageEnd=addDays(stageStart,stage.days);cursor=stageEnd;return{...stage,start:stageStart,end:stageEnd}})};

async function elementToPng(element: HTMLElement) {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.classList.add("capture-mode");
  clone.setAttribute("xmlns","http://www.w3.org/1999/xhtml");
  const css = Array.from(document.styleSheets).flatMap(sheet => {
    try { return Array.from(sheet.cssRules).map(rule => rule.cssText); } catch { return []; }
  }).join("\n");
  const width = Math.max(element.scrollWidth, 1500);
  const height = element.scrollHeight;
  const html = new XMLSerializer().serializeToString(clone);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><style>${css}</style><foreignObject width="100%" height="100%">${html}</foreignObject></svg>`;
  const image = new Image();
  const url = URL.createObjectURL(new Blob([svg],{type:"image/svg+xml;charset=utf-8"}));
  await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=reject;image.src=url});
  const canvas=document.createElement("canvas");
  canvas.width=width*2;canvas.height=height*2;
  const ctx=canvas.getContext("2d");
  if(!ctx) throw new Error("Canvas indisponível");
  ctx.scale(2,2);ctx.drawImage(image,0,0);URL.revokeObjectURL(url);
  return await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("Falha ao gerar imagem")),"image/png"));
}

export default function Home(){
  const[role,setRole]=useState("");
  const[group,setGroup]=useState<GroupKey>("adm2");
  const[startDate,setStartDate]=useState(todayInput);
  const[state,setState]=useState<"idle"|"working"|"copied"|"downloaded">("idle");
  const panelRef=useRef<HTMLElement>(null);

  const config=GROUPS[group];
  const safeStart=startDate||todayInput();
  const schedule=useMemo(()=>buildSchedule(config,parseDate(safeStart)),[config,safeStart]);
  const finalDate=schedule.at(-1)?.end??parseDate(safeStart);
  const total=schedule.reduce((s,x)=>s+x.days,0);
  const slack=Math.max(0,config.timeToFill-total);

  async function copyPanel(){
    if(!panelRef.current)return;
    setState("working");
    try{
      const blob=await elementToPng(panelRef.current);
      if(navigator.clipboard&&"write"in navigator.clipboard&&typeof ClipboardItem!=="undefined"){
        await navigator.clipboard.write([new ClipboardItem({"image/png":blob})]);
        setState("copied");
      }else{
        const u=URL.createObjectURL(blob),a=document.createElement("a");
        a.href=u;a.download="vagas-timeline.png";a.click();URL.revokeObjectURL(u);setState("downloaded");
      }
    }catch{
      alert("O navegador bloqueou a cópia da imagem. Use Exportar PNG.");
      setState("idle");
    }
    setTimeout(()=>setState("idle"),2200);
  }

  async function exportPng(){
    if(!panelRef.current)return;
    const blob=await elementToPng(panelRef.current);
    const u=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=u;a.download="vagas-timeline.png";a.click();URL.revokeObjectURL(u);
  }

  return <main className="page-shell">
    <div className="orb orb-one"/><div className="orb orb-two"/><div className="orb orb-three"/>
    <header className="hero"><span className="eyebrow">✦ Planejamento inteligente de seleção</span><h1>Vagas <span>Timeline</span></h1><p>Transforme a política de Time to Fill em um cronograma automático, visual e pronto para compartilhar.</p></header>

    <section className="glass-card control-header">
      <div className="header-field role-field"><label>Nome do cargo</label><input value={role} onChange={e=>setRole(e.target.value)} placeholder="Ex.: Coordenador de Logística"/></div>
      <div className="header-field"><label>Grupo de cargo</label><select value={group} onChange={e=>setGroup(e.target.value as GroupKey)}>{Object.entries(GROUPS).map(([key,item])=><option key={key} value={key}>{item.label} — {item.description}</option>)}</select></div>
      <div className="header-field date-field"><label>Data de abertura</label><input type="date" value={safeStart} onChange={e=>setStartDate(e.target.value)}/></div>
      <button className="secondary-button clear-button" onClick={()=>{setRole("");setGroup("adm2");setStartDate(todayInput())}}>↻ Limpar</button>
    </section>

    <section ref={panelRef} className="glass-card timeline-card">
      <div className="panel-head">
        <div><span className="mini-label">CRONOGRAMA DA VAGA</span><h2>{role||"Nome do cargo"}</h2><p>{config.label} · {config.description}</p></div>
        <div className="brand-block"><img src={LOGO} alt="Minerva Foods"/><div className="status-chip"><span/> Dentro da SLA</div></div>
      </div>

      <div className="metrics-grid">
        <div><span>Início</span><strong>{formatDate(parseDate(safeStart))}</strong></div>
        <div><span>Conclusão</span><strong>{formatDate(finalDate)}</strong></div>
        <div><span>Time to Fill</span><strong>{config.timeToFill} dias</strong></div>
        <div><span>Folga</span><strong>{slack} dias</strong></div>
      </div>

      <div className="progress-wrap"><div className="progress-label"><span>Planejamento da SLA</span><strong>{total} / {config.timeToFill} dias</strong></div><div className="progress-track"><div className="progress-bar" style={{width:`${Math.min(100,total/config.timeToFill*100)}%`}}/></div></div>

      <div className="timeline-viewport">
        <div className="ribbon-timeline" style={{gridTemplateColumns:`repeat(${schedule.length}, minmax(0, 1fr))`}}>
          <div className="ribbon-line"/>
          {schedule.map((stage,i)=><article className={`ribbon-step ${i%2===0?"top":"bottom"}`} key={`${stage.name}-${i}`}>
            <div className="step-copy">
              <h3>{stage.name}</h3>
              <p>{formatDate(stage.start)} até {formatDate(stage.end)}</p>
              <span>{stage.days} dia{stage.days===1?"":"s"}</span>
            </div>
            <div className="step-marker"><div className="step-index">{String(i+1).padStart(2,"0")}</div></div>
          </article>)}
        </div>
      </div>

      <footer className="panel-footer">Dias corridos: a contagem inclui finais de semana e feriados.</footer>
    </section>

    <section className="actions-bar glass-card">
      <button className="primary-button" onClick={copyPanel}>{state==="working"?"Gerando imagem…":state==="copied"?"✓ Painel copiado":state==="downloaded"?"✓ PNG baixado":"▣ Copiar painel com imagem"}</button>
      <button className="secondary-button" onClick={exportPng}>⇩ Exportar PNG</button>
      <button className="secondary-button" onClick={()=>window.print()}>⎙ Salvar em PDF</button>
    </section>
  </main>;
}
