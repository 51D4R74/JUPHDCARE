**Epic:** EP-03 | Planejamento & Rubricas  
**Priority:** 🔴 Critical  
**Estimate:** 16h  
**Labels:** `epic:planejamento` `sprint:s2` `priority:critical` `type:feature`

---

### 📖 User Story
Como **professor**, quero criar um plano completo com rubrica em **≤ 10min** usando wizard guiado.

---

### 🎯 Fluxo do Wizard (4 steps)
1. **CompetencySearch** → selecionar competências BNCC/CEFR
2. **ActivityBuilder** → adicionar atividades (drag-drop, sugestões IA)
3. **RubricSelector** → escolher/criar rubrica vinculada
4. **PublishForm** → atribuir a turma(s) + datas + notificar

---

### ✅ Critérios de Aceite
- [ ] Wizard multi-step com progress bar
- [ ] **Autosave a cada passo** (debounce 2s)
- [ ] Tour de 60s explicando cada step
- [ ] Undo/redo simples por passo
- [ ] Sugestões IA em ActivityBuilder (opcional, baseado em competência)
- [ ] Total wizard time **≤ 10min** (p90)
- [ ] Integração com ⌘K: "Criar plano"

---

### 🔨 Sub-tarefas
- [ ] UI multi-step wizard (react-hook-form ou similar)
- [ ] Autosave implementado (debounce 2s → POST /api/plans/draft)
- [ ] **Step 1**: CompetencySearch com autocomplete
- [ ] **Step 2**: ActivityBuilder com drag-drop (dnd-kit)
- [ ] **Step 3**: RubricSelector (integração com S2-T2)
- [ ] **Step 4**: PublishForm (turmas, datas, notificação)
- [ ] Endpoint `POST /api/plans` (CRUD de planos)
- [ ] Endpoint `POST /api/plans/:id/draft` (autosave)
- [ ] Tour onboarding (react-joyride)
- [ ] Undo/redo state management (Zustand ou Context)
- [ ] Integração com Command Palette (⌘K → "Criar plano")
- [ ] Telemetria: `plan_start`, `plan_step_complete`, `plan_add_competency`, `plan_add_activity`, `plan_ai_suggestion_accept`, `plan_add_rubric`, `plan_publish`, `plan_assign`
- [ ] E2E: wizard completo em < 10min

---

### 📊 Telemetria
```typescript
events: [
  'plan_start',
  'plan_step_complete', // {step: 1-4, duration_ms: number}
  'plan_add_competency', // {competency_code: string}
  'plan_add_activity', // {source: 'manual' | 'ai_suggestion'}
  'plan_ai_suggestion_accept',
  'plan_add_rubric', // {rubric_id: string}
  'plan_publish',
  'plan_assign' // {class_ids: string[]}
]
metrics: ['wizard_duration', 'steps_completed', 'ai_acceptance_rate']
```

---

### ♿ A11y Checklist
- [ ] Navegação por teclado (Tab, Enter, Esc)
- [ ] ARIA labels em cada step
- [ ] Progress bar anunciada para screen readers
- [ ] Contraste AA em todos os estados (active, inactive, error)
- [ ] Focus trap no wizard modal

---

### ⚡ Performance Gates
- [ ] Autosave sem lag perceptível (< 100ms)
- [ ] Drag-drop smooth (60fps)
- [ ] Total wizard time **≤ 10min** (p90 medido via telemetria)
- [ ] Step transitions instantâneas (< 200ms)

---

### 🧪 Tests
- [ ] Unit: autosave logic, undo/redo state
- [ ] Integration: endpoints CRUD, draft save
- [ ] E2E: wizard completo → validar plano criado + atribuído

---

### ✅ DoD
- [ ] Tour de 60s funcional
- [ ] Autosave validado (sem perda de dados)
- [ ] Undo/redo funcional por passo
- [ ] A11y checklist completo
- [ ] Performance gates validados (< 10min p90)
- [ ] Telemetria configurada e testada
- [ ] PR reviewed, merged, deployed to preview
