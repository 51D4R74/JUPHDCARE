**Epic:** EP-01 | UX Core & Navegação  
**Priority:** 🟡 High  
**Estimate:** 8h  
**Labels:** `epic:ux-core` `sprint:s1` `priority:high` `type:feature`

---

### 📖 User Story
Como **usuário avançado**, quero abrir **⌘K** e executar ações sem sair do teclado.

---

### 🎬 Ações v1 (10 comandos prioritários)
1. **Criar plano** → abre wizard /planejar
2. **Importar PDF** → abre modal de upload
3. **Buscar recurso...** → foco na SearchBar de /biblioteca
4. **Atribuir para [Turma]** → abre modal de atribuição
5. **Gerar reforço** → abre wizard de intervenção
6. **Abrir Biblioteca** → navega para /biblioteca
7. **Abrir Turmas** → navega para /turmas
8. **Abrir Planejar** → navega para /planejar
9. **Abrir Ajuda** → abre docs/tour
10. **Ver Atalhos** → modal com lista de hotkeys

---

### ✅ Critérios de Aceite
- [ ] Abre com **⌘/Ctrl+K**, fecha com **Esc**
- [ ] Navega por **setas**, executa com **Enter**
- [ ] **Debounce fast** (< 100ms no input)
- [ ] **Context-aware** (ex.: dentro de /turmas → sugere "Gerar reforço")
- [ ] **Fuzzy search** nos comandos
- [ ] 10 ações v1 funcionais

---

### 🔨 Sub-tarefas
- [ ] Instalar `cmdk` (Paciello Group command palette)
- [ ] Componente CommandPalette com hotkey global listener
- [ ] Implementar as 10 ações iniciais (handlers)
- [ ] Context detection (useLocation + useAuth role)
- [ ] Fuzzy search para comandos (fuse.js ou builtin)
- [ ] Tema dark (integração com design system)
- [ ] Telemetria: `cmdk_open`, `cmdk_action_execute`, `cmdk_dismiss`
- [ ] E2E: ⌘K → digitar comando → executar ação

---

### 📊 Telemetria
```typescript
events: [
  'cmdk_open',
  'cmdk_action_execute', // {action: string, source: 'keyboard' | 'click'}
  'cmdk_dismiss'
]
metrics: ['actions_per_session', 'most_used_commands', 'keyboard_vs_mouse']
```

---

### ♿ A11y Checklist
- [ ] Foco gerenciado (trap focus no modal)
- [ ] ARIA combobox role
- [ ] Screen reader anuncia resultados
- [ ] Navegação por teclado 100% funcional

---

### ⚡ Performance Gates
- [ ] Abertura instantânea (< 100ms)
- [ ] Fuzzy search em < 50ms (memoização)
- [ ] Sem jank no scroll de resultados (virtualização se > 50)

---

### 🧪 Tests
- [ ] Unit: fuzzy search, context detection
- [ ] E2E: ⌘K → comando → executar → validar resultado

---

### ✅ DoD
- [ ] A11y e foco gerenciado OK
- [ ] Telemetria configurada
- [ ] Abertura instantânea validada
- [ ] 10 ações funcionais
- [ ] PR reviewed e deployed
