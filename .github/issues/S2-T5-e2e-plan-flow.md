**Epic:** EP-03 | Planejamento & Rubricas  
**Priority:** 🔴 Critical  
**Estimate:** 4h  
**Labels:** `epic:planejamento` `sprint:s2` `priority:critical` `type:testing`

---

### 📖 User Story
Como **QA**, quero validar o fluxo completo de criação de plano (PDF → wizard → publicar → atribuir) via E2E.

---

### 🧪 Cenário E2E
Playwright: **importar PDF** (S1) → abrir **wizard /planejar** → adicionar **competências** → adicionar **atividades** → criar/escolher **rubrica** → **publicar** → **atribuir a turma**.

---

### ✅ Critérios de Aceite
- [ ] E2E completo funciona end-to-end sem intervenção manual
- [ ] Tempo total do fluxo **≤ 10min** (medido via telemetria)
- [ ] Validações:
  - PDF importado → material criado
  - Wizard completo → plano draft salvo
  - Publicar → PlanVersion v1 criado
  - Atribuir → notificação enviada (mock/spy)
- [ ] Sucesso sem ajuda **≥ 90%** (objetivo de usabilidade)

---

### 🔨 Sub-tarefas
- [ ] Implementar E2E em `tests/e2e/plan-creation-flow.spec.ts`
- [ ] Mock de PDF upload (ou usar fixture real)
- [ ] Navegar wizard step-by-step:
  - Step 1: buscar e selecionar competência
  - Step 2: adicionar atividade manual + sugestão IA (mock)
  - Step 3: escolher rubrica do catálogo
  - Step 4: publicar + atribuir a turma de teste
- [ ] Validar:
  - Draft salvo a cada step (autosave)
  - PlanVersion criado no Firestore
  - Notificação enviada (spy no serviço de notificação)
- [ ] Medir tempo total via telemetria (target ≤ 10min)
- [ ] CI: rodar E2E em GitHub Actions
- [ ] Docs: atualizar `docs/e2e-tests.md` com novo cenário

---

### 📊 Telemetria
```typescript
events: [
  'e2e_plan_flow_start',
  'e2e_plan_flow_complete', // {duration_ms: number, success: boolean}
]
metrics: ['flow_duration', 'success_rate']
```

---

### ♿ A11y Checklist
- [ ] E2E usa locators semânticos (role, label) para garantir a11y

---

### ⚡ Performance Gates
- [ ] Fluxo completo **≤ 10min** (p90)
- [ ] E2E test roda em < 3 minutos (CI)

---

### 🧪 Tests
- [ ] O próprio teste é a validação 😄
- [ ] Garantir que falha corretamente (quebrar intencionalmente para validar)

---

### ✅ DoD
- [ ] E2E completo passa em CI
- [ ] Tempo total ≤ 10min validado
- [ ] Sucesso sem ajuda ≥ 90% (objetivo documentado)
- [ ] Docs atualizados com novo cenário
- [ ] PR reviewed, merged, deployed
