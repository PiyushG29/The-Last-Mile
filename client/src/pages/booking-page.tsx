import { useQuery } from "@tanstack/react-query";
import { Driver } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BookingForm from "@/components/booking-form";
import { Loader2, MapPin } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useDriverLocations } from "@/hooks/use-driver-locations";
import Map from "@/components/map";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Footer from "@/components/Footer";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function BookingPage() {
  const { t } = useTranslation();
  const { data: initialDrivers, isLoading } = useQuery<Driver[]>({
    queryKey: ["/api/drivers"],
  });

  const { drivers } = useDriverLocations(initialDrivers);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        >
          {t("booking.title")}
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden border-primary/20 hover:border-primary/40 transition-colors duration-300">
              <CardHeader>
                <CardTitle>{t("booking.bookYourRide")}</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingForm />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-primary/20 hover:border-primary/40 transition-colors duration-300">
              <CardHeader>
                <CardTitle>{t("booking.nearbyDrivers")}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    {[1, 2, 3].map((i) => (
                      <motion.div 
                        key={i} 
                        variants={item}
                        className="flex items-center space-x-4"
                      >
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[150px]" />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : drivers?.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-4 text-muted-foreground"
                  >
                    {t("booking.noDrivers")}
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Map
                        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                        markers={drivers?.map((driver) => ({
                          position: {
                            lat: driver.currentLat || 0,
                            lng: driver.currentLng || 0,
                          },
                          title: driver.name,
                          icon: driver.avatar,
                        }))}
                      />
                    </motion.div>
                    <motion.div 
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="mt-4 space-y-4"
                    >
                      {drivers?.map((driver) => (
                        <motion.div
                          key={driver.id}
                          variants={item}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center space-x-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg hover:from-primary/10 hover:to-primary/15 transition-all duration-300"
                        >
                          <Avatar>
                            <AvatarImage src={driver.avatar} alt={driver.name} />
                            <AvatarFallback>{driver.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{driver.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {driver.phone}
                            </p>
                          </div>
                          {driver.active && (
                            <div className="ml-auto flex items-center text-sm text-green-600">
                              <motion.span 
                                className="h-2 w-2 rounded-full bg-green-600 mr-2"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              {t("booking.available")}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}