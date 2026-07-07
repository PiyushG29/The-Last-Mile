import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";
import { BatteryCharging, Loader2 } from "lucide-react";
import { AnimatedGradientText, AnimatedText } from "@/components/animated-text";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import img1 from "./assets/img1.png";
import img2 from "./assets/img2.png";
import shieldGif from "./assets/shield.gif";
import thunderGif from "./assets/thunder.gif";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-gradient-hero lg:grid-cols-2">
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>
      <div className="absolute left-[12%] top-20 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-16 right-[10%] h-60 w-60 rounded-full bg-electric/10 blur-3xl" />

      <div className="relative z-10 flex items-center justify-center p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/60 bg-gradient-card shadow-card">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-gradient-primary text-primary-foreground shadow-glow-primary">
                  <BatteryCharging className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">The Last Mile</p>
                  <CardTitle className="font-display text-3xl">
                    <AnimatedGradientText text={t("welcomeToTheLastMile")} />
                  </CardTitle>
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{t("description")}</p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2 bg-secondary/70">
                  <TabsTrigger value="login">{t("login")}</TabsTrigger>
                  <TabsTrigger value="register">{t("register")}</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6">
                  <LoginForm />
                </TabsContent>

                <TabsContent value="register" className="mt-6">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        className="relative hidden items-center justify-center overflow-hidden border-l border-border/60 bg-background/35 p-8 backdrop-blur-sm lg:flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-electric/25 bg-electric/10 px-4 py-2 text-sm font-semibold text-electric">
            <span className="h-2 w-2 rounded-full bg-electric animate-pulse-glow" />
            Electric mobility platform
          </div>
          <AnimatedText
            text={t("tagline")}
            className="font-display text-5xl font-bold leading-tight"
          />
          <motion.p
            className="mt-5 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t("description")}
          </motion.p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-xl border border-primary/25 bg-gradient-card p-4 shadow-glow-primary"
            >
              <img src={shieldGif} alt="" className="mb-4 h-12 w-12 rounded-md object-contain" />
              <p className="font-display text-xl font-semibold">Trusted drivers</p>
              <p className="mt-2 text-sm text-muted-foreground">Ride history and support built into every trip.</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-xl border border-accent/25 bg-gradient-card p-4 shadow-glow-accent"
            >
              <img src={thunderGif} alt="" className="mb-4 h-12 w-12 rounded-md object-contain" />
              <p className="font-display text-xl font-semibold">Fast pickup</p>
              <p className="mt-2 text-sm text-muted-foreground">Designed for quick local hops across the city.</p>
            </motion.div>
          </div>

          <motion.div
            className="mt-8 grid grid-cols-2 gap-4"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                show: { opacity: 1, scale: 1 },
              }}
              className="aspect-[4/3] overflow-hidden rounded-xl border border-border/60 shadow-card"
            >
              <img
                src={img1}
                alt="E-rickshaw"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                show: { opacity: 1, scale: 1 },
              }}
              className="aspect-[4/3] overflow-hidden rounded-xl border border-border/60 shadow-card"
            >
              <img
                src={img2}
                alt="E-rickshaw on street"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function LoginForm() {
  const { loginMutation } = useAuth();
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.username")}</FormLabel>
              <FormControl>
                <Input className="bg-background/70" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.password")}</FormLabel>
              <FormControl>
                <Input className="bg-background/70" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-primary text-primary-foreground shadow-glow-primary hover:bg-primary/90" disabled={loginMutation.isPending}>
          {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("login")}
        </Button>
      </form>
    </Form>
  );
}

function RegisterForm() {
  const { registerMutation } = useAuth();
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      phone: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.username")}</FormLabel>
              <FormControl>
                <Input className="bg-background/70" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.password")}</FormLabel>
              <FormControl>
                <Input className="bg-background/70" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.fullName")}</FormLabel>
              <FormControl>
                <Input className="bg-background/70" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.phoneNumber")}</FormLabel>
              <FormControl>
                <Input className="bg-background/70" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-primary text-primary-foreground shadow-glow-primary hover:bg-primary/90" disabled={registerMutation.isPending}>
          {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("register")}
        </Button>
      </form>
    </Form>
  );
}
