export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const apiKey = "f1e09a2b69e14777a78a5875283a49be";
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const properties = data.features[0].properties;
      
      // Format the address
      const addressParts = [];
      if (properties.street) addressParts.push(properties.street);
      if (properties.district) addressParts.push(properties.district);
      if (properties.city) addressParts.push(properties.city);
      
      // Return a compact address or fallback to coordinates
      return addressParts.length > 0 
        ? addressParts.join(", ")
        : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    
    // Fallback to coordinates if no address data
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    // Return coordinates on error
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
} 