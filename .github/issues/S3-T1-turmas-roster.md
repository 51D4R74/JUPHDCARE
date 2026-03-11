**Epic:** EP-04 | Turmas & Intervenção  
**Priority:** 🔴 Critical  
**Estimate:** 8h  
**Labels:** `epic:turmas` `sprint:s3` `priority:critical` `type:feature`

---

### 📖 User Story
Como **professor**, quero visualizar a lista de alunos da turma com status de atividades.

---

### ✅ Critérios de Aceite
- [ ] CRUD de Turma (nome, ano, disciplina, período letivo)
- [ ] Matricular alunos via **CSV upload simples**
- [ ] Listar atividades atribuídas à turma
- [ ] Status por aluno: entregue, atrasado, não entregou
- [ ] Filtros: "apenas em risco", "atrasados", "sem entrega"
- [ ] Ordenação por nome, status, nota média

---

### 📊 Modelo de Dados
```typescript
interface Class {
  id: string;
  orgId: string;
  name: string;
  year: number;
  subject: string;
  createdBy: string;
  studentIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Student {
  id: string; // Firebase Auth UID
  orgId: string;
  name: string;
  email: string;
  classIds: string[];
}
```

---

### 🔨 Sub-tarefas
- [ ] Modelo Firestore `orgs/{orgId}/classes/{id}`
- [ ] Modelo Firestore `orgs/{orgId}/students/{id}`
- [ ] CRUD repository em `src/lib/repositories/classes.repo.ts`
- [ ] UI Roster (tabela de alunos com status)
- [ ] CSV upload component (React Dropzone + Papa Parse)
- [ ] Validação CSV (campos obrigatórios: nome, email)
- [ ] Integração com atividades (query de status por aluno)
- [ ] Filtros e ordenação (client-side ou server-side)
- [ ] Endpoint `GET /api/classes/:id/students`
- [ ] Endpoint `POST /api/classes/:id/enroll` (CSV batch)
- [ ] Telemetria: `class_view`, `class_create`, `student_enroll`, `class_filter`

---

### 📊 Telemetria
```typescript
events: [
  'class_view', // {class_id: string}
  'class_create',
  'student_enroll', // {method: 'csv' | 'manual', count: number}
  'class_filter' // {filter: string}
]
metrics: ['students_per_class', 'enroll_success_rate']
```

---

### ♿ A11y Checklist
- [ ] Tabela acessível (ARIA table roles)
- [ ] Filtros navegáveis por teclado
- [ ] CSV upload com feedback acessível (progress, errors)
- [ ] Ordenação anunciada para screen readers

---

### ⚡ Performance Gates
- [ ] Roster carrega em < 1s (até 100 alunos)
- [ ] CSV upload processa em < 3s (até 500 alunos)
- [ ] Filtros aplicam instantaneamente (< 100ms)

---

### 🧪 Tests
- [ ] Unit: CSV parsing, validação de dados
- [ ] Integration: endpoints CRUD, enroll
- [ ] E2E: criar turma → upload CSV → validar alunos matriculados

---

### ✅ DoD
- [ ] CRUD de turma funcional
- [ ] CSV upload testado com arquivo de exemplo
- [ ] Filtros e ordenação funcionais
- [ ] Telemetria configurada
- [ ] PR reviewed, merged, deployed
