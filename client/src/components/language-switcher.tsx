import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem("i18nextLng");
    if (savedLang && languages.some(lang => lang.code === savedLang)) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("i18nextLng", langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
