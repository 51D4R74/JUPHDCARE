**Epic:** EP-03 | Planejamento & Rubricas  
**Priority:** 🔴 Critical  
**Estimate:** 6h  
**Labels:** `epic:planejamento` `sprint:s2` `priority:critical` `type:feature`

---

### 📖 User Story
Como **professor**, ao finalizar o wizard, quero publicar o plano e atribuir a uma ou mais turmas com datas específicas.

---

### ✅ Critérios de Aceite
- [ ] Seleção de turma(s) com multi-select
- [ ] Data de início e fim (date picker)
- [ ] Preview do plano antes de publicar
- [ ] Cria **PlanVersion** inicial (v1) por turma
- [ ] Notificação opcional aos alunos (email/in-app)
- [ ] Integração com ⌘K: "Publicar plano atual", "Atribuir à [Turma]"
- [ ] Validação: não permitir sobreposição de datas na mesma turma

---

### 📊 Modelo de Dados
```typescript
interface PlanVersion {
  id: string;
  planId: string;
  classId: string;
  version: number; // v1, v2, etc
  diff?: object; // mudanças em relação à versão anterior
  publishedAt: Timestamp;
  publishedBy: string;
  status: 'draft' | 'published' | 'archived';
}
```

---

### 🔨 Sub-tarefas
- [ ] Modelo Firestore `orgs/{orgId}/planVersions/{id}`
- [ ] Repository em `src/lib/repositories/plan-versions.repo.ts`
- [ ] UI PublishForm (step 4 do wizard S2-T1)
  - Multi-select de turmas
  - Date range picker
  - Checkbox "Notificar alunos"
  - Preview do plano (PDF ou HTML)
- [ ] Endpoint `POST /api/plans/:id/publish`
- [ ] Endpoint `POST /api/plans/:id/assign`
- [ ] Sistema de notificação (email via SendGrid + in-app toast)
- [ ] Preview gerado via React PDF ou HTML to PDF
- [ ] Validação de sobreposição de datas
- [ ] Integração com Command Palette (⌘K)
- [ ] Telemetria: `plan_publish`, `plan_assign`, `plan_preview`, `plan_notify`

---

### 📊 Telemetria
```typescript
events: [
  'plan_publish', // {plan_id: string, version: number}
  'plan_assign', // {plan_id: string, class_ids: string[], start_date: string}
  'plan_preview', // {format: 'pdf' | 'html'}
  'plan_notify' // {recipients_count: number}
]
metrics: ['publish_to_assign_duration', 'notification_delivery_rate']
```

---

### ♿ A11y Checklist
- [ ] Date picker acessível (keyboard navigation)
- [ ] Multi-select com ARIA listbox
- [ ] Preview legível para screen readers
- [ ] Confirmação de publicação clara

---

### ⚡ Performance Gates
- [ ] Preview gerado em < 2s
- [ ] Publicação + atribuição em < 500ms
- [ ] Notificações enviadas em background (não bloqueia UI)

---

### 🧪 Tests
- [ ] Unit: validação de sobreposição, diff generation
- [ ] Integration: endpoints publish e assign
- [ ] E2E: publicar → atribuir a 2 turmas → validar PlanVersion criado

---

### ✅ DoD
- [ ] Publicação cria PlanVersion v1
- [ ] Notificações enviadas com sucesso
- [ ] ⌘K integrado ("Publicar plano", "Atribuir à [Turma]")
- [ ] Preview funcional (PDF ou HTML)
- [ ] Validação de datas implementada
- [ ] Telemetria configurada
- [ ] PR reviewed, merged, deployed
