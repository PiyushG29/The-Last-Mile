import { BatteryCharging } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-border/60 bg-background/85 px-4 py-8 backdrop-blur-xl">
      <div className="container mx-auto flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-gradient-primary text-primary-foreground shadow-glow-primary">
            <BatteryCharging className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold">The Last Mile</p>
            <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>{t("footer.copyright")}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
