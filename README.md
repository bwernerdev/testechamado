# Chamado Service Desk — Suprimentos Seara

Página interna com as diretrizes para abertura de chamados de Suprimentos
(CDs Seara), organograma da equipe de compradores e acesso ao modelo de
Memorial Descritivo.

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org/) 14 ou superior.

```bash
npm start
# ou, sem npm:
node server.js
```

O servidor sobe em `http://localhost:3000`. Para usar outra porta, defina a
variável de ambiente `PORT` (ex.: `PORT=8080 node server.js`).

## Estrutura

```
projetos/
├── server.js                 # Servidor estático (apenas módulos nativos do Node)
├── package.json              # Scripts e metadados do projeto
├── README.md
└── chamado-servicedesk/      # Conteúdo da página
    ├── index.html            # Estrutura e textos das diretrizes
    ├── styles.css            # Estilos da página
    ├── script.js             # Interações + dados do organograma
    └── imagens/              # Logos e favicon
```

## Manutenção

- **Dados do organograma** (nomes, ramais, e-mails e CDs): edite os arrays
  `leadershipMembers` e `teamMembers` no início de `chamado-servicedesk/script.js`.
- **Conteúdo textual** (textos das diretrizes): edite `chamado-servicedesk/index.html`.
- **Após alterar `styles.css`**, atualize o `?v=` no `<link>` do `index.html`
  para forçar os navegadores a recarregarem o cache.

## Compatibilidade

A página usa recursos modernos da web (`<dialog>`, `backdrop`, `details/summary`).
Recomendado usar em navegadores atualizados (Edge, Chrome, Firefox, Safari).
