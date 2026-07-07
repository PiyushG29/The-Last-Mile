import { useQuery } from "@tanstack/react-query";
import { Driver } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BookingForm from "@/components/booking-form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useDriverLocations } from "@/hooks/use-driver-locations";
import Map from "@/components/map";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Footer from "@/components/Footer";
import paperPlaneGif from "./assets/paper-plane.gif";
import driverGif from "./assets/driver.gif";

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
      className="px-4 pb-16 pt-32 md:pt-36"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 font-display text-4xl font-bold text-gradient-primary md:text-6xl"
        >
          {t("booking.title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 max-w-none text-lg text-muted-foreground lg:whitespace-nowrap"
        >
          {t("booking.subtitle")}
        </motion.p>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden border-primary/25 bg-gradient-card shadow-card transition-all duration-300 hover:border-primary/45 hover:shadow-glow-primary">
              <CardHeader className="border-b border-border/60 bg-background/35">
                <CardTitle className="flex items-center gap-3 font-display">
                  <span className="grid h-12 w-12 place-items-center rounded-md bg-background/70">
                    <img src={paperPlaneGif} alt="" className="h-10 w-10 object-contain" />
                  </span>
                  {t("booking.bookYourRide")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
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
            <Card className="border-electric/25 bg-gradient-card shadow-card transition-all duration-300 hover:border-electric/45 hover:shadow-glow-electric">
              <CardHeader className="border-b border-border/60 bg-background/35">
                <CardTitle className="flex items-center gap-3 font-display">
                  <span className="grid h-12 w-12 place-items-center rounded-md bg-background/70">
                    <img src={driverGif} alt="" className="h-10 w-10 object-contain" />
                  </span>
                  {t("booking.nearbyDrivers")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
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
                          className="flex items-center space-x-4 rounded-md border border-border/60 bg-background/55 p-4 shadow-sm transition-all duration-300 hover:border-primary/35 hover:bg-primary/10"
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
                            <div className="ml-auto flex items-center text-sm font-medium text-primary">
                              <motion.span 
                                className="mr-2 h-2 w-2 rounded-full bg-primary"
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
