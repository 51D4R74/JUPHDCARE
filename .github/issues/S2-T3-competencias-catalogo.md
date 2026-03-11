**Epic:** EP-03 | Planejamento & Rubricas  
**Priority:** 🟡 High  
**Estimate:** 6h  
**Labels:** `epic:planejamento` `sprint:s2` `priority:high` `type:feature`

---

### 📖 User Story
Como **professor**, quero buscar competências BNCC/CEFR por código ou descritor para usar em planos e rubricas.

---

### ✅ Critérios de Aceite
- [ ] Busca por código (ex: "EF06MA01") ou texto livre
- [ ] Filtros: framework (BNCC/CEFR), ano, área
- [ ] Card mostra: código, descritor, framework
- [ ] Vínculo rápido: "Usada em N materiais" → lista de materiais vinculados
- [ ] CTA: "Criar atividade com esta competência"
- [ ] Busca **≤ 300ms** (p95)
- [ ] Equivalências BNCC/CEFR mapeadas (seed inicial)

---

### 🔨 Sub-tarefas
- [ ] Seed de competências BNCC/CEFR (top 100 inicialmente)
  - Script `scripts/seed-competencies.ts`
  - Dados em `data/bncc-competencies.json` e `data/cefr-competencies.json`
- [ ] Modelo Firestore: collection global `competencies/{id}` ou por org
- [ ] CompetencySearch UI com autocomplete
- [ ] Filtros: framework, ano, área (multi-select)
- [ ] CompetencyCard com código + descritor + framework badge
- [ ] Integração com materiais (query de vínculo)
- [ ] Endpoint `GET /api/competencies?q=&framework=&year=&area=`
- [ ] Endpoint `GET /api/competencies/:code/materials` (materiais vinculados)
- [ ] Telemetria: `competency_search`, `competency_view`, `competency_quick_action`
- [ ] Cache local (IndexedDB) para competências frequentes

---

### 📊 Telemetria
```typescript
events: [
  'competency_search', // {query: string, filters: object, results_count: number}
  'competency_view', // {code: string, framework: string}
  'competency_quick_action' // {action: 'create_activity' | 'view_materials'}
]
metrics: ['search_latency', 'most_used_competencies', 'filter_usage']
```

---

### ♿ A11y Checklist
- [ ] Autocomplete com ARIA combobox
- [ ] Resultados anunciados para screen readers
- [ ] Navegação por teclado (setas, Enter)
- [ ] Filtros acessíveis (checkboxes/radio com labels)

---

### ⚡ Performance Gates
- [ ] Busca **< 300ms** (p95)
- [ ] Cache local reduz latência em buscas repetidas
- [ ] Autocomplete debounced (150ms)

---

### 🧪 Tests
- [ ] Unit: busca e filtros
- [ ] Integration: endpoint de competências
- [ ] E2E: buscar "leitura" → filtrar BNCC EF → selecionar competência

---

### ✅ DoD
- [ ] Seed de 100+ competências BNCC/CEFR
- [ ] Busca < 300ms validada
- [ ] Equivalências BNCC/CEFR mapeadas (seed inicial)
- [ ] Vínculo com materiais funcional
- [ ] Integrado no Wizard (S2-T1 step 1)
- [ ] Cache local implementado
- [ ] Telemetria configurada
- [ ] PR reviewed, merged, deployed
