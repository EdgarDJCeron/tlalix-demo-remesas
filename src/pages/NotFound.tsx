import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-jade/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="text-center relative z-10 px-4">
        <h1 className="mb-4 text-9xl font-black text-black tracking-tighter" style={{ fontFamily: 'Cinzel, serif' }}>404</h1>
        <p className="mb-8 text-2xl text-black/60 font-light italic" style={{ fontFamily: 'Caudex, serif' }}>
          Parece que te has desviado del camino al Mictlán.
        </p>
        <a href="/" className="inline-flex h-16 px-10 items-center justify-center bg-jade text-white font-black rounded-2xl shadow-xl shadow-jade/20 hover:scale-105 transition-all uppercase tracking-widest">
          Regresar al Inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;



