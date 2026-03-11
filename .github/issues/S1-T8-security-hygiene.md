**Epic:** EP-04 | Infraestrutura & Performance  
**Priority:** 🔴 Critical  
**Estimate:** 2h  
**Labels:** `epic:infra` `sprint:s1` `priority:critical` `type:security`

---

### 📖 User Story
Como **eng de segurança**, quero remover endpoints de debug e proteger APIs públicas contra abuso.

---

### 🎯 Ações de Higiene
1. **Remover `/debug` route** (ou proteger com middleware de DEV_MODE)
2. **Rate-limit em APIs públicas** (`/api/materials/adapt`, `/api/skillmap`)
3. **Validar auth em todos os endpoints** (exceto `/api/health`)

---

### ✅ Critérios de Aceite
- [ ] Rota `/debug` removida **ou** protegida (só disponível em NODE_ENV=development)
- [ ] Rate-limit implementado (ex.: 100 req/min por IP em `/api/materials/adapt`)
- [ ] Todos os endpoints `/api/**` (exceto health) validam `orgId` no token
- [ ] Logs de rate-limit em prod (Vercel Analytics ou custom)

---

### 🔨 Sub-tarefas
- [ ] Auditar rotas: listar todos os endpoints `/api/**` e `/debug/**`
- [ ] Remover ou proteger `/debug` (middleware `if (NODE_ENV !== 'development') throw 404`)
- [ ] Instalar `@vercel/rate-limit` ou similar
- [ ] Aplicar rate-limit em:
  - `/api/materials/adapt` (100 req/min)
  - `/api/skillmap` (20 req/min, processamento pesado)
- [ ] Criar middleware `validateOrgId` para checar custom claims
- [ ] Adicionar telemetria: `rate_limit_hit`, `unauthorized_api_call`
- [ ] Testar em staging: validar 429 Too Many Requests
- [ ] Docs em `docs/security.md` (como proteger novos endpoints)

---

### 📊 Telemetria
```typescript
events: [
  'rate_limit_hit', // {endpoint: string, ip_hash: string}
  'unauthorized_api_call', // {endpoint: string, reason: string}
]
```

---

### ♿ A11y Checklist
- [ ] N/A (segurança backend)

---

### ⚡ Performance Gates
- [ ] Rate-limit não adiciona latência perceptível (< 5ms overhead)
- [ ] 429 responses são rápidas (< 50ms)

---

### 🧪 Tests
- [ ] Unit: middleware `validateOrgId` rejeita tokens inválidos
- [ ] E2E: validar 429 após exceder rate-limit

---

### ✅ DoD
- [ ] `/debug` removido/protegido
- [ ] Rate-limit ativo em 2 endpoints críticos
- [ ] Telemetria configurada
- [ ] Docs de segurança criados
- [ ] PR reviewed e deployed
