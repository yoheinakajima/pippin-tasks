import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { db } from "@db";
import { tasks, apiTests } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ 
    server: httpServer,
    verifyClient: ({ req }) => {
      // Ignore Vite HMR WebSocket connections
      return !req.headers['sec-websocket-protocol']?.includes('vite-hmr');
    }
  });

  // WebSocket connection handling
  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      // Broadcast updates to all clients
      wss.clients.forEach((client) => {
        if (client !== ws) {
          client.send(message.toString());
        }
      });
    });
  });

  // Task Management Routes
  app.get("/api/tasks", async (_req, res) => {
    const allTasks = await db.query.tasks.findMany({
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
    });
    res.json(allTasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const newTask = await db.insert(tasks).values(req.body).returning();
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: "TASK_CREATED", task: newTask[0] }));
    });
    res.json(newTask[0]);
  });

  app.put("/api/tasks/:id", async (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = await db
      .update(tasks)
      .set(req.body)
      .where(eq(tasks.id, taskId))
      .returning();
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: "TASK_UPDATED", task: updatedTask[0] }));
    });
    res.json(updatedTask[0]);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const taskId = parseInt(req.params.id);
    await db.delete(tasks).where(eq(tasks.id, taskId));
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: "TASK_DELETED", taskId }));
    });
    res.json({ success: true });
  });

  // API Test Routes
  app.get("/api/tests", async (_req, res) => {
    const allTests = await db.query.apiTests.findMany({
      orderBy: (apiTests, { desc }) => [desc(apiTests.createdAt)],
    });
    res.json(allTests);
  });

  app.post("/api/tests", async (req, res) => {
    const newTest = await db.insert(apiTests).values(req.body).returning();
    res.json(newTest[0]);
  });

  return httpServer;
}