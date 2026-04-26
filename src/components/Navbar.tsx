import { Link, useLocation } from "react-router-dom";
import { Globe, ChevronDown, Send, Download, History, Store, Info, Briefcase, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { WalletButton } from "@/components/WalletButton";
import AliasDisplay from "@/components/AliasDisplay";
import { t } from "@/lib/i18n";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";

export const Navbar = () => {
  const { lang, setLang } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-2xl">
      <div className="container mx-auto px-16 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center group">
            <img 
              src="/logo.png" 
              alt="Tlalix Logo" 
              className="h-10 w-10 object-contain brightness-0 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
            />
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-black/50 hover:text-black hover:bg-black/5 data-[state=open]:text-black data-[state=open]:bg-black/5 text-sm font-bold uppercase tracking-widest px-4 h-10 rounded-xl transition-all">
                  {lang === "es" ? "Clientes" : "Clients"}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-6 bg-white border border-black/5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    <ListItem 
                      to="/enviar" 
                      title={lang === "es" ? "Enviar Dinero" : "Send Money"}
                      icon={<Send className="h-5 w-5 text-jade" />}
                    >
                      {lang === "es" ? "Transfiere fondos instantáneamente a cualquier parte de México." : "Transfer funds instantly to anywhere in Mexico."}
                    </ListItem>
                    <ListItem 
                      to="/recibir" 
                      title={lang === "es" ? "Recibir Remesa" : "Receive Remittance"}
                      icon={<Download className="h-5 w-5 text-oro" />}
                    >
                      {lang === "es" ? "Reclama tus fondos de forma segura con tu código confidencial." : "Claim your funds securely with your confidential code."}
                    </ListItem>
                    <ListItem 
                      to="/historial" 
                      title={lang === "es" ? "Historial" : "History"}
                      icon={<History className="h-5 w-5 text-black/60" />}
                    >
                      {lang === "es" ? "Consulta el rastro de todos tus viajes financieros." : "Check the trail of all your financial journeys."}
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/retiro">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-black/50 hover:text-black hover:bg-black/5 text-sm font-bold uppercase tracking-widest px-4 h-10 rounded-xl transition-all", isActive("/retiro") && "text-black bg-black/5")}>
                    {lang === "es" ? "Puntos" : "Points"}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/empresas">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-black/50 hover:text-black hover:bg-black/5 text-sm font-bold uppercase tracking-widest px-4 h-10 rounded-xl transition-all", isActive("/empresas") && "text-black bg-black/5")}>
                    {lang === "es" ? "Empresas" : "Business"}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/como-funciona">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-black/50 hover:text-black hover:bg-black/5 text-sm font-bold uppercase tracking-widest px-4 h-10 rounded-xl transition-all", isActive("/como-funciona") && "text-black bg-black/5")}>
                    {lang === "es" ? "Guía" : "Guide"}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden xl:block">
            <AliasDisplay />
          </div>
          
          <WalletButton />

          <div className="h-8 w-px bg-black/10 hidden md:block" />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="rounded-xl bg-black/5 border border-black/10 text-black hover:bg-black/10 transition-all h-10 w-10"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string; icon: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "flex gap-4 select-none rounded-xl p-4 leading-none no-underline outline-none transition-all hover:bg-black/5 focus:bg-black/5 group",
            className
          )}
          {...props}
        >
          <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <div className="space-y-1">
            <div className="text-sm font-black text-black leading-none tracking-tight group-hover:text-jade transition-colors">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-black/60 font-medium">
              {children}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";


