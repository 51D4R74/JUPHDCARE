**Epic:** EP-04 | Turmas & Intervenção  
**Priority:** 🟡 High  
**Estimate:** 8h  
**Labels:** `epic:turmas` `sprint:s3` `priority:high` `type:feature`

---

### 📖 User Story
Como **professor**, ao ajustar um plano para uma turma específica, quero que as mudanças sejam versionadas e visualizáveis.

---

### ✅ Critérios de Aceite
- [ ] Editar plano de uma turma cria **nova versão** (v2, v3...)
- [ ] Diff mostra mudanças: **adicionado**, **removido**, **modificado**
- [ ] Histórico navegável (timeline visual)
- [ ] **Rollback** para versão anterior
- [ ] Comparação lado a lado entre 2 versões
- [ ] Auditoria: quem editou, quando, por quê (comentário opcional)

---

### 📊 Modelo de Dados
```typescript
interface PlanVersion {
  id: string;
  planId: string;
  classId: string;
  version: number; // v1, v2, v3...
  diff: {
    added?: Activity[];
    removed?: string[]; // IDs de atividades removidas
    modified?: Partial<Activity>[]; // campos modificados
  };
  comment?: string; // motivo da mudança (opcional)
  createdBy: string;
  createdAt: Timestamp;
}
```

---

### 🔨 Sub-tarefas
- [ ] Modelo PlanVersion (já criado em S2-T4, reutilizar)
- [ ] Lógica de **diff calculation** (comparar v1 vs v2)
  - Detectar atividades adicionadas
  - Detectar atividades removidas
  - Detectar atividades modificadas (campos alterados)
- [ ] UI de versões (timeline component)
- [ ] DiffViewer component (lado a lado ou inline)
  - Highlight verde para adicionado
  - Highlight vermelho para removido
  - Highlight amarelo para modificado
- [ ] Rollback functionality (reverter para versão anterior)
- [ ] Modal de confirmação para rollback
- [ ] Endpoint `GET /api/plans/:id/versions?classId=`
- [ ] Endpoint `POST /api/plans/:id/versions` (criar nova versão)
- [ ] Endpoint `POST /api/plans/:id/rollback` (reverter para versão)
- [ ] Telemetria: `plan_version_create`, `plan_diff_view`, `plan_rollback`, `plan_compare`

---

### 📊 Telemetria
```typescript
events: [
  'plan_version_create', // {plan_id: string, class_id: string, version: number}
  'plan_diff_view', // {version_from: number, version_to: number}
  'plan_rollback', // {to_version: number}
  'plan_compare' // {version_1: number, version_2: number}
]
metrics: ['versions_per_plan', 'rollback_rate']
```

---

### ♿ A11y Checklist
- [ ] Timeline navegável por teclado
- [ ] Diff viewer legível para screen readers
- [ ] Cores de highlight com suficiente contraste (verde/vermelho/amarelo)
- [ ] Confirmação de rollback clara e acessível

---

### ⚡ Performance Gates
- [ ] Diff calculation em < 500ms (até 50 atividades)
- [ ] Timeline carrega em < 1s (até 20 versões)
- [ ] Comparação lado a lado renderiza instantaneamente

---

### 🧪 Tests
- [ ] Unit: diff calculation (added/removed/modified detection)
- [ ] Integration: endpoints versions, rollback
- [ ] E2E: editar plano → criar v2 → ver diff → rollback para v1

---

### ✅ DoD
- [ ] Diff calculation correto (validado com casos de teste)
- [ ] UI de histórico (timeline) funcional
- [ ] Rollback testado e funcional
- [ ] Comparação lado a lado implementada
- [ ] Telemetria configurada
- [ ] PR reviewed, merged, deployed
