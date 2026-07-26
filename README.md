# Vagas Timeline — Cronograma de Vagas

Aplicação para gerar cronogramas automáticos de processos seletivos conforme o grupo do cargo e o Time to Fill da política.

## Recursos

- Seleção do grupo do cargo por lista suspensa
- Campo para nome do cargo
- Data de abertura
- Cálculo automático em dias corridos
- Respeito ao Time to Fill
- Priorização de tempo para triagem
- Painel em glassmorphism com botões 3D
- Copiar cronograma como texto
- Exportar painel como PNG
- Layout responsivo para desktop e celular

## Executar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Publicar na Vercel

1. Envie este projeto para o GitHub.
2. Acesse a Vercel.
3. Clique em **Add New Project**.
4. Importe o repositório `Cronograma-de-vagas`.
5. Clique em **Deploy**.

## Regra de datas

A contagem utiliza dias corridos, incluindo finais de semana e feriados, conforme a política informada.
