---
description: "Use when working on React UI, pages, components, Tailwind styling, or UI structure."
name: "Design System"
applyTo: "client/src/components/**,client/src/pages/**"
---
# Design System

## Component library

- UI primitives: `client/src/components/ui/` — shadcn/ui (Radix + Tailwind).
- These are the canonical building blocks. Check the directory before creating custom components.
- Add new primitives via shadcn CLI (`npx shadcn@latest add <component>`) or following shadcn patterns.

## Token usage

```tsx
// ✅ Correct — semantic Tailwind tokens
<div className="bg-card text-foreground border-border">
  <span className="text-muted-foreground">Label</span>
  <span className="text-primary">Value</span>
</div>

// ❌ Wrong — hardcoded colors on content surfaces
<div className="bg-purple-600 text-blue-500 border-gray-200">
  <span className="text-gray-400">Label</span>
</div>
```

Exception: decorative gradients (pills, badges) may use Tailwind palette with opacity modifiers (`from-blue-500/20`), as in the dashboard pills pattern.

## Component patterns

```tsx
// ✅ Correct — compose from shadcn/ui primitives
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ❌ Wrong — rebuild card from scratch when shadcn Card exists
<div className="rounded-lg border p-4 shadow">...</div>
```

## Page structure

Pages in `client/src/pages/` are full route components:

```tsx
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

export default function SomePage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: [...], queryFn: ... });
  // render with shadcn/ui components
}
```

## Animation

Framer Motion is available and used in pages. Use for transitions and micro-interactions. Don't over-animate data-heavy screens.

## Icons

- Primary: `lucide-react` (already bundled with shadcn/ui).
- Extended: `react-icons` for icons not in Lucide.
- Import individual icons, not entire sets.

## Rules

- Check `client/src/components/ui/` before creating a new primitive.
- Prefer semantic tokens (`bg-card`, `text-foreground`) over hardcoded palette.
- Compose from shadcn/ui primitives — don't rebuild what exists.
- Extract reusable pieces into `components/` when shared by 2+ pages.

## Anti-patterns

- Rebuilding a shadcn/ui primitive (Card, Button, Dialog) from raw HTML/CSS
- Hardcoded colors on content surfaces where semantic tokens work
- Creating a one-off component file for something used in a single place
- Importing an entire icon library when only a few icons are needed
