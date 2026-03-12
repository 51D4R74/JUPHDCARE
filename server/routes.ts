import type { Express } from "express";
import type { Server } from "node:http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertCheckInSchema, insertMomentCheckInSchema, insertIncidentReportSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // DEBT: add rate limiting on auth endpoints [security]
  // DEBT: replace localStorage auth with JWT/session middleware [security]
  app.post("/api/auth/login", async (req, res) => {
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
    const { password: _, ...safeUser } = user;
    return res.json(safeUser);
  });

  app.post("/api/auth/register", async (req, res) => {
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
    // Password hashed inside storage.createUser
    const user = await storage.createUser({
      username,
      password,
      name,
      role: "collaborator",
      department: department || null,
    });
    const { password: _, ...safeUser } = user;
    return res.json(safeUser);
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    const { password: _, ...safeUser } = user;
    return res.json(safeUser);
  });

  app.post("/api/checkins", async (req, res) => {
    try {
      const data = insertCheckInSchema.parse(req.body);
      const checkIn = await storage.createCheckIn(data);
      return res.json(checkIn);
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }
  });

  app.get("/api/checkins/user/:userId", async (req, res) => {
    const checkIns = await storage.getCheckInsByUserId(req.params.userId);
    return res.json(checkIns);
  });

  app.get("/api/checkins", async (_req, res) => {
    const checkIns = await storage.getAllCheckIns();
    return res.json(checkIns);
  });

  // Moment check-ins (3-moment EMA)
  app.post("/api/moment-checkins", async (req, res) => {
    try {
      const data = insertMomentCheckInSchema.parse(req.body);
      const checkIn = await storage.createMomentCheckIn(data);
      return res.json(checkIn);
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }
  });

  app.get("/api/moment-checkins/user/:userId", async (req, res) => {
    const checkIns = await storage.getMomentCheckInsByUserId(req.params.userId);
    return res.json(checkIns);
  });

  app.get("/api/moment-checkins/user/:userId/today", async (req, res) => {
    const checkIns = await storage.getMomentCheckInsByUserIdAndDate(req.params.userId, new Date());
    return res.json(checkIns);
  });

  app.get("/api/moment-checkins", async (_req, res) => {
    const checkIns = await storage.getAllMomentCheckIns();
    return res.json(checkIns);
  });

  app.post("/api/incidents", async (req, res) => {
    try {
      const data = insertIncidentReportSchema.parse(req.body);
      const report = await storage.createIncidentReport(data);
      return res.json(report);
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }
  });

  app.get("/api/incidents", async (_req, res) => {
    const reports = await storage.getAllIncidentReports();
    return res.json(reports);
  });

  return httpServer;
}
