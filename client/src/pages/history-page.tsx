import { useQuery } from "@tanstack/react-query";
import { Booking } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { MapPin, Clock, IndianRupee, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Footer from "@/components/Footer";
import { reverseGeocode } from "@/utils/geocoding";
import { useState, useEffect } from "react";

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "accepted":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
}

function formatCarbonSaved(kgCO2: number): string {
  if (kgCO2 < 1) {
    return `${(kgCO2 * 1000).toFixed(0)} g`;
  }
  return `${kgCO2.toFixed(1)} kg`;
}

export default function HistoryPage() {
  const { t } = useTranslation();
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });
  const [locationNames, setLocationNames] = useState<Record<string, { pickup: string; drop: string }>>({});

  const totalCarbonSaved = bookings?.reduce((acc, booking) => acc + booking.carbonSaved, 0) || 0;
  const treesEquivalent = Math.round(totalCarbonSaved / 21); // Average tree absorbs 21 kg CO2 per year

  useEffect(() => {
    // Fetch location names for each booking
    if (bookings && bookings.length > 0) {
      const fetchLocationNames = async () => {
        const locationData: Record<string, { pickup: string; drop: string }> = {};
        
        for (const booking of bookings) {
          try {
            // Fetch in parallel
            const [pickupName, dropName] = await Promise.all([
              reverseGeocode(booking.pickupLat, booking.pickupLng),
              reverseGeocode(booking.dropLat, booking.dropLng)
            ]);
            
            locationData[booking.id] = { 
              pickup: pickupName,
              drop: dropName 
            };
          } catch (error) {
            console.error("Error fetching location names:", error);
            locationData[booking.id] = { 
              pickup: `${booking.pickupLat.toFixed(4)}, ${booking.pickupLng.toFixed(4)}`,
              drop: `${booking.dropLat.toFixed(4)}, ${booking.dropLng.toFixed(4)}` 
            };
          }
        }
        
        setLocationNames(locationData);
      };
      
      fetchLocationNames();
    }
  }, [bookings]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t("history.title")}
        </h1>

        {!isLoading && bookings && bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      <Leaf className="h-5 w-5 text-green-600 mr-2" />
                      {t("history.environmentalImpact")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("history.carbonReduction")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCarbonSaved(totalCarbonSaved)} CO₂
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("history.equivalent").replace("{count}", treesEquivalent.toString())}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-[300px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : bookings?.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">{t("history.noBookings")}</h3>
                <p className="text-muted-foreground">
                  {t("history.noBookingsDescription")}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings?.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className={`${getStatusColor(
                            booking.status
                          )} text-white capitalize`}
                        >
                          {t(`history.status.${booking.status}`)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {format(new Date(booking.createdAt), "PPp")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-green-600">
                          <Leaf className="h-4 w-4 mr-1" />
                          {formatCarbonSaved(booking.carbonSaved)} {t("history.carbonSaved")}
                        </div>
                        <div className="flex items-center text-lg font-semibold">
                          <IndianRupee className="h-4 w-4 inline mr-1" />
                          {booking.fare}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">{t("booking.pickupLocation")}</div>
                          <div className="text-sm text-muted-foreground">
                            {locationNames[booking.id]?.pickup || (
                              <Skeleton className="h-4 w-[200px]" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <MapPin className="h-5 w-5 text-destructive mt-0.5" />
                        <div>
                          <div className="font-medium">{t("booking.dropLocation")}</div>
                          <div className="text-sm text-muted-foreground">
                            {locationNames[booking.id]?.drop || (
                              <Skeleton className="h-4 w-[200px]" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}