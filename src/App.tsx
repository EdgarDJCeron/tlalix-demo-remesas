import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { config } from "@/config/wagmi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "./pages/Home";
import Enviar from "./pages/Enviar";
import Recibir from "./pages/Recibir";
import Historial from "./pages/Historial";
import Retiro from "./pages/Retiro";
import Empresas from "./pages/Empresas";
import ComoFunciona from "./pages/ComoFunciona";
import NotFound from "./pages/NotFound";

import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <RainbowKitProvider
      theme={theme === "dark" ? darkTheme() : lightTheme()}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen w-full">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/enviar" element={<Enviar />} />
                <Route path="/recibir" element={<Recibir />} />
                <Route path="/historial" element={<Historial />} />
                <Route path="/retiro" element={<Retiro />} />
                <Route path="/empresas" element={<Empresas />} />
                <Route path="/como-funciona" element={<ComoFunciona />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </RainbowKitProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={config}>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </WagmiProvider>
  </QueryClientProvider>
);

export default App;
