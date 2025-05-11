import { useRef, useEffect, useState } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

type Coordinates = {
  lat: number;
  lng: number;
};

type MapProps = {
  apiKey: string;
  center?: Coordinates;
  markers?: Array<{
    position: Coordinates;
    title?: string;
    icon?: string;
  }>;
  onLocationSelect?: (location: Coordinates) => void;
  showSearch?: boolean;
};

function MapComponent({
  center,
  markers = [],
  onLocationSelect,
  showSearch,
}: Omit<MapProps, "apiKey">) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const [selectedMarker, setSelectedMarker] = useState<google.maps.Marker>();

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const initialCenter = center || { lat: 28.6139, lng: 77.2090 }; // Default to Delhi
    const map = new google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 14,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    setMap(map);

    if (onLocationSelect) {
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        const position = e.latLng!;
        
        if (selectedMarker) {
          selectedMarker.setMap(null);
        }

        const marker = new google.maps.Marker({
          position,
          map,
          animation: google.maps.Animation.DROP,
        });

        setSelectedMarker(marker);
        onLocationSelect({
          lat: position.lat(),
          lng: position.lng(),
        });
      });
    }
  }, [center, onLocationSelect]);

  // Initialize search box
  useEffect(() => {
    if (!map || !showSearch) return;

    const input = document.getElementById("map-search") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);
    
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
    });

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      if (onLocationSelect) {
        const position = place.geometry.location;
        
        if (selectedMarker) {
          selectedMarker.setMap(null);
        }

        const marker = new google.maps.Marker({
          position,
          map,
          animation: google.maps.Animation.DROP,
        });

        setSelectedMarker(marker);
        onLocationSelect({
          lat: position.lat(),
          lng: position.lng(),
        });
      }
    });

    setSearchBox(searchBox);
  }, [map, showSearch, onLocationSelect]);

  // Update markers
  useEffect(() => {
    if (!map) return;

    const gMarkers = markers.map(({ position, title, icon }) => 
      new google.maps.Marker({
        position,
        map,
        title,
        icon: icon ? {
          url: icon,
          scaledSize: new google.maps.Size(40, 40),
        } : undefined,
      })
    );

    return () => {
      gMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, markers]);

  return (
    <div className="relative">
      {showSearch && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex gap-2">
            <Input
              id="map-search"
              placeholder="Search for a location..."
              className="bg-white shadow-lg"
            />
            <Button size="icon" variant="secondary" className="bg-white shadow-lg">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-[400px] rounded-lg" />
    </div>
  );
}

export default function Map(props: MapProps) {
  return (
    <Wrapper
      apiKey={props.apiKey}
      libraries={["places"]}
      version="beta"
    >
      <MapComponent {...props} />
    </Wrapper>
  );
}
