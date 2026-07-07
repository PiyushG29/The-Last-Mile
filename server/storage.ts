import { InsertUser, User, Driver, Booking, users, bookings } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import createMemoryStore from "memorystore";

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getDrivers(): Promise<Driver[]>;
  getActiveDrivers(): Promise<Driver[]>;
  getDriver(id: number): Promise<Driver | undefined>;

  createBooking(booking: Omit<Booking, "id" | "status" | "createdAt">): Promise<Booking>;
  getUserBookings(userId: number): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<void>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // For now, keep using mock drivers data
  async getDrivers(): Promise<Driver[]> {
    return MOCK_DRIVERS;
  }

  async getActiveDrivers(): Promise<Driver[]> {
    return MOCK_DRIVERS.filter(d => d.active);
  }

  async getDriver(id: number): Promise<Driver | undefined> {
    return MOCK_DRIVERS.find(d => d.id === id);
  }

  async createBooking(booking: Omit<Booking, "id" | "status" | "createdAt">): Promise<Booking> {
    const [newBooking] = await db.insert(bookings)
      .values({
        ...booking,
        status: "pending",
        createdAt: new Date(),
      })
      .returning();
    return newBooking;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return db.select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(bookings.createdAt);
  }

  async updateBookingStatus(id: number, status: string): Promise<void> {
    await db.update(bookings)
      .set({ status })
      .where(eq(bookings.id, id));
  }
}

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private bookings = new Map<number, Booking>();
  private userId = 1;
  private bookingId = 1;
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.userId++,
      ...insertUser,
    };
    this.users.set(user.id, user);
    return user;
  }

  async getDrivers(): Promise<Driver[]> {
    return MOCK_DRIVERS;
  }

  async getActiveDrivers(): Promise<Driver[]> {
    return MOCK_DRIVERS.filter((driver) => driver.active);
  }

  async getDriver(id: number): Promise<Driver | undefined> {
    return MOCK_DRIVERS.find((driver) => driver.id === id);
  }

  async createBooking(booking: Omit<Booking, "id" | "status" | "createdAt">): Promise<Booking> {
    const newBooking: Booking = {
      id: this.bookingId++,
      status: "pending",
      createdAt: new Date(),
      ...booking,
    };
    this.bookings.set(newBooking.id, newBooking);
    return newBooking;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter((booking) => booking.userId === userId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async updateBookingStatus(id: number, status: string): Promise<void> {
    const booking = this.bookings.get(id);
    if (booking) {
      this.bookings.set(id, { ...booking, status });
    }
  }
}

// Keep the mock drivers data for now
const MOCK_DRIVERS: Driver[] = [
  {
    id: 1,
    name: "Ravi Kumar",
    phone: "9876543210",
    avatar: "https://images.unsplash.com/photo-1541747277704-ef7fb8e1a31c",
    active: true,
    currentLat: 28.6139,
    currentLng: 77.2090,
    totalRides: 120,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Amit Singh",
    phone: "9876543211",
    avatar: "https://images.unsplash.com/photo-1496423275314-469c5608e89a",
    active: true,
    currentLat: 28.6229,
    currentLng: 77.2100,
    totalRides: 98,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Suresh Patel",
    phone: "9876543212", 
    avatar: "https://images.unsplash.com/photo-1576669801820-a9ab287ac2d1",
    active: true,
    currentLat: 28.6119,
    currentLng: 77.2070,
    totalRides: 150,
    rating: 4.8,
  },
];

export const storage =
  process.env.NODE_ENV === "development" ? new MemStorage() : new DatabaseStorage();
