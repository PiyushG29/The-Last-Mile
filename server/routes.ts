import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { calculateDistance, calculateCarbonSaved } from "../client/src/lib/maps";

// Track connected clients
const clients = new Set<WebSocket>();

// Store driver locations
const driverLocations = new Map<number, { lat: number; lng: number }>();

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Get nearby drivers
  app.get("/api/drivers", async (req, res) => {
    const drivers = await storage.getActiveDrivers();

    // Attach real-time locations
    const driversWithLocations = drivers.map(driver => ({
      ...driver,
      currentLat: driverLocations.get(driver.id)?.lat ?? driver.currentLat,
      currentLng: driverLocations.get(driver.id)?.lng ?? driver.currentLng,
    }));

    res.json(driversWithLocations);
  });

  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const result = insertBookingSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const distance = calculateDistance(
      result.data.pickupLat,
      result.data.pickupLng,
      result.data.dropLat,
      result.data.dropLng
    );

    const carbonSaved = calculateCarbonSaved(distance);

    const booking = await storage.createBooking({
      ...result.data,
      userId: req.user!.id,
      driverId: 1, // Assign to first driver for now
      distance,
      carbonSaved,
    });

    // Auto-accept booking after 2 seconds
    setTimeout(async () => {
      await storage.updateBookingStatus(booking.id, "accepted");
    }, 2000);

    res.status(201).json(booking);
  });

  // Get user's booking history
  app.get("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const bookings = await storage.getUserBookings(req.user!.id);
    res.json(bookings);
  });

  const httpServer = createServer(app);

  // Setup WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    clients.add(ws);

    // Send current driver locations
    ws.send(JSON.stringify({
      type: 'locations',
      data: Array.from(driverLocations.entries()).map(([id, location]) => ({
        driverId: id,
        ...location
      }))
    }));

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'driver_location') {
          const { driverId, lat, lng } = message;
          driverLocations.set(driverId, { lat, lng });

          // Broadcast to all connected clients
          const locationUpdate = JSON.stringify({
            type: 'location_update',
            data: { driverId, lat, lng }
          });

          clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(locationUpdate);
            }
          });
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  return httpServer;
}