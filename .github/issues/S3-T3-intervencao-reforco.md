**Epic:** EP-04 | Turmas & Intervenção  
**Priority:** 🔴 Critical  
**Estimate:** 10h  
**Labels:** `epic:turmas` `sprint:s3` `priority:critical` `type:feature`

---

### 📖 User Story
Como **professor**, ao ver alunos em risco no heatmap, quero clicar em **"Gerar Reforço"** e criar uma atividade direcionada em **< 2min**.

---

### ✅ Critérios de Aceite
- [ ] Botão **"Gerar Reforço"** no heatmap (após selecionar alunos)
- [ ] Modal wizard simplificado (3 steps):
  1. Selecionar **competência alvo**
  2. Escolher **tipo** (Exercício, Leitura, Vídeo, Jogo)
  3. Definir **prazo** e revisar
- [ ] Cria **ActivityGroup** (subgrupo de alunos selecionados)
- [ ] **IA sugere conteúdo** (template pré-preenchido baseado na competência)
- [ ] Rascunho revisável antes de publicar
- [ ] Notifica apenas os alunos selecionados
- [ ] Total flow **≤ 2min** (p90)

---

### 📊 Modelo de Dados
```typescript
interface ActivityGroup {
  id: string;
  classId: string;
  activityId: string;
  studentIds: string[]; // apenas alunos selecionados
  reason: string; // ex: "Reforço: Leitura crítica (EF06LP01)"
  createdBy: string;
  createdAt: Timestamp;
}

interface Intervention {
  id: string;
  orgId: string;
  classId: string;
  activityGroupId: string;
  competency: string; // código BNCC/CEFR
  type: 'exercise' | 'reading' | 'video' | 'game';
  content: string; // gerado por IA ou manual
  deadline: Timestamp;
  status: 'draft' | 'published';
}
```

---

### 🔨 Sub-tarefas
- [ ] Modelo Firestore `orgs/{orgId}/activityGroups/{id}`
- [ ] Modelo Firestore `orgs/{orgId}/interventions/{id}`
- [ ] Repository em `src/lib/repositories/interventions.repo.ts`
- [ ] UI InterventionWizard (modal 3 steps)
- [ ] Integração com IA (endpoint `/api/ai/suggest-intervention`)
  - Prompt: "Gerar reforço para competência X, tipo Y, nível Z"
- [ ] Seleção de alunos no heatmap (checkbox multi-select)
- [ ] CompetencySelector (reutilizar de S2-T3)
- [ ] Preview antes de publicar (card de atividade)
- [ ] Sistema de notificação (apenas para alunos selecionados)
- [ ] Endpoint `POST /api/interventions`
- [ ] Endpoint `POST /api/interventions/:id/publish`
- [ ] Telemetria: `intervention_start`, `intervention_suggest`, `intervention_accept`, `intervention_edit`, `intervention_assign`

---

### 📊 Telemetria
```typescript
events: [
  'intervention_start', // {students_count: number}
  'intervention_suggest', // {competency: string, type: string}
  'intervention_accept', // {ai_generated: boolean}
  'intervention_edit', // {field: string}
  'intervention_assign' // {students_count: number}
]
metrics: [
  'intervention_duration', // target < 2min
  'students_per_intervention',
  'ai_acceptance_rate' // % de sugestões aceitas sem edição
]
```

---

### ♿ A11y Checklist
- [ ] Modal wizard navegável por teclado
- [ ] ARIA labels em cada step
- [ ] Seleção de alunos acessível (checkbox com labels)
- [ ] Preview legível para screen readers
- [ ] Confirmação clara antes de publicar

---

### ⚡ Performance Gates
- [ ] Wizard < 2min (p90, medido via telemetria)
- [ ] IA sugere conteúdo em < 5s
- [ ] Publicação + notificação em < 1s

---

### 🧪 Tests
- [ ] Unit: lógica de ActivityGroup, validação de dados
- [ ] Integration: endpoints interventions, IA suggest
- [ ] E2E: heatmap → selecionar 3 alunos → gerar reforço → publicar → validar notificações

---

### ✅ DoD
- [ ] Wizard completo em < 2min (p90)
- [ ] IA sugere conteúdo relevante
- [ ] Notificações enviadas apenas aos alunos selecionados
- [ ] ActivityGroup criado corretamente
- [ ] Telemetria configurada
- [ ] PR reviewed, merged, deployed
