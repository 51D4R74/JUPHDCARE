**Epic:** EP-04 | Turmas & Intervenção  
**Priority:** 🟢 Medium  
**Estimate:** 6h  
**Labels:** `epic:turmas` `sprint:s3` `priority:medium` `type:feature`

---

### 📖 User Story
Como **aluno**, quero ver minhas atividades, fazer upload de entregas e receber feedback do professor.

---

### ✅ Critérios de Aceite
- [ ] Página **"Minhas Atividades"** (lista de tarefas atribuídas)
- [ ] Upload de arquivo ou URL para entrega
- [ ] Status visível: **Não iniciado**, **Em progresso**, **Entregue**, **Avaliado**
- [ ] Ver **feedback do professor** (nota + comentários)
- [ ] Notificação de nova atividade atribuída
- [ ] Filtros: "Pendentes", "Atrasadas", "Concluídas"
- [ ] Ordenação por prazo (mais urgente primeiro)

---

### 📊 Modelo de Dados
```typescript
interface Submission {
  id: string;
  activityId: string;
  studentId: string;
  classId: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  fileUrl?: string; // Cloud Storage URL
  linkUrl?: string; // URL externa (Google Docs, etc)
  submittedAt?: Timestamp;
  feedback?: {
    grade: number;
    comment: string;
    gradedBy: string;
    gradedAt: Timestamp;
  };
}
```

---

### 🔨 Sub-tarefas
- [ ] Modelo Firestore `orgs/{orgId}/submissions/{id}`
- [ ] Repository em `src/lib/repositories/submissions.repo.ts`
- [ ] UI Student Dashboard (página `/minhas-atividades`)
- [ ] Upload de arquivo (Cloud Storage integration)
  - React Dropzone
  - Validação de tipo/tamanho
  - Progress bar
- [ ] Campo para URL externa (opcional)
- [ ] Feedback viewer component (nota + comentários)
- [ ] Filtros: Pendentes, Atrasadas, Concluídas
- [ ] Ordenação por prazo
- [ ] Sistema de notificação (nova atividade, feedback recebido)
- [ ] Endpoint `GET /api/students/me/activities`
- [ ] Endpoint `POST /api/submissions` (criar entrega)
- [ ] Endpoint `PUT /api/submissions/:id` (atualizar entrega)
- [ ] Telemetria: `student_dashboard_view`, `student_task_open`, `student_submit`, `student_feedback_view`

---

### 📊 Telemetria
```typescript
events: [
  'student_dashboard_view',
  'student_task_open', // {activity_id: string}
  'student_submit', // {method: 'file' | 'url', file_size_kb?: number}
  'student_feedback_view' // {grade: number}
]
metrics: ['submissions_per_student', 'avg_submission_time', 'late_submissions_rate']
```

---

### ♿ A11y Checklist
- [ ] Lista de atividades navegável por teclado
- [ ] Upload com feedback acessível (progress, success, error)
- [ ] Status anunciado para screen readers
- [ ] Feedback legível e contrastado

---

### ⚡ Performance Gates
- [ ] Dashboard carrega em < 1s (até 50 atividades)
- [ ] Upload não bloqueia UI (async com progress)
- [ ] Filtros aplicam instantaneamente (< 100ms)

---

### 🧪 Tests
- [ ] Unit: validação de upload, status transitions
- [ ] Integration: endpoints submissions
- [ ] E2E: aluno vê atividade → faz upload → valida entrega criada

---

### ✅ DoD
- [ ] Upload de arquivo funcional (com validação)
- [ ] Feedback do professor visível
- [ ] Notificações enviadas (nova atividade, feedback)
- [ ] Filtros e ordenação funcionais
- [ ] Telemetria configurada
- [ ] PR reviewed, merged, deployed
