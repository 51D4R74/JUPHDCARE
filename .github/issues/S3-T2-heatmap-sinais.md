**Epic:** EP-04 | Turmas & Intervenção  
**Priority:** 🔴 Critical  
**Estimate:** 14h  
**Labels:** `epic:turmas` `sprint:s3` `priority:critical` `type:feature`

---

### 📖 User Story
Como **professor**, quero ver **quem precisa de ajuda** por turma com **sinais simples** (entrega/nota/engajamento) e agir em ≤30s.

---

### ✅ Critérios de Aceite
- [ ] Tabela heatmap (alunos × atividades/tarefas)
- [ ] Cores 🟢🟡🔴 por limiares:
  - 🟢 **Verde**: entregou + nota ≥ 7
  - 🟡 **Amarelo**: entregou + nota < 7 OU atrasado ≤ 2 dias
  - 🔴 **Vermelho**: atrasado > 2 dias OU não entregou
- [ ] Hover/tooltip mostra "**por que?**" (ex.: 0/3 entregas; média < 60%)
- [ ] Click abre detalhes do aluno (histórico de entregas)
- [ ] CTA **"Gerar Reforço"** (integração S3-T3)
- [ ] Renderiza em **< 1s** para 30 alunos × 10 tarefas
- [ ] Filtro por atividade, ordenação por risco (mais vermelhos primeiro)
- [ ] Responsivo (scroll horizontal em mobile)

---

### 🔨 Sub-tarefas
- [ ] Modelo de agregação: calcular status por aluno/atividade
- [ ] Lógica de cálculo de cores (verde/amarelo/vermelho)
- [ ] UI Heatmap component (D3.js, Recharts, ou custom Canvas)
- [ ] Tooltip "Por que?" com critérios detalhados
- [ ] Modal de detalhes do aluno (histórico de entregas)
- [ ] Filtro por atividade específica
- [ ] Ordenação por risco (contagem de células vermelhas)
- [ ] Seleção de múltiplos alunos (checkbox para ação em lote)
- [ ] Responsivo: scroll horizontal, virtualização se > 50 alunos
- [ ] Endpoint `GET /api/classes/:id/heatmap`
- [ ] Telemetria: `heatmap_view`, `heatmap_interaction`, `heatmap_filter`, `heatmap_cell_click`

---

### 📊 Telemetria
```typescript
events: [
  'heatmap_view', // {class_id: string, students_count: number, activities_count: number}
  'heatmap_interaction', // {type: 'hover' | 'click', student_id: string, activity_id: string}
  'heatmap_filter', // {filter_type: string}
  'heatmap_cell_click' // {student_id: string, activity_id: string, status: 'green' | 'yellow' | 'red'}
]
metrics: ['render_time', 'students_at_risk', 'red_cells_count']
```

---

### ♿ A11y Checklist
- [ ] Navegação por teclado (Tab, Enter para abrir detalhes)
- [ ] ARIA labels nas células (ex: "João, Atividade 1: Vermelho - Não entregou")
- [ ] Anúncio de cores para screen readers (não apenas visual)
- [ ] Contraste de cores validado (verde/amarelo/vermelho com suficiente contraste)
- [ ] Filtros e ordenação acessíveis

---

### ⚡ Performance Gates
- [ ] Render **< 1s** (30 alunos × 10 tarefas)
- [ ] Scroll smooth (60fps)
- [ ] Virtualização para > 50 alunos (react-window ou similar)
- [ ] Tooltip aparece em < 50ms

---

### 🧪 Tests
- [ ] Unit: lógica de cálculo de cores (verde/amarelo/vermelho)
- [ ] Integration: endpoint `/api/classes/:id/heatmap`
- [ ] E2E: abrir /turmas → ver heatmap → hover célula → validar tooltip

---

### ✅ DoD
- [ ] Filtro por atividade funcional
- [ ] Ordenação por risco implementada
- [ ] A11y (teclado, ARIA, cores) validada
- [ ] Performance gates validados (< 1s render)
- [ ] Tooltip "Por que?" mostra critérios corretos
- [ ] Integração com S3-T3 (botão "Gerar Reforço")
- [ ] Telemetria configurada
- [ ] PR reviewed, merged, deployed
