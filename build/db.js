var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bookings: () => bookings,
  driverAchievements: () => driverAchievements,
  drivers: () => drivers,
  insertBookingSchema: () => insertBookingSchema,
  insertUserSchema: () => insertUserSchema,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull()
});
var drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  avatar: text("avatar").notNull(),
  active: boolean("active").notNull().default(true),
  currentLat: doublePrecision("current_lat"),
  currentLng: doublePrecision("current_lng"),
  totalRides: integer("total_rides").notNull().default(0),
  rating: doublePrecision("rating").notNull().default(4.5)
});
var driverAchievements = pgTable("driver_achievements", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").notNull(),
  type: text("type").notNull(),
  // 'rides', 'rating', 'eco'
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow()
});
var bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  driverId: integer("driver_id"),
  pickupLat: doublePrecision("pickup_lat").notNull(),
  pickupLng: doublePrecision("pickup_lng").notNull(),
  dropLat: doublePrecision("drop_lat").notNull(),
  dropLng: doublePrecision("drop_lng").notNull(),
  status: text("status").notNull().default("pending"),
  fare: integer("fare").notNull(),
  distance: doublePrecision("distance").notNull(),
  carbonSaved: doublePrecision("carbon_saved").notNull(),
  // in kg CO2
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  phone: true
}).extend({
  phone: z.string().min(10).max(10)
});
var insertBookingSchema = createInsertSchema(bookings).pick({
  pickupLat: true,
  pickupLng: true,
  dropLat: true,
  dropLng: true,
  fare: true
});

// server/db.ts
import dotenv from "dotenv";
dotenv.config();
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });
export {
  db,
  pool
};
