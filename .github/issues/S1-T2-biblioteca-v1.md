**Epic:** EP-02 | Biblioteca & Skillmap  
**Priority:** 🔴 Critical  
**Estimate:** 12h  
**Status:** � 70% Completo (Explorer + Upload funcionando, falta filtros e skillmap action)  
**Labels:** `epic:biblioteca` `sprint:s1` `priority:critical` `type:feature`

---

### 📖 User Story
Como **professor**, quero **buscar** e **abrir** materiais com filtros pedagógicos e **adaptá-los** em 1 clique.

---

### ✅ Critérios de Aceite
- [x] Busca por texto (SearchBar com debounce 300ms implementado)
- [x] View toggle: Grid (Netflix-style) e Table (legacy) implementado
- [x] MaterialCard com preview e status implementado
- [x] Integração Firestore real-time implementada
- [ ] Filtros: **disciplina, série, competência** (UI + backend)
- [ ] Cartões com "**Usado por N**", tag **Eficácia (alta/média/baixa)**
- [ ] Botões funcionais: **Adaptar** (fork), **Skillmap** (dispara job)
- [ ] **TTFB ≤ 200ms**, busca ≤ 300ms p95

---

### 🔨 Sub-tarefas
- [x] UI list/grid toggle (já implementado)
- [x] SearchBar com debounce (já implementado)
- [x] MaterialCard básico (já implementado)
- [x] Loading states e skeletons (já implementado)
- [x] Empty states básicos (já implementado)
- [x] **MaterialsExplorer** implementado com drag & drop
- [x] **useUploadQueue** hook funcionando com Firebase Storage
- [x] **Drag & drop validation** (maxSize, fileRejections, isDragAccept/Reject)
- [x] **Upload progress** com progress tracking individual
- [ ] **Filtros avançados:** disciplina, série, competência (UI)
- [ ] **MaterialCard stats:** adicionar "Usado por N professores", tag de eficácia
- [ ] Endpoint `GET /api/library?query&filters...` (mock → real)
- [ ] Endpoint `POST /api/plans/fork` (criar rascunho adaptado)
- [ ] Botão "Adaptar" funcional (fork privado do material)
- [ ] Botão "Skillmap" integrado com job system (S1-T3 - DEPENDENTE)
- [ ] Empty states didáticos (3 exemplos clicáveis)
- [ ] Telemetria: `lib_view`, `lib_search`, `lib_filter`, `resource_open`, `resource_adapt`

---

### 📊 Telemetria
```typescript
events: [
  'lib_view',
  'lib_search', 
  'lib_filter',
  'resource_open',
  'resource_adapt'
]
metrics: ['search_latency', 'results_count', 'filter_usage']
```

---

### ♿ A11y Checklist
- [x] SearchBar acessível (ARIA labels)
- [ ] Filtros navegáveis por teclado
- [x] Cards com estrutura semântica
- [ ] Anúncio de resultados para screen readers

---

### ⚡ Performance Gates
- [ ] TTFB ≤ 200ms
- [ ] Search response ≤ 300ms (p95)
- [x] Virtualização preparada (Grid auto-fit)
- [ ] Bundle size ≤ 150KB para /biblioteca

---

### 🧪 Tests
- [ ] Unit: SearchBar debounce, filtros
- [ ] Integration: `/api/library` endpoint
- [ ] E2E: buscar → filtrar → abrir → adaptar material

---

### ✅ DoD
- [ ] Empty states com 3 exemplos utilizáveis
- [ ] Telemetria (view/search/filter/adapt) configurada
- [ ] A11y completa (axe-core sem erros)
- [ ] Perf gates validados
- [ ] PR reviewed e deployed
