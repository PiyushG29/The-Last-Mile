import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, History, PhoneCall, MessageCircle, Mail, Share2 } from "lucide-react";
import { AnimatedText, AnimatedGradientText } from "@/components/animated-text";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Footer from "@/components/Footer";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <AnimatedGradientText
            text={t("welcomeToTheLastMile")}
            className="text-4xl font-bold"
          />
        </div>

        {/* First row: Book Now and Chat & Location Sharing cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              show: { opacity: 1, x: 0 }
            }}
            className="flex flex-col h-full"
          >
            <Card className="flex flex-col h-full">
              <CardContent className="pt-6 flex flex-col flex-grow">
                <motion.img
                  initial={{ scale: 0.95 }}
                  whileHover={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  src="https://images.unsplash.com/photo-1514715702578-09cae826e8e3"
                  alt="E-rickshaw"
                  className="rounded-lg mb-4 object-cover h-48 w-full"
                />
                <AnimatedText
                  text={t("features.easyBooking.title")}
                  className="text-2xl font-semibold mb-2"
                />
                <p className="text-muted-foreground mb-4 flex-grow">
                  {t("features.easyBooking.description")}
                </p>
                <Link href="/book">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="w-full">
                      <MapPin className="mr-2 h-4 w-4" />
                      {t("bookNow")}
                    </Button>
                  </motion.div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Card className="flex flex-col h-full">
              <CardContent className="pt-6 flex flex-col flex-grow">
                <motion.img
                  initial={{ scale: 0.95 }}
                  whileHover={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  src="https://images.unsplash.com/photo-1625217527288-93919c99650a"
                  alt="Paris map with streets"
                  className="rounded-lg mb-4 object-cover h-48 w-full"
                />
                <AnimatedText
                  text={t("features.liveChat.title")}
                  className="text-2xl font-semibold mb-2"
                />
                <p className="text-muted-foreground mb-4 flex-grow">
                  {t("features.liveChat.description")}
                </p>
                <Link href="/chat">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="w-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      {t("chat.startChat")}
                    </Button>
                  </motion.div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Second row: Ride History card */}
        <motion.div
          className="grid md:grid-cols-1 gap-8 mb-12"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                delay: 0.3
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 0, y: 20 },
              show: { opacity: 1, x: 0, y: 0 }
            }}
            className="md:max-w-md mx-auto"
          >
            <Card>
              <CardContent className="pt-6">
                <motion.img
                  initial={{ scale: 0.95 }}
                  whileHover={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  src="https://images.unsplash.com/photo-1531944252668-83d381a30b26"
                  alt="E-rickshaw waiting"
                  className="rounded-lg mb-4 object-cover h-48 w-full"
                />
                <AnimatedText
                  text={t("features.rideHistory.title")}
                  className="text-2xl font-semibold mb-2"
                />
                <p className="text-muted-foreground mb-4">
                  {t("features.rideHistory.description")}
                </p>
                <Link href="/history">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="w-full">
                      <History className="mr-2 h-4 w-4" />
                      {t("viewHistory")}
                    </Button>
                  </motion.div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-4 p-4 bg-primary/5 rounded-lg"
          >
            <MapPin className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">{t("features.easyBooking.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("features.easyBooking.description")}</p>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-4 p-4 bg-primary/5 rounded-lg"
          >
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">{t("features.quickPickup.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("features.quickPickup.description")}</p>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-4 p-4 bg-primary/5 rounded-lg"
          >
            <History className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">{t("features.rideHistory.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("features.rideHistory.description")}</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <AnimatedText
              text={t("support.title")}
              className="text-3xl font-bold mb-2"
            />
            <p className="text-muted-foreground">
              {t("support.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-colors duration-300"
            >
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <PhoneCall className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("support.call.title")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("support.call.description")}
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="tel:+911800-123-4567">+91 1800-123-4567</a>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-colors duration-300"
            >
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("support.chat.title")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("support.chat.description")}
              </p>
              <Link href="/chat-support">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="outline" className="w-full">
                    {t("support.chat.button")}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-colors duration-300"
            >
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("support.email.title")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("support.email.description")}
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:support@lastmile.com">support@lastmile.com</a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}