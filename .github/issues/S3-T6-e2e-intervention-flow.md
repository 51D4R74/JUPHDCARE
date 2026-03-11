**Epic:** EP-04 | Turmas & Intervenção  
**Priority:** 🔴 Critical  
**Estimate:** 4h  
**Labels:** `epic:turmas` `sprint:s3` `priority:critical` `type:testing`

---

### 📖 User Story
Como **QA**, quero validar o fluxo completo de intervenção (Heatmap → Reforço → Atribuir → Aluno visualiza) via E2E.

---

### 🧪 Cenário E2E
Playwright: abrir **/turmas** → ver **heatmap** → selecionar **3 alunos vermelhos** (em risco) → clicar **"Gerar Reforço"** → wizard → publicar → confirmar **ActivityGroup criado** → aluno vê tarefa em "Minhas Atividades".

---

### ✅ Critérios de Aceite
- [ ] E2E completo funciona end-to-end sem intervenção manual
- [ ] Tempo total do fluxo **< 2min** (medido via telemetria)
- [ ] Validações:
  - Heatmap carregado com células coloridas (verde/amarelo/vermelho)
  - 3 alunos selecionados (checkbox)
  - Wizard de reforço completo (3 steps)
  - ActivityGroup criado no Firestore
  - Notificação enviada (mock/spy)
  - Aluno vê atividade em `/minhas-atividades`
- [ ] Sucesso sem ajuda **≥ 90%** (objetivo de usabilidade)

---

### 🔨 Sub-tarefas
- [ ] Implementar E2E em `tests/e2e/intervention-flow.spec.ts`
- [ ] Setup: criar turma de teste com 5 alunos (2 em risco = células vermelhas)
- [ ] Navegar para `/turmas/:id`
- [ ] Validar heatmap carregado (aguardar células renderizadas)
- [ ] Selecionar 3 alunos via checkbox
- [ ] Clicar botão "Gerar Reforço"
- [ ] Wizard:
  - Step 1: selecionar competência (autocomplete)
  - Step 2: escolher tipo "Exercício"
  - Step 3: definir prazo + revisar
  - Publicar
- [ ] Validar:
  - ActivityGroup criado no Firestore (query via Admin SDK)
  - Notificação enviada (spy no serviço de notificação)
  - Aluno 1 vê atividade em `/minhas-atividades` (login como aluno)
- [ ] Medir tempo total via telemetria (target < 2min)
- [ ] CI: rodar E2E em GitHub Actions
- [ ] Docs: atualizar `docs/e2e-tests.md` com novo cenário

---

### 📊 Telemetria
```typescript
events: [
  'e2e_intervention_flow_start',
  'e2e_intervention_flow_complete', // {duration_ms: number, success: boolean}
]
metrics: ['flow_duration', 'success_rate']
```

---

### ♿ A11y Checklist
- [ ] E2E usa locators semânticos (role, label) para garantir a11y

---

### ⚡ Performance Gates
- [ ] Fluxo completo **< 2min** (p90)
- [ ] E2E test roda em < 3 minutos (CI)

---

### 🧪 Tests
- [ ] O próprio teste é a validação 😄
- [ ] Garantir que falha corretamente (quebrar intencionalmente para validar)

---

### ✅ DoD
- [ ] E2E completo passa em CI
- [ ] Tempo total < 2min validado
- [ ] Sucesso sem ajuda ≥ 90% (objetivo documentado)
- [ ] Aluno vê atividade após intervenção (validado)
- [ ] Docs atualizados com novo cenário
- [ ] PR reviewed, merged, deployed
