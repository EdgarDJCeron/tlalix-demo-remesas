import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { config } from "@/config/wagmi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PatternDivider } from "@/components/PatternDivider";
import Home from "./pages/Home";
import Enviar from "./pages/Enviar";
import Recibir from "./pages/Recibir";
import Historial from "./pages/Historial";
import Retiro from "./pages/Retiro";
import Empresas from "./pages/Empresas";
import ComoFunciona from "./pages/ComoFunciona";
import Comercio from "./pages/Comercio";
import NotFound from "./pages/NotFound";

import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <RainbowKitProvider theme={darkTheme()}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div 
            className="flex flex-col min-h-screen w-full"
            style={{ backgroundColor: 'hsl(var(--color-azul-marino))' }}
          >
            <Navbar />
            <PatternDivider />
            
            <main className="flex-1 flex justify-center relative overflow-hidden">
              {/* Patrón lateral izquierdo */}
              <div
                className="absolute top-0 left-0 w-[50px] h-full z-[5] opacity-60 hidden md:block animate-float"
                style={{
                  backgroundImage: 'url(/images/pattern-triangulos.png)',
                  backgroundRepeat: 'repeat-y',
                  backgroundSize: '100% auto',
                  animationDuration: '4s'
                }}
              />
              
              {/* Contenido principal */}
              <div className="w-full max-w-[1200px] flex flex-col z-10 p-0">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/enviar" element={<Enviar />} />
                  <Route path="/recibir" element={<Recibir />} />
                  <Route path="/historial" element={<Historial />} />
                  <Route path="/retiro" element={<Retiro />} />
                  <Route path="/empresas" element={<Empresas />} />
                  <Route path="/como-funciona" element={<ComoFunciona />} />
                  <Route path="/comercio" element={<Comercio />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              
              {/* Patrón lateral derecho */}
              <div
                className="absolute top-0 right-0 w-[50px] h-full z-[5] opacity-60 hidden md:block animate-float"
                style={{
                  backgroundImage: 'url(/images/pattern-triangulos2.png)',
                  backgroundRepeat: 'repeat-y',
                  backgroundSize: '100% auto',
                  animationDuration: '5s',
                  animationDelay: '1s'
                }}
              />
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
