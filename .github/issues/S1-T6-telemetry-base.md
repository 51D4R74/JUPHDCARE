**Epic:** EP-02 | Gestão & Planejamento  
**Priority:** 🟡 High  
**Estimate:** 4h  
**Status:** 🟢 60% Completo (trackEvent implementado, falta instrumentação das 3 métricas)  
**Labels:** `epic:gestao` `sprint:s1` `priority:high` `type:infrastructure`

---

### 📖 User Story
Como **product owner**, quero capturar métricas de UX reais para validar hipóteses de roadmap.

---

### 🎯 Objetivo
Implementar **base de telemetria** e instrumentar 3 métricas críticas de UX:
1. **Tempo de primeira ação** (first paint → clique em actionable block)
2. **Fluxo de busca** (biblioteca: query → resultado → adapt)
3. **Jobs success rate** (skillmap: 202 → polling → 200 vs 500)

---

### ✅ Critérios de Aceite
- [ ] Função `trackEvent(name, properties)` criada
- [ ] Backend em `/api/telemetry/ingest` (grava em Firestore `analytics/events/{eventId}`)
- [ ] 3 métricas instrumentadas:
  - **UX metrics**: `dashboard_first_action`, `library_search_flow`
  - **Jobs metrics**: `job_success`, `job_failure`, `job_retry`
- [ ] Privacy-first (sem PII em properties)
- [ ] Dashboard interno (Grafana ou Firebase Analytics) configurado

---

### 🔨 Sub-tarefas
- [x] Criar `src/lib/analytics.ts` com `trackEvent()` helper (IMPLEMENTADO)
- [x] Schema Firestore `orgs/{orgId}/analyticsEvents` (IMPLEMENTADO)
- [x] Função trackEvent integrada em workflow.repo.ts (`plan_saved`, `plan_published`, `draft_saved`, `draft_published`)
- [ ] Endpoint `/api/telemetry/ingest` (batch support opcional) - OPCIONAL
- [ ] Instrumentar `/inicio`: `dashboard_first_action`
- [ ] Instrumentar `/biblioteca`: `library_search_flow` (query, results, adapt)
- [ ] Instrumentar jobs: `job_success`, `job_failure`, `job_retry`
- [ ] Configurar visualização (Firebase Analytics ou custom dashboard)
- [ ] Docs em `docs/telemetry.md` (como adicionar novos eventos)

---

### 📊 Telemetria (meta-event 😄)
```typescript
events: [
  'telemetry_event_sent', // {event_name: string, success: boolean}
  'telemetry_batch_flushed' // {batch_size: number}
]
```

---

### ♿ A11y Checklist
- [ ] Telemetria não interfere em a11y (async, non-blocking)

---

### ⚡ Performance Gates
- [ ] `trackEvent()` não bloqueia UI (async)
- [ ] Batch opcional (flush a cada 10 eventos ou 30s)
- [ ] Sem impacto em Core Web Vitals

---

### 🧪 Tests
- [ ] Unit: `trackEvent()` envia payload correto
- [ ] E2E: validar 3 métricas são enviadas em fluxos reais

---

### ✅ DoD
- [ ] 3 métricas instrumentadas e validadas
- [ ] Docs de telemetria criados
- [ ] Performance não impactada (validado)
- [ ] Dashboard configurado
- [ ] PR reviewed e deployed
