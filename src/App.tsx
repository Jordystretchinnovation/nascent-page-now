
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import CookieBanner from "@/components/CookieBanner";
import CookieBannerFr from "@/components/CookieBannerFr";
import Index from "./pages/Index";
import GratisStalen from "./pages/GratisStalen";
import Lookbook from "./pages/Lookbook";
import Keukentrends from "./pages/Keukentrends";
import Korting from "./pages/Korting";
import GratisStatenFr from "./pages/GratisStatenFr";
import LookbookFr from "./pages/LookbookFr";
import KeuketrendsFr from "./pages/KeuketrendsFr";
import KortingFr from "./pages/KortingFr";
import NotFound from "./pages/NotFound";
import ThankYouStalen from "./pages/ThankYouStalen";
import ThankYouCollectionLookbook from "./pages/ThankYouCollectionLookbook";
import ThankYouKeukentrends from "./pages/ThankYouKeukentrends";
import ThankYouKorting from "./pages/ThankYouKorting";
import ThankYouStalenFr from "./pages/ThankYouStalenFr";
import ThankYouCollectionLookbookFr from "./pages/ThankYouCollectionLookbookFr";
import ThankYouKeuketrendsFr from "./pages/ThankYouKeuketrendsFr";
import ThankYouKortingFr from "./pages/ThankYouKortingFr";
import Cookiebeleid from "./pages/Cookiebeleid";
import PolitiqueCookies from "./pages/PolitiqueCookies";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const CookieBannerWrapper = () => {
  const location = useLocation();
  const isFrenchPage = location.pathname.startsWith('/fr/');
  
  return isFrenchPage ? <CookieBannerFr /> : <CookieBanner />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gratis-stalen" element={<GratisStalen />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/keukentrends" element={<Keukentrends />} />
          <Route path="/korting" element={<Korting />} />
          <Route path="/fr/echantillons-gratuits" element={<GratisStatenFr />} />
          <Route path="/fr/lookbook" element={<LookbookFr />} />
          <Route path="/fr/tendances-cuisine" element={<KeuketrendsFr />} />
          <Route path="/fr/reduction" element={<KortingFr />} />
          <Route path="/cookiebeleid" element={<Cookiebeleid />} />
          <Route path="/fr/politique-cookies" element={<PolitiqueCookies />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/thank-you/stalen" element={<ThankYouStalen />} />
          <Route path="/thank-you/collection-lookbook" element={<ThankYouCollectionLookbook />} />
          <Route path="/thank-you/keukentrends" element={<ThankYouKeukentrends />} />
          <Route path="/thank-you/korting" element={<ThankYouKorting />} />
          <Route path="/fr/merci/echantillons" element={<ThankYouStalenFr />} />
          <Route path="/fr/merci/collection-lookbook" element={<ThankYouCollectionLookbookFr />} />
          <Route path="/fr/merci/tendances-cuisine" element={<ThankYouKeuketrendsFr />} />
          <Route path="/fr/merci/reduction" element={<ThankYouKortingFr />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBannerWrapper />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
