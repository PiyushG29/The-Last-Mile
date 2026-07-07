import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/theme-toggle";
import { MarqueeBanner } from "@/components/marquee-banner";
import { History, LogOut, MapPin, Share2 } from "lucide-react";
import rickshawGif from "@/pages/assets/rickshaw.gif";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const { t } = useTranslation();

  if (!user || location === "/auth") return null;

  return (
    <>
      <MarqueeBanner />
      <nav className="fixed left-0 right-0 top-[27px] z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex min-w-0 items-center space-x-5 md:space-x-8">
            <Link href="/">
              <a className="flex items-center gap-2 font-display text-lg font-bold text-foreground md:text-xl">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white shadow-glow-primary ring-1 ring-primary/15">
                  <img src={rickshawGif} alt="" className="h-7 w-7 object-contain" />
                </span>
                <span className="hidden sm:inline">
                  The <span className="text-gradient-primary">Last Mile</span>
                </span>
              </a>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              <Link href="/book">
                <a
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    location === "/book"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  {t("bookNow")}
                </a>
              </Link>
              <Link href="/chat">
                <a
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    location === "/chat"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <Share2 className="h-4 w-4" />
                  {t("nav.chat")}
                </a>
              </Link>
              <Link href="/history">
                <a
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    location === "/history"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <History className="h-4 w-4" />
                  {t("viewHistory")}
                </a>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <Avatar className="border border-border/60 bg-secondary/60">
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="hidden gap-2 hover:bg-destructive/10 hover:text-destructive sm:inline-flex"
            >
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
