import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { AnimatedGradientText, AnimatedText } from "@/components/animated-text";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                <AnimatedGradientText text={t("welcomeToTheLastMile")} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">{t("login")}</TabsTrigger>
                  <TabsTrigger value="register">{t("register")}</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>

                <TabsContent value="register">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        className="hidden lg:flex items-center justify-center bg-primary/5 p-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-lg">
          <AnimatedText
            text={t("tagline")}
            className="text-4xl font-bold mb-4"
          />
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t("description")}
          </motion.p>

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
            <motion.img
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                show: { opacity: 1, scale: 1 },
              }}
              src="https://images.unsplash.com/photo-1457301547464-91995555cd25"
              alt="E-rickshaw"
              className="rounded-lg shadow-lg"
            />
            <motion.img
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                show: { opacity: 1, scale: 1 },
              }}
              src="https://images.unsplash.com/photo-1447069387593-a5de0862481e"
              alt="E-rickshaw on street"
              className="rounded-lg shadow-lg"
            />
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
                <Input {...field} />
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
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
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
                <Input {...field} />
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
                <Input type="password" {...field} />
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
                <Input {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
          {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("register")}
        </Button>
      </form>
    </Form>
  );
}