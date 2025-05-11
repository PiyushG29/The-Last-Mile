import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const { t } = useTranslation();

  if (!user || location === "/auth") return null;

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <a className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("welcome")}
            </a>
          </Link>

          <div className="hidden md:flex space-x-4">
            <Link href="/book">
              <a className={`${location === "/book" ? "text-primary" : "text-muted-foreground"}`}>
                {t("bookNow")}
              </a>
            </Link>
            <Link href="/history">
              <a className={`${location === "/history" ? "text-primary" : "text-muted-foreground"}`}>
                {t("viewHistory")}
              </a>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <Avatar>
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" onClick={() => logoutMutation.mutate()}>
            {t("logout")}
          </Button>
        </div>
      </div>
    </nav>
  );
}