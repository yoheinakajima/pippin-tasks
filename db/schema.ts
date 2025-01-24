import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  assignedTo: text("assigned_to"),
  priority: text("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const apiTests = pgTable("api_tests", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  requestBody: text("request_body"),
  responseStatus: integer("response_status"),
  responseBody: text("response_body"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const taskRelations = relations(tasks, ({ many }) => ({
  apiTests: many(apiTests),
}));

export const insertTaskSchema = createInsertSchema(tasks);
export const selectTaskSchema = createSelectSchema(tasks);
export const insertApiTestSchema = createInsertSchema(apiTests);
export const selectApiTestSchema = createSelectSchema(apiTests);

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type ApiTest = typeof apiTests.$inferSelect;
export type NewApiTest = typeof apiTests.$inferInsert;
