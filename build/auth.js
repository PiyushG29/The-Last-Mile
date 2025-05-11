var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

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

// server/storage.ts
import session from "express-session";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
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

// server/storage.ts
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
var PostgresSessionStore = connectPg(session);
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // For now, keep using mock drivers data
  async getDrivers() {
    return MOCK_DRIVERS;
  }
  async getActiveDrivers() {
    return MOCK_DRIVERS.filter((d) => d.active);
  }
  async getDriver(id) {
    return MOCK_DRIVERS.find((d) => d.id === id);
  }
  async createBooking(booking) {
    const [newBooking] = await db.insert(bookings).values({
      ...booking,
      status: "pending",
      createdAt: /* @__PURE__ */ new Date()
    }).returning();
    return newBooking;
  }
  async getUserBookings(userId) {
    return db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(bookings.createdAt);
  }
  async updateBookingStatus(id, status) {
    await db.update(bookings).set({ status }).where(eq(bookings.id, id));
  }
};
var MOCK_DRIVERS = [
  {
    id: 1,
    name: "Ravi Kumar",
    phone: "9876543210",
    avatar: "https://images.unsplash.com/photo-1541747277704-ef7fb8e1a31c",
    active: true,
    currentLat: 28.6139,
    currentLng: 77.209,
    totalRides: 120,
    rating: 4.5
  },
  {
    id: 2,
    name: "Amit Singh",
    phone: "9876543211",
    avatar: "https://images.unsplash.com/photo-1496423275314-469c5608e89a",
    active: true,
    currentLat: 28.6229,
    currentLng: 77.21,
    totalRides: 98,
    rating: 4.7
  },
  {
    id: 3,
    name: "Suresh Patel",
    phone: "9876543212",
    avatar: "https://images.unsplash.com/photo-1576669801820-a9ab287ac2d1",
    active: true,
    currentLat: 28.6119,
    currentLng: 77.207,
    totalRides: 150,
    rating: 4.8
  }
];
var storage = new DatabaseStorage();

// server/auth.ts
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore
  };
  app.set("trust proxy", 1);
  app.use(session2(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !await comparePasswords(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }
    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password)
    });
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
export {
  setupAuth
};
