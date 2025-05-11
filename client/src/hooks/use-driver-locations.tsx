import { useState, useEffect } from 'react';
import { Driver } from '@shared/schema';

type DriverLocation = {
  driverId: number;
  lat: number;
  lng: number;
};

export function useDriverLocations(drivers: Driver[] | undefined) {
  const [driverLocations, setDriverLocations] = useState<Map<number, DriverLocation>>(new Map());
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Setup WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === 'locations') {
          // Initial locations
          const locationsMap = new Map();
          message.data.forEach((loc: DriverLocation) => {
            locationsMap.set(loc.driverId, loc);
          });
          setDriverLocations(locationsMap);
        } else if (message.type === 'location_update') {
          // Single location update
          setDriverLocations(prev => {
            const next = new Map(prev);
            next.set(message.data.driverId, message.data);
            return next;
          });
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // Combine driver info with real-time locations
  const driversWithLocations = drivers?.map(driver => ({
    ...driver,
    currentLat: driverLocations.get(driver.id)?.lat ?? driver.currentLat,
    currentLng: driverLocations.get(driver.id)?.lng ?? driver.currentLng,
  }));

  return {
    drivers: driversWithLocations,
    socket
  };
}
