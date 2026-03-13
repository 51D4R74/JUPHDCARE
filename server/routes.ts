import type { Express, Request } from "express";
import type { Server } from "node:http";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import type { IStorage } from "./storage";
import { requireAuth, requireOwner, requireRole } from "./middleware";
import { insertCheckInSchema, insertMomentCheckInSchema, insertIncidentReportSchema, insertUserMissionSchema } from "@shared/schema";

/** Type-safe extraction of a single route param (Express 5 returns string | string[]). */
function param(req: Request, name: string): string {
  const v = req.params[name];
  return Array.isArray(v) ? v[0] : v;
}

// ---------------------------------------------------------------------------
// Rate limiters
// ---------------------------------------------------------------------------

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 20, // max 20 attempts per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Muitas tentativas. Tente novamente em alguns minutos." },
});

// ---------------------------------------------------------------------------
// Route registration
// ---------------------------------------------------------------------------

export async function registerRoutes(
  httpServer: Server,
  app: Express,
  storage: IStorage,
): Promise<Server> {
  // ── Auth (public, rate-limited) ──────────────────────────────────────

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    const { username, password } = req.body;
    if (!username || typeof username !== "string" || !password || typeof password !== "string") {
      return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }
    if (username.length > 254 || password.length > 128) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }
    const user = await storage.getUserByUsername(username);
    if (!user) {
      // Constant-time comparison even when user not found to prevent timing attacks
      await bcrypt.compare(password, "$2b$10$invalidhashtopreventtimingattac");
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    // Establish server session
    req.session.userId = user.id;
    req.session.userRole = user.role;
    const { password: _, ...safeUser } = user;
    return res.json(safeUser);
  });

  app.post("/api/auth/register", authLimiter, async (req, res) => {
    const { username, password, name, department } = req.body;
    if (!username || typeof username !== "string" || !password || typeof password !== "string" || !name || typeof name !== "string") {
      return res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
    }
    if (username.length > 254 || password.length > 128 || name.length > 100) {
      return res.status(400).json({ message: "Dados inválidos" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      return res.status(400).json({ message: "Email inválido" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "A senha deve ter pelo menos 8 caracteres" });
    }
    const existing = await storage.getUserByUsername(username);
    if (existing) {
      return res.status(409).json({ message: "Este email já está cadastrado" });
    }
    const user = await storage.createUser({
      username,
      password,
      name,
      role: "collaborator",
      department: department || null,
    });
    // Establish server session
    req.session.userId = user.id;
    req.session.userRole = user.role;
    const { password: _, ...safeUser } = user;
    return res.json(safeUser);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("juphd.sid");
      return res.json({ message: "Sessão encerrada" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Autenticação necessária" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Usuário não encontrado" });
    }
    const { password: _, ...safeUser } = user;
    return res.json(safeUser);
  });

  // ── User routes (authenticated + owner) ──────────────────────────────

  app.get("/api/users/:id", requireAuth, requireOwner("id"), async (req, res) => {
    const id = param(req, "id");
    const user = await storage.getUser(id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    const { password: _, ...safeUser } = user;
    return res.json(safeUser);
  });

  app.get("/api/users/:id/settings", requireAuth, requireOwner("id"), async (req, res) => {
    const id = param(req, "id");
    const settings = await storage.getUserSettings(id);
    if (!settings) return res.status(404).json({ message: "Configurações não encontradas" });
    return res.json(settings);
  });

  app.patch("/api/users/:id/settings", requireAuth, requireOwner("id"), async (req, res) => {
    const id = param(req, "id");
    const body = req.body as { settings?: unknown };
    if (typeof body.settings !== "string" || body.settings.length > 10_000) {
      return res.status(400).json({ message: "Dados inválidos" });
    }
    try {
      JSON.parse(body.settings);
    } catch (e: unknown) {
      console.warn("Invalid settings JSON:", e);
      return res.status(400).json({ message: "Configurações inválidas" });
    }
    const result = await storage.upsertUserSettings(id, body.settings);
    return res.json(result);
  });

  // ── Check-ins (authenticated + owner) ────────────────────────────────

  app.post("/api/checkins", requireAuth, async (req, res) => {
    try {
      const data = insertCheckInSchema.parse(req.body);
      // Enforce: userId in body must match session user
      if (data.userId !== req.userId) {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }
      const checkIn = await storage.createCheckIn(data);
      return res.json(checkIn);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Dados inválidos";
      return res.status(400).json({ message });
    }
  });

  app.get("/api/checkins/user/:userId", requireAuth, requireOwner(), async (req, res) => {
    const userId = param(req, "userId");
    const checkIns = await storage.getCheckInsByUserId(userId);
    return res.json(checkIns);
  });

  app.get("/api/checkins/user/:userId/today", requireAuth, requireOwner(), async (req, res) => {
    const userId = param(req, "userId");
    const checkIns = await storage.getCheckInsByUserIdAndDate(userId, new Date());
    return res.json(checkIns);
  });

  app.get("/api/checkins/user/:userId/history", requireAuth, requireOwner(), async (req, res) => {
    const userId = param(req, "userId");
    const daysParam = req.query.days;
    const days = typeof daysParam === "string" && daysParam !== "all"
      ? Number.parseInt(daysParam, 10) || null
      : null;
    const history = await storage.getHistoryByUserId(userId, days);
    return res.json(history);
  });

  app.get("/api/checkins", requireAuth, requireRole("rh"), async (_req, res) => {
    const checkIns = await storage.getAllCheckIns();
    return res.json(checkIns);
  });

  // ── Scores (authenticated + owner, except RH aggregate) ─────────────

  app.get("/api/scores/user/:userId/today", requireAuth, requireOwner(), async (req, res) => {
    const userId = param(req, "userId");
    const scores = await storage.getTodayScoresByUserId(userId);
    return res.json(scores);
  });

  app.get("/api/rh/aggregate", requireAuth, requireRole("rh"), async (_req, res) => {
    const aggregate = await storage.getRhAggregate();
    return res.json(aggregate);
  });

  // ── Missions (authenticated + owner) ─────────────────────────────────

  app.get("/api/missions/:userId/today", requireAuth, requireOwner(), async (req, res) => {
    const userId = param(req, "userId");
    const isoDate = new Date().toISOString().slice(0, 10);
    const missions = await storage.getDailyMissions(userId, isoDate);
    return res.json(missions);
  });

  app.post("/api/missions/:userId", requireAuth, requireOwner(), async (req, res) => {
    try {
      const userId = param(req, "userId");
      const body = insertUserMissionSchema.omit({ userId: true, date: true }).parse(req.body);
      const mission = await storage.completeMission({
        userId,
        date: new Date().toISOString().slice(0, 10),
        ...body,
      });
      return res.json(mission);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Dados inválidos";
      return res.status(400).json({ message });
    }
  });

  // ── Legacy moment check-ins (authenticated + owner) ──────────────────

  app.post("/api/moment-checkins", requireAuth, async (req, res) => {
    try {
      const data = insertMomentCheckInSchema.parse(req.body);
      if (data.userId !== req.userId) {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }
      const checkIn = await storage.createMomentCheckIn(data);
      return res.json(checkIn);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Dados inválidos";
      return res.status(400).json({ message });
    }
  });

  app.get("/api/moment-checkins/user/:userId", requireAuth, requireOwner(), async (req, res) => {
    const userId = param(req, "userId");
    const checkIns = await storage.getMomentCheckInsByUserId(userId);
    return res.json(checkIns);
  });

  app.get("/api/moment-checkins/user/:userId/today", requireAuth, requireOwner(), async (req, res) => {
    const userId = param(req, "userId");
    const checkIns = await storage.getMomentCheckInsByUserIdAndDate(userId, new Date());
    return res.json(checkIns);
  });

  app.get("/api/moment-checkins", requireAuth, requireRole("rh"), async (_req, res) => {
    const checkIns = await storage.getAllMomentCheckIns();
    return res.json(checkIns);
  });

  // ── Incidents (authenticated, creation owner-enforced, list RH-only) ─

  app.post("/api/incidents", requireAuth, async (req, res) => {
    try {
      const data = insertIncidentReportSchema.parse(req.body);
      // Allow anonymous (userId can be null) but if set, must match session
      if (data.userId && data.userId !== req.userId) {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }
      const report = await storage.createIncidentReport(data);
      return res.json(report);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Dados inválidos";
      return res.status(400).json({ message });
    }
  });

  app.get("/api/incidents", requireAuth, requireRole("rh"), async (_req, res) => {
    const reports = await storage.getAllIncidentReports();
    return res.json(reports);
  });

  return httpServer;
}
