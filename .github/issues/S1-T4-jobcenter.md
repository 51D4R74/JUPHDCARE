**Epic:** EP-02 | Biblioteca & Skillmap  
**Priority:** 🟡 High  
**Estimate:** 4h  
**Dependencies:** S1-T3  
**Labels:** `epic:biblioteca` `sprint:s1` `priority:high` `type:feature`

---

### 📖 User Story
Como usuário, quero ver **meus jobs** recentes (skillmap, importações) com status e **retry**.

---

### ✅ Critérios de Aceite
- [ ] Ícone na topbar abre painel lateral (drawer)
- [ ] Badge de contagem de jobs ativos/pendentes
- [ ] Mostra status atualizado (badge colorido por estado)
- [ ] Ações: **Retry**, **Dismiss**, **Ver detalhes**
- [ ] **Não bloqueia UI**: sempre não-intrusivo
- [ ] Paginação para > 20 jobs
- [ ] Atalho ⌘J para abrir (opcional)

---

### 🔨 Sub-tarefas
- [ ] Endpoint `GET /api/jobs?userId` (lista jobs do usuário)
- [ ] UI Drawer component (slide-in from right)
- [ ] Ícone na topbar com badge de contagem
- [ ] JobList component (paginado, virtualizado)
- [ ] Botões Retry e Dismiss funcionais
- [ ] Polling automático quando painel aberto (stop quando fecha)
- [ ] Atalho ⌘J (opcional)
- [ ] Telemetria: `jobcenter_open`, `job_retry`, `job_dismiss`

---

### 📊 Telemetria
```typescript
events: ['jobcenter_open', 'job_retry', 'job_dismiss', 'job_details_view']
metrics: ['jobs_per_user', 'retry_rate', 'dismiss_rate']
```

---

### ♿ A11y Checklist
- [ ] Foco gerenciado (trap focus no drawer)
- [ ] Fecha com Esc
- [ ] ARIA labels no drawer
- [ ] Navegação por teclado completa

---

### 🧪 Tests
- [ ] Unit: lógica de polling
- [ ] Integration: endpoint GET /api/jobs
- [ ] E2E: abrir painel → retry job → verificar novo job criado

---

### ✅ DoD
- [ ] A11y (teclado, ARIA) validado
- [ ] Não trava navegação (renderiza em portal)
- [ ] Logs e métricas configurados
- [ ] PR reviewed e deployed
