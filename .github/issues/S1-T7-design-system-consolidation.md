**Epic:** EP-01 | UX Core & Navegação  
**Priority:** 🟢 Medium  
**Estimate:** 4h  
**Status:** 🟢 90% Completo (Design system consolidado, falta apenas catálogo e ADRs)  
**Labels:** `epic:ux-core` `sprint:s1` `priority:medium` `type:refactor`

---

### 📖 User Story
Como **dev**, quero consolidar o design system em um único lugar para facilitar manutenção e onboarding.

---

### 🎯 Estado Atual (Parcialmente Completo)
✅ **Já implementado:**
- Tokens em `src/styles/tokens.css` (cores, espaçamentos, fontes)
- Primitives em `src/components/primitives/` (Button, Input, Card, Dialog)
- Carousel integrado (Embla via shadcn/ui)
- Tema Netflix-style (dark mode)

🟡 **Pendente:**
- Centralizar exports em `@/components/design-system`
- Storybook ou catálogo interno
- Documentar decisões de design (ADRs)

---

### ✅ Critérios de Aceite
- [ ] Barrel export criado: `src/components/design-system/index.ts`
- [ ] Imports unificados (ex.: `import { Button, Card } from '@/components/design-system'`)
- [ ] Catálogo visual criado (Storybook **ou** página interna `/design-system`)
- [ ] ADRs documentados em `docs/design-system/`:
  - Por que Netflix-style?
  - Por que Embla Carousel?
  - Decisões de tokens (espacamento 4px, cores, fontes)

---

### 🔨 Sub-tarefas
- [x] Criar `src/design-system/index.ts` com barrel exports (IMPLEMENTADO)
- [x] Exports unificados para tokens, primitives e components (IMPLEMENTADO)
- [x] Estrutura organizada: design-system/tokens, primitives, components (IMPLEMENTADO)
- [ ] Escolher catálogo: Storybook (overhead) vs página interna (leve)
- [ ] Se Storybook: instalar, configurar, criar 5 stories (Button, Input, Card, Dialog, Carousel)
- [ ] Se página interna: criar `/design-system` com grid de componentes + código
- [ ] Documentar ADRs em `docs/design-system/`
- [ ] Atualizar imports em codebase para usar barrel export (alguns já usam @/design-system)
- [ ] Adicionar seção no README sobre design system

---

### 📊 Telemetria
```typescript
events: [
  'design_system_catalog_opened' // se página interna
]
```

---

### ♿ A11y Checklist
- [ ] Catálogo é navegável por teclado
- [ ] Exemplos mantêm a11y dos componentes originais

---

### ⚡ Performance Gates
- [ ] Catálogo não impacta build time (< 5s adicionais)
- [ ] Página interna (se escolhida) carrega em < 1s

---

### 🧪 Tests
- [ ] Unit: barrel exports funcionam corretamente
- [ ] E2E (se página interna): /design-system carrega componentes

---

### ✅ DoD
- [ ] Barrel export criado e testado
- [ ] Catálogo visual funcional (Storybook ou página)
- [ ] ADRs documentados
- [ ] README atualizado
- [ ] PR reviewed e deployed
