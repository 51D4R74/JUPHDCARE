**Epic:** EP-04 | Infraestrutura & Performance  
**Priority:** 🔴 Critical  
**Estimate:** 6h  
**Labels:** `epic:infra` `sprint:s1` `priority:critical` `type:testing`

---

### 📖 User Story
Como **QA**, quero configurar Playwright e criar 3 testes E2E críticos para validar fluxos principais.

---

### 🎯 Fluxos E2E v1 (3 testes prioritários)
1. **Login → Dashboard** (auth flow completo)
2. **Biblioteca → Buscar → Adapt** (UX core)
3. **Skillmap Job** (202 → polling → 200)

---

### ✅ Critérios de Aceite
- [ ] Playwright instalado e configurado (`playwright.config.ts`)
- [ ] 3 testes E2E funcionando:
  - `auth.spec.ts`: Login → valida dashboard visível
  - `library.spec.ts`: Busca "reading" → clica Adapt → valida modal
  - `jobs.spec.ts`: Gera skillmap → aguarda job → valida sucesso
- [ ] Roda em CI (GitHub Actions workflow)
- [ ] Docs em `docs/e2e-tests.md` (como adicionar novos testes)

---

### 🔨 Sub-tarefas
- [ ] Instalar `@playwright/test` e dependências
- [ ] Configurar `playwright.config.ts` (baseURL, timeout, browsers)
- [ ] Criar diretório `tests/e2e/`
- [ ] Implementar `auth.spec.ts`:
  - Mock de Firebase Auth (ou usar test account)
  - Login → aguardar redirect → validar presença de actionable blocks
- [ ] Implementar `library.spec.ts`:
  - Navegar para /biblioteca
  - Buscar "reading" → validar resultados
  - Clicar "Adapt" em card → validar modal aberto
- [ ] Implementar `jobs.spec.ts`:
  - POST /api/skillmap → 202
  - Polling de jobId → aguardar 200
  - Validar jobResult.skillMap existe
- [ ] Configurar GitHub Actions (`.github/workflows/e2e.yml`)
- [ ] Adicionar `npm run test:e2e` no package.json
- [ ] Docs de E2E (`docs/e2e-tests.md`)

---

### 📊 Telemetria
```typescript
events: [
  'e2e_test_run', // {tests_passed: number, tests_failed: number, duration_ms: number}
]
```

---

### ♿ A11y Checklist
- [ ] Usar locators semânticos (role, label) em vez de classes CSS

---

### ⚡ Performance Gates
- [ ] Suite de E2E roda em < 2 minutos (CI)
- [ ] Cada teste individual < 30s

---

### 🧪 Tests
- [ ] Os próprios testes são a validação 😄
- [ ] Garantir que falham corretamente (quebrar intencionalmente para validar)

---

### ✅ DoD
- [ ] 3 testes E2E passando
- [ ] CI configurado e verde
- [ ] Docs criados
- [ ] `npm run test:e2e` funcional
- [ ] PR reviewed e deployed
