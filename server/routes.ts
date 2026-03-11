import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCheckInSchema, insertIncidentReportSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    const { password: _, ...safeUser } = user;
    return res.json(safeUser);
  });

  app.post("/api/auth/register", async (req, res) => {
    const { username, password, name, department } = req.body;
    if (!username || !password || !name) {
      return res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
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
