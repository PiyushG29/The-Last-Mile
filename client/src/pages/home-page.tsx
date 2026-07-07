import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BatteryCharging,
  History,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  PhoneCall,
  Share2,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Footer from "@/components/Footer";
import img3 from "./assets/img3.png";
import walletGif from "./assets/wallet.gif";
import shieldGif from "./assets/shield.gif";
import phone24Gif from "./assets/24-hours.gif";
import speechBubbleGif from "./assets/speech-bubble.gif";
import emailGif from "./assets/email.gif";
import arrowGif from "./assets/bullet-point.gif";
import zigzagArrowGif from "./assets/zigzag-arrow.gif";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const featureCards = [
  {
    icon: MapPin,
    titleKey: "features.easyBooking.title",
    descriptionKey: "features.easyBooking.description",
    buttonKey: "bookNow",
    href: "/book",
    image: img3,
    alt: "E-rickshaw",
  },
  {
    icon: Share2,
    titleKey: "features.liveChat.title",
    descriptionKey: "features.liveChat.description",
    buttonKey: "chat.startChat",
    href: "/chat",
    image: "https://images.unsplash.com/photo-1625217527288-93919c99650a",
    alt: "Phone showing a location sharing app",
  },
  {
    icon: History,
    titleKey: "features.rideHistory.title",
    descriptionKey: "features.rideHistory.description",
    buttonKey: "viewHistory",
    href: "/history",
    image: "https://images.unsplash.com/photo-1531944252668-83d381a30b26",
    alt: "Ride history",
  },
];

const benefits = [
  {
    icon: Wallet,
    gif: walletGif,
    className: "border-accent/30 shadow-glow-accent",
  },
  {
    icon: BatteryCharging,
    gif: null,
    className: "border-electric/30 shadow-glow-electric",
  },
  {
    icon: ShieldCheck,
    gif: shieldGif,
    className: "border-primary/30 shadow-glow-primary",
  },
];

const routeKeys = ["metroToMarket", "campusLoop", "stationPickup", "hospitalRoute"];

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden pt-28 md:pt-32">
      <section className="relative px-4 pb-16 pt-8 md:pb-24">
        <motion.div
          className="absolute left-[6%] top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.12, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-16 right-[10%] h-48 w-48 rounded-full bg-electric/10 blur-3xl"
          animate={{ scale: [1, 1.18, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container relative mx-auto grid min-h-[calc(100vh-8rem)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
            }}
            className="max-w-3xl"
          >
            <motion.h1
              variants={fadeUp}
              className="font-display text-5xl font-bold leading-[1.02] text-foreground md:text-7xl"
            >
              {t("home.hero.bookYour")} <span className="text-gradient-primary">{t("home.hero.eRickshaw")}</span>
              <br />
              {t("home.hero.fast")} <span className="text-gradient-electric">{t("home.hero.localRides")}</span>
              <br />
              {t("home.hero.cleaner")} <span className="text-gradient-accent">{t("home.hero.cities")}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl"
            >
              {t("description")}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-14 min-w-[180px] gap-3 px-8 text-base bg-primary text-primary-foreground shadow-glow-primary transition-all duration-300 hover:scale-[1.02] hover:bg-primary/90 hover:shadow-[0_0_50px_hsl(var(--primary)/0.28)] active:scale-[0.98]"
                asChild
              >
                <Link href="/book">
                  <a className="inline-flex items-center justify-center gap-3">
                    <span>{t("bookNow")}</span>
                    <img src={arrowGif} alt="" className="h-8 w-8 shrink-0 rounded-sm object-contain" />
                  </a>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 min-w-[190px] gap-3 border-border/70 bg-background/60 px-8 text-base transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:bg-secondary/60 active:scale-[0.98]"
                asChild
              >
                <Link href="/chat-support">
                  <a className="inline-flex items-center justify-center gap-3">
                    <span>{t("support.chat.button")}</span>
                    <img src={speechBubbleGif} alt="" className="h-8 w-8 shrink-0 rounded-sm object-contain" />
                  </a>
                </Link>
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {[
                ["12k+", t("home.stats.rides")],
                ["4.8", t("home.stats.rating")],
                ["35%", t("home.stats.co2Saved")],
              ].map(([value, label]) => (
                <div key={label} className="rounded-md border border-border/60 bg-background/55 p-4 backdrop-blur-xl">
                  <div className="font-display text-2xl font-bold tabular-nums text-foreground">{value}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 36, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div className="absolute -left-5 top-12 z-10 rounded-md border border-border/60 bg-background/85 p-4 shadow-card backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-electric/10 text-electric">
                  <Navigation className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{t("home.pickupBadge.title")}</p>
                  <p className="text-xs text-muted-foreground">{t("home.pickupBadge.description")}</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border/60 bg-gradient-card p-3 shadow-card">
              <img
                src={img3}
                alt="E-rickshaw on a city street"
                className="h-[430px] w-full rounded-lg object-cover md:h-[540px]"
              />
            </div>

            <div className="absolute -bottom-6 right-4 rounded-md border border-accent/30 bg-background/90 p-4 shadow-glow-accent backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-accent/15 text-accent">
                  <Leaf className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{t("home.cleanBadge.title")}</p>
                  <p className="text-xs text-muted-foreground">{t("home.cleanBadge.description")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 max-w-2xl"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-primary">{t("home.rideTools")}</p>
            <h2 className="font-display text-3xl font-bold md:text-5xl">{t("welcomeToTheLastMile")}</h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon;
              const title = t(feature.titleKey);
              const description = t(feature.descriptionKey);

              return (
                <motion.div
                  key={feature.href}
                  initial={{ opacity: 0, y: 32, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="h-full overflow-hidden border-border/60 bg-card shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-glow-primary">
                    <CardContent className="flex h-full flex-col p-0">
                      <div className="p-6 pb-0">
                        <img
                          src={feature.image}
                          alt={feature.alt}
                          className="h-44 w-full rounded-lg object-cover md:h-52"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-display text-3xl font-semibold text-foreground">{title}</h3>
                        <p className="mt-4 flex-1 text-lg leading-8 text-muted-foreground">
                          {description}
                        </p>
                        <Link href={feature.href}>
                          <a className="mt-7 inline-flex h-12 w-full items-center justify-center gap-3 rounded-md bg-primary px-4 text-base font-medium text-primary-foreground shadow-glow-primary transition-colors hover:bg-primary/90">
                            <span>{t(feature.buttonKey)}</span>
                            <Icon className="h-5 w-5 shrink-0" />
                          </a>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-background/45 px-4 py-16 backdrop-blur-sm md:py-24">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-electric">{t("home.whyChooseEyebrow")}</p>
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              {t("home.whyChooseTitleStart")} <span className="text-gradient-primary">{t("home.whyChooseTitleHighlight")}</span>
            </h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={`benefit-${index}`}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className={`rounded-xl border bg-gradient-card p-6 transition-all duration-300 ${benefit.className}`}
                >
                  {benefit.gif ? (
                    <img
                      src={benefit.gif}
                      alt=""
                      className="mb-5 h-12 w-12 rounded-md object-contain"
                    />
                  ) : (
                    <Icon className="mb-5 h-12 w-12 rounded-md p-2 text-primary" />
                  )}
                  <h3 className="font-display text-xl font-semibold">{t(`home.benefits.${index}.title`)}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{t(`home.benefits.${index}.description`)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-route">{t("home.popularRoutes")}</p>
            <h2 className="font-display text-3xl font-bold md:text-5xl">{t("home.routesTitle")}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {routeKeys.map((route) => (
              <motion.div
                key={route}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ x: 6 }}
                className="flex items-center gap-4 rounded-md border border-border/60 bg-gradient-card p-4 shadow-sm"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white/90 shadow-sm ring-1 ring-route/10">
                  <img src={zigzagArrowGif} alt="" className="h-7 w-7 object-contain" />
                </span>
                <span className="font-medium">{t(`home.routes.${route}`)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:pb-24">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">{t("support.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("support.description")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: PhoneCall, gif: phone24Gif, title: t("support.call.title"), description: t("support.call.description"), action: "+91 1800-123-4567", href: "tel:+911800-123-4567" },
              { icon: MessageCircle, gif: speechBubbleGif, title: t("support.chat.title"), description: t("support.chat.description"), action: t("support.chat.button"), href: "/chat-support" },
              { icon: Mail, gif: emailGif, title: t("support.email.title"), description: t("support.email.description"), action: "support@lastmile.com", href: "mailto:support@lastmile.com" },
            ].map((item, index) => {
              const Icon = item.icon;
              const isInternal = item.href.startsWith("/");
              const button = (
                <Button variant="outline" className="mt-auto w-full border-border/70 bg-background/50 hover:border-primary/40">
                  {item.action}
                </Button>
              );

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="flex min-h-[240px] flex-col rounded-xl border border-border/60 bg-gradient-card p-6 shadow-card"
                >
                  <span className="mb-5 grid h-14 w-14 place-items-center rounded-md bg-background/70">
                    {item.gif ? (
                      <img src={item.gif} alt="" className="h-12 w-12 object-contain" />
                    ) : (
                      <Icon className="h-6 w-6 text-primary" />
                    )}
                  </span>
                  <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                  <p className="mb-5 mt-3 flex-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  {isInternal ? (
                    <Link href={item.href}>{button}</Link>
                  ) : (
                    <a href={item.href}>{button}</a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
