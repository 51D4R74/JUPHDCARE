import { type User, type InsertUser, type CheckIn, type InsertCheckIn, type IncidentReport, type InsertIncidentReport } from "@shared/schema";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn>;
  getCheckInsByUserId(userId: string): Promise<CheckIn[]>;
  getAllCheckIns(): Promise<CheckIn[]>;
  createIncidentReport(report: InsertIncidentReport): Promise<IncidentReport>;
  getAllIncidentReports(): Promise<IncidentReport[]>;
}

export class MemStorage implements IStorage {
  private readonly users: Map<string, User>;
  private readonly checkIns: Map<string, CheckIn>;
  private readonly incidentReports: Map<string, IncidentReport>;

  constructor() {
    this.users = new Map();
    this.checkIns = new Map();
    this.incidentReports = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed passwords are hashed at startup. Plain-text only in this comment for dev reference: "Senha@123"
    const seedHash = bcrypt.hashSync("Senha@123", 10);

    const demoUser: User = {
      id: "user-1",
      username: "maria@juphd.com",
      password: seedHash,
      name: "Maria Silva",
      role: "collaborator",
      department: "Marketing",
    };
    this.users.set(demoUser.id, demoUser);

    const rhUser: User = {
      id: "user-rh",
      username: "rh@juphd.com",
      password: seedHash,
      name: "Carlos Mendes",
      role: "rh",
      department: "Recursos Humanos",
    };
    this.users.set(rhUser.id, rhUser);

    const departments = ["Vendas", "TI", "Marketing", "Financeiro", "Operações"];
    const humors = ["Bem", "Ansioso", "Tenso", "Calmo", "Motivado", "Triste", "Irritado", "Confiante"];
    const energies = ["Disposto", "Cansado", "Exausto", "Empolgado"];
    const minds = ["Focado", "Estressado", "Distraído", "Criativo", "Alta Produção", "Baixa Produção"];
    const sleeps = ["Sono restaurador", "Cansaço ao acordar", "Dificuldade para dormir", "Sono tranquilo", "Pesadelos", "Adormeci rápido"];
    const tags = ["Trabalho", "Família", "Saúde", "Relacionamentos"];

    for (let i = 0; i < 50; i++) {
      const dept = departments[i % departments.length];
      const seedUser: User = {
        id: `seed-user-${i}`,
        username: `user${i}@juphd.com`,
        password: seedHash,
        name: `Colaborador ${i + 1}`,
        role: "collaborator",
        department: dept,
      };
      this.users.set(seedUser.id, seedUser);

      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      const checkIn: CheckIn = {
        id: `checkin-${i}`,
        userId: seedUser.id,
        humor: humors[Math.floor(Math.random() * humors.length)],
        energy: energies[Math.floor(Math.random() * energies.length)],
        mind: minds[Math.floor(Math.random() * minds.length)],
        sleep: sleeps[Math.floor(Math.random() * sleeps.length)],
        contextTags: [tags[Math.floor(Math.random() * tags.length)]],
        notes: null,
        createdAt: date,
      };
      this.checkIns.set(checkIn.id, checkIn);
    }

    const userCheckIns = [
      { humor: "Bem", energy: "Disposto", mind: "Focado", sleep: "Sono restaurador", daysAgo: 1 },
      { humor: "Ansioso", energy: "Cansado", mind: "Estressado", sleep: "Dificuldade para dormir", daysAgo: 3 },
      { humor: "Calmo", energy: "Empolgado", mind: "Criativo", sleep: "Sono tranquilo", daysAgo: 5 },
    ];

    userCheckIns.forEach((c, i) => {
      const date = new Date();
      date.setDate(date.getDate() - c.daysAgo);
      const checkIn: CheckIn = {
        id: `user-checkin-${i}`,
        userId: "user-1",
        humor: c.humor,
        energy: c.energy,
        mind: c.mind,
        sleep: c.sleep,
        contextTags: ["Trabalho"],
        notes: null,
        createdAt: date,
      };
      this.checkIns.set(checkIn.id, checkIn);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = { ...insertUser, id, password: hashedPassword, role: insertUser.role || "collaborator", department: insertUser.department || null };
    this.users.set(id, user);
    return user;
  }

  async createCheckIn(insertCheckIn: InsertCheckIn): Promise<CheckIn> {
    const id = randomUUID();
    const checkIn: CheckIn = { ...insertCheckIn, id, createdAt: new Date(), contextTags: insertCheckIn.contextTags || null, notes: insertCheckIn.notes || null };
    this.checkIns.set(id, checkIn);
    return checkIn;
  }

  async getCheckInsByUserId(userId: string): Promise<CheckIn[]> {
    return Array.from(this.checkIns.values())
      .filter((c) => c.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getAllCheckIns(): Promise<CheckIn[]> {
    return Array.from(this.checkIns.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createIncidentReport(insertReport: InsertIncidentReport): Promise<IncidentReport> {
    const id = randomUUID();
    const report: IncidentReport = {
      ...insertReport,
      id,
      createdAt: new Date(),
      userId: insertReport.userId || null,
      description: insertReport.description || null,
      anonymous: insertReport.anonymous ?? true,
    };
    this.incidentReports.set(id, report);
    return report;
  }

  async getAllIncidentReports(): Promise<IncidentReport[]> {
    return Array.from(this.incidentReports.values());
  }
}

export const storage = new MemStorage();
