import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookingSchema } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { calculateDistance, calculateFare, formatAddress } from "@/lib/maps";
import { Loader2, MapPin, IndianRupee } from "lucide-react";
import { useLocation } from "wouter";
import Map from "./map";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type Location = {
  lat: number;
  lng: number;
  address?: string;
};

export default function BookingForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [pickupLocation, setPickupLocation] = useState<Location>();
  const [dropLocation, setDropLocation] = useState<Location>();
  const [isSelectingDrop, setIsSelectingDrop] = useState(false);
  const { t } = useTranslation();

  const form = useForm({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      pickupLat: 0,
      pickupLng: 0,
      dropLat: 0,
      dropLng: 0,
      fare: 0,
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: t("booking.bookingConfirmed"),
        description: t("booking.bookingConfirmedDescription"),
      });
      setLocation("/history");
    },
    onError: (error: Error) => {
      toast({
        title: t("booking.bookingFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLocationSelect = async (coords: { lat: number; lng: number }) => {
    const address = await formatAddress(coords);

    if (!isSelectingDrop) {
      setPickupLocation({ ...coords, address });
      form.setValue("pickupLat", coords.lat);
      form.setValue("pickupLng", coords.lng);
      setIsSelectingDrop(true);
    } else {
      setDropLocation({ ...coords, address });
      form.setValue("dropLat", coords.lat);
      form.setValue("dropLng", coords.lng);

      if (pickupLocation) {
        const distance = calculateDistance(
          pickupLocation.lat,
          pickupLocation.lng,
          coords.lat,
          coords.lng
        );
        const fare = calculateFare(distance);
        form.setValue("fare", fare);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => bookingMutation.mutate(data))}
        className="space-y-6"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Map
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              onLocationSelect={handleLocationSelect}
              markers={[
                ...(pickupLocation ? [{
                  position: pickupLocation,
                  title: "Pickup",
                }] : []),
                ...(dropLocation ? [{
                  position: dropLocation,
                  title: "Drop",
                }] : []),
              ]}
              showSearch
            />
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="flex items-start space-x-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-primary/10 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">{t("booking.pickupLocation")}</div>
                <div className="text-sm text-muted-foreground">
                  {pickupLocation?.address || t("booking.selectPickup")}
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-start space-x-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-destructive/10 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <div className="font-medium">{t("booking.dropLocation")}</div>
                <div className="text-sm text-muted-foreground">
                  {dropLocation?.address || t("booking.selectDrop")}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {form.getValues("fare") > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="font-medium">{t("booking.estimatedFare")}</div>
                <div className="text-lg font-semibold flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {form.getValues("fare")}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
            disabled={bookingMutation.isPending || !pickupLocation || !dropLocation}
          >
            {bookingMutation.isPending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="mr-2 h-4 w-4" />
              </motion.div>
            ) : null}
            {t("booking.confirmBooking")}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}