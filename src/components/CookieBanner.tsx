
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Helper function to get cookie value
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // Helper function to set cookie with expiration
  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  useEffect(() => {
    // Check if user has explicitly accepted cookies
    const cookieConsent = getCookie('cookieConsent');
    
    // Only hide banner if user has explicitly accepted
    if (cookieConsent !== 'accepted') {
      setIsVisible(true);
      
      // Send default denied consent to Google Tag Manager on page load
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'consent_update',
          ad_storage: 'denied',
          analytics_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          personalization_storage: 'denied',
          functionality_storage: 'denied',
          security_storage: 'denied'
        });
      }
    }
  }, []);

  const handleAccept = () => {
    // Set cookie with 12 months expiration (365 days)
    setCookie('cookieConsent', 'accepted', 365);
    
    // Send consent to Google Tag Manager with all consent types granted
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'consent_update',
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        personalization_storage: 'granted',
        functionality_storage: 'granted',
        security_storage: 'granted'
      });
    }
    
    setIsVisible(false);
  };

  const handleDecline = () => {
    // DON'T save a cookie when declining - banner will show again on next visit
    
    // Send decline to Google Tag Manager with all consent types denied
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'consent_update',
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        personalization_storage: 'denied',
        functionality_storage: 'denied',
        security_storage: 'denied'
      });
    }
    
    // Hide banner for current session only
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-lg z-50 p-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-stone-700 leading-relaxed mb-2">
            We gebruiken cookies om je ervaring te verbeteren en om marketingdoeleinden. 
            Door op "Accepteren" te klikken, stem je in met het gebruik van alle cookies. 
            Je kunt je voorkeuren altijd wijzigen in de instellingen.
          </p>
          <Link 
            to="/cookiebeleid" 
            className="text-xs text-stone-500 hover:text-stone-700 underline transition-colors"
          >
            Meer informatie over ons cookiebeleid
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDecline}
            className="text-stone-600 border-stone-300 hover:bg-stone-50"
          >
            Weigeren
          </Button>
          <Button 
            size="sm" 
            onClick={handleAccept}
            className="bg-stone-800 hover:bg-stone-700 text-white"
          >
            Accepteren
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
