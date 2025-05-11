import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
});

export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  avatar: text("avatar").notNull(),
  active: boolean("active").notNull().default(true),
  currentLat: doublePrecision("current_lat"),
  currentLng: doublePrecision("current_lng"),
  totalRides: integer("total_rides").notNull().default(0),
  rating: doublePrecision("rating").notNull().default(4.5),
});

export const driverAchievements = pgTable("driver_achievements", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").notNull(),
  type: text("type").notNull(), // 'rides', 'rating', 'eco'
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

export const bookings = pgTable("bookings", {
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
  carbonSaved: doublePrecision("carbon_saved").notNull(), // in kg CO2
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  phone: true,
}).extend({
  phone: z.string().min(10).max(10),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  pickupLat: true,
  pickupLng: true,
  dropLat: true,
  dropLng: true,
  fare: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Driver = typeof drivers.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type DriverAchievement = typeof driverAchievements.$inferSelect;