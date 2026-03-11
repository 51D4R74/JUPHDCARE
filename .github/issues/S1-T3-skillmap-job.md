**Epic:** EP-02 | Biblioteca & Skillmap  
**Priority:** 🔴 Critical  
**Estimate:** 6h  
**Dependencies:** S1-T2  
**Status:** 🟡 50% Completo (Infraestrutura pronta: types, repo, SHA-256, rate-limiter)  
**Labels:** `epic:biblioteca` `sprint:s1` `priority:critical` `type:feature`

---

### 📖 User Story
Como **professor**, quero clicar em **Skillmap** num material e acompanhar o **status** até **Revisar**.

---

### ✅ Critérios de Aceite
- [ ] `POST /api/skillmaps/generate` retorna **202 + jobId** em < 100ms
- [ ] `GET /api/jobs/:id` retorna status + progresso atual
- [ ] Estados funcionais: `queued/running/completed/error`
- [ ] Toast mostra progresso em tempo real (polling 1.5s)
- [ ] Ao **completed**, CTA **Revisar** aparece (redireciona para /skillmaps/:id)
- [ ] Idempotência via inputHash (SHA-256 já implementado)
- [ ] Retry automático em caso de erro (max 3 tentativas)

---

### 🔨 Sub-tarefas
- [ ] **API Route:** `POST /api/skillmaps/generate` (enfileira job, retorna 202)
- [ ] **API Route:** `GET /api/jobs/:id` (consulta status)
- [x] **Modelo:** SkillmapJob (já criado em `src/types/jobs.ts`)
- [x] **Repository:** jobs (já criado em `src/lib/repositories/jobs.repo.ts`)
  - [x] createJob()
  - [x] getJob()
  - [x] updateJob()
  - [x] takeNextQueuedJobs()
- [x] **SHA-256:** adapter universal (`src/lib/crypto/sha256.ts`)
  - [x] Client-side (WebCrypto API)
  - [x] Server-side (Node crypto)
- [x] **Rate Limiter:** implementado (`src/lib/ai/rate-limiter.ts`)
  - [x] geminiRateLimiter com pLimit
  - [x] Pool por organização (já existe em gemini-rate-limiter.ts)
- [ ] **Worker mock:** simula processamento (5–15s, depois integra IA real)
- [ ] **Cliente polling:** hook `useJobStatus(jobId)` com interval 1.5s
- [ ] **Integração UI:** botão "Skillmap" no MaterialCard dispara job
- [ ] **Toast JobCenter:** progress bar com estado atual
- [ ] **Telemetria:** `skillmap_job_start`, `skillmap_job_status`, `skillmap_job_done`
- [ ] **E2E:** clicar Skillmap → aguardar completed → clicar Revisar

---

### 📊 Telemetria
```typescript
events: [
  'skillmap_job_start',    // ao clicar no botão
  'skillmap_job_status',   // a cada poll (sample 10%)
  'skillmap_job_done',     // quando completed
  'skillmap_job_error'     // quando error
]
metrics: ['job_duration', 'job_retry_count', 'cache_hit_rate']
```

---

### 🔒 Segurança
- [ ] **Rate limit:** 10 jobs/min por usuário (usar rate-limiter existente)
- [ ] **Validação orgId:** não pode criar job para outra organização
- [ ] **inputHash:** evita duplicação (check antes de criar)
- [ ] **Logs sanitizados:** sem PII, com traceId

---

### ⚡ Performance Gates
- [ ] Response 202 em < 100ms
- [ ] Polling não trava UI (debounce 1.5s, abort anterior)
- [ ] Worker processa jobs em batch (10 por vez)
- [ ] Cache SHA-256 hit rate > 70%

---

### 🧪 Tests
- [x] Unit: createJob, getJob, updateJob (repository)
- [ ] Integration: endpoints 202 e GET
- [ ] E2E: fluxo completo com polling até completed

---

### ✅ DoD
- [ ] Resposta 202 imediata
- [ ] Progress UI funcionando (toast + percentage)
- [ ] Reexecução em caso de erro (até 3x)
- [ ] Logs com traceId, sem PII
- [ ] PR reviewed, merged, deployed
