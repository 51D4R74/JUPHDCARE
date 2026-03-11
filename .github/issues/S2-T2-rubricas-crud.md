**Epic:** EP-03 | Planejamento & Rubricas  
**Priority:** 🔴 Critical  
**Estimate:** 8h  
**Labels:** `epic:planejamento` `sprint:s2` `priority:critical` `type:feature`

---

### 📖 User Story
Como **professor**, quero **rubricas reutilizáveis** mapeadas à BNCC com níveis editáveis para avaliar por competência.

---

### ✅ Critérios de Aceite
- [ ] CRUD de Rubrica (Create, Read, Update, Delete)
- [ ] Níveis com descritores editáveis (Insuficiente, Básico, Proficiente, Avançado)
- [ ] Ligação de competências (buscar BNCC/CEFR)
- [ ] "Salvar como modelo" (reutilizável)
- [ ] Buscar rubrica por competência
- [ ] Fork de rubrica existente (cria cópia editável)
- [ ] Export/Import JSON

---

### 📊 Modelo de Dados
```typescript
interface Rubric {
  id: string;
  orgId: string;
  title: string;
  competencies: string[]; // códigos BNCC/CEFR
  levels: RubricLevel[];
  createdBy: string;
  isPublic: boolean; // compartilhável na org
  usageCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface RubricLevel {
  name: string; // ex: "Proficiente"
  description: string;
  indicators: string[]; // descritores
  score?: number; // pontuação opcional
}
```

---

### 🔨 Sub-tarefas
- [ ] Modelo Firestore `orgs/{orgId}/rubrics/{id}`
- [ ] CRUD repository em `src/lib/repositories/rubrics.repo.ts`
- [ ] RubricEditor UI com níveis editáveis
- [ ] CompetencySelector (integração com S2-T3)
- [ ] Catálogo de rubricas com busca/filtro
- [ ] Fork functionality (cria cópia editável)
- [ ] Export/Import JSON
- [ ] Validadores Zod para schema
- [ ] Endpoint `GET /api/rubrics` (lista rubricas da org)
- [ ] Endpoint `POST /api/rubrics` (criar rubrica)
- [ ] Endpoint `PUT /api/rubrics/:id` (atualizar)
- [ ] Endpoint `DELETE /api/rubrics/:id` (deletar)
- [ ] Endpoint `POST /api/rubrics/:id/fork` (criar cópia)
- [ ] Telemetria: `rubric_create`, `rubric_save_as_template`, `rubric_bind_competency`, `rubric_fork`, `rubric_export`

---

### 📊 Telemetria
```typescript
events: [
  'rubric_create',
  'rubric_save_as_template',
  'rubric_bind_competency', // {competency_code: string}
  'rubric_fork', // {source_rubric_id: string}
  'rubric_export'
]
metrics: ['rubrics_per_org', 'most_forked_rubrics', 'avg_levels_per_rubric']
```

---

### ♿ A11y Checklist
- [ ] Editor acessível por teclado
- [ ] ARIA labels em campos de nível
- [ ] Preview legível para screen readers
- [ ] Navegação entre níveis com Tab/Shift+Tab
- [ ] Botões de ação com tooltips descritivos

---

### ⚡ Performance Gates
- [ ] Lista de rubricas carrega em < 500ms
- [ ] Editor abre instantaneamente (< 200ms)
- [ ] Autosave no editor (debounce 2s)

---

### 🧪 Tests
- [ ] Unit: validadores Zod, fork logic
- [ ] Integration: CRUD endpoints
- [ ] E2E: criar rubrica → editar níveis → salvar como modelo → fork

---

### ✅ DoD
- [ ] Export/Import JSON funcional
- [ ] A11y checklist completo
- [ ] Autosave implementado
- [ ] Performance gates validados
- [ ] Integrado no Wizard (S2-T1 step 3)
- [ ] Telemetria configurada
- [ ] PR reviewed, merged, deployed
