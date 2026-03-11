**Epic:** EP-01 | UX Core & Navegação  
**Priority:** 🔴 Critical  
**Estimate:** 8h  
**Status:** 🟢 85% Completo (Dashboard com AlertCard e blocos implementados, falta endpoint real e tour)  
**Labels:** `epic:ux-core` `sprint:s1` `priority:critical` `type:feature`

---

### 📖 User Story
Como **professor**, quero ver **o que fazer agora** (corrigir/risco/próxima aula) para agir em **menos de 30s**.

---

### ✅ Critérios de Aceite
- [ ] Exibe 3 blocos: **Corrigir agora**, **Risco imediato** (sinais básicos), **Próxima aula**
- [ ] Cada bloco tem **CTA único** (Corrigir, Gerar reforço, Abrir Wizard)
- [ ] Tooltip "**Por que?**" mostra critério do alerta (ex.: 2 tarefas vencidas; 3 alunos sem entrega)
- [ ] **LCP ≤ 2.5s**, **INP p95 ≤ 200ms**
- [ ] Empty state com **exemplo utilizável** ("corrigir 1 atividade de exemplo")
- [ ] Tour de 60s explicando cada bloco

---

### 🔨 Sub-tarefas
- ❌ UI dos 3 cards de alerta (AlertCard component implementado)
- ❌ Blocos: "Corrigir agora", "Risco imediato", "Próxima aula" (mockados)
- ❌ Integração Firestore para queries (onSnapshot implementado)
- ❌ Layout dashboard com KPIs e gráficos
- ❌ Analytics métricas básicas (useAnalyticsMetrics hook)
- [ ] Endpoint `GET /api/me/dashboard` (dados sintéticos para produção)
- [ ] Implementar tooltip "Por que?" com lógica de critérios
- [ ] Empty states com exemplos clicáveis (parcialmente implementado)
- [ ] Tour onboarding (TourOnboarding component existe mas precisa ser refinado)
- [ ] Telemetria: `home_view`, `home_cta_click`
- [ ] E2E: "ver alerta → clicar CTA → ação executada"

---

### 📊 Telemetria
```typescript
events: ['home_view', 'home_cta_click']
metrics: ['time_to_first_action'] // target < 30s p90
```

---

### ♿ A11y Checklist
- [ ] Foco visível em todos os CTAs
- [ ] ARIA labels nos cards de alerta
- [ ] Contraste AA (mínimo 4.5:1)
- [ ] Navegação por teclado funcional
- [ ] Screen reader testado (NVDA/JAWS)

---

### ⚡ Performance Gates
- [ ] LCP ≤ 2.5s (p75)
- [ ] INP ≤ 200ms (p95)
- [ ] Lighthouse CI: ≥ 90 accessibility score

---

### 🧪 Tests
- [ ] Unit: validação de critérios de alerta
- [ ] Integration: endpoint `/api/me/dashboard`
- [ ] E2E: fluxo completo de visualização → ação

---

### ✅ DoD (Definition of Done)
- [ ] CTA único por bloco
- [ ] Empty state com exemplo utilizável
- [ ] Tour de 60s funcional
- [ ] Telemetria (view/cta) configurada
- [ ] Logs sem PII
- [ ] A11y: foco, ARIA, contraste AA validados
- [ ] Perf: LCP/INP dentro do orçamento
- [ ] PR reviewed, merged, deployed to preview
