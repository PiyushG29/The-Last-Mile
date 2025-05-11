const EARTH_RADIUS_KM = 6371;
const CO2_PER_KM_CAR = 0.120; // kg CO2 per km for average car
const CO2_PER_KM_RICKSHAW = 0.030; // kg CO2 per km for e-rickshaw

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);

  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2); 

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return EARTH_RADIUS_KM * c;
}

export function calculateCarbonSaved(distance: number): number {
  const carEmissions = distance * CO2_PER_KM_CAR;
  const rickshawEmissions = distance * CO2_PER_KM_RICKSHAW;
  return +(carEmissions - rickshawEmissions).toFixed(2); // kg CO2 saved
}

export function calculateFare(distance: number): number {
  const baseRate = 20; // Base fare in INR
  const ratePerKm = 10; // Rate per km in INR
  return Math.round(baseRate + (distance * ratePerKm));
}

export function formatAddress(location: { lat: number; lng: number }): Promise<string> {
  const apiKey = "f1e09a2b69e14777a78a5875283a49be"; // Geoapify API key
  
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${location.lat}&lon=${location.lng}&apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Geocoding request failed");
      }

      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const properties = data.features[0].properties;
        
        // Extract address components
        const parts = [];
        
        // Add specific point of interest if available
        if (properties.name) parts.push(properties.name);
        
        // Add street
        if (properties.street) parts.push(properties.street);
        
        // Add district/neighborhood
        if (properties.district) parts.push(properties.district);
        else if (properties.suburb) parts.push(properties.suburb);
        else if (properties.neighbourhood) parts.push(properties.neighbourhood);
        
        // Add city
        if (properties.city) parts.push(properties.city);
        else if (properties.town) parts.push(properties.town);
        else if (properties.village) parts.push(properties.village);
        
        // Add state
        if (properties.state) parts.push(properties.state);
        
        // Take the 3 most specific parts for readability
        const address = parts.slice(0, 3).join(', ');
        
        resolve(address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
      } else {
        // Fallback to coordinates
        resolve(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      // Fallback to coordinates on error
      resolve(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
    }
  });
}