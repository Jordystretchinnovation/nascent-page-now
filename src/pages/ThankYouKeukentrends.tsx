
import { useEffect, useState } from "react";

const ThankYouKeukentrends = () => {
  const [utmParams, setUtmParams] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: ""
  });

  useEffect(() => {
    // Capture UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const capturedUtms = {
      utm_source: urlParams.get('utm_source') || "",
      utm_medium: urlParams.get('utm_medium') || "",
      utm_campaign: urlParams.get('utm_campaign') || "",
      utm_term: urlParams.get('utm_term') || "",
      utm_content: urlParams.get('utm_content') || ""
    };
    setUtmParams(capturedUtms);
    
    console.log('Thank you page - Captured UTM parameters:', capturedUtms);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      {/* Hidden UTM fields for tracking */}
      <div className="hidden">
        <input type="hidden" name="utm_source" value={utmParams.utm_source} />
        <input type="hidden" name="utm_medium" value={utmParams.utm_medium} />
        <input type="hidden" name="utm_campaign" value={utmParams.utm_campaign} />
        <input type="hidden" name="utm_term" value={utmParams.utm_term} />
        <input type="hidden" name="utm_content" value={utmParams.utm_content} />
      </div>

      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm">
          {/* Covarte Logo */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/89e030a6-df2f-49fe-8523-9de6dfe82f8b.png" 
              alt="Covarte Logo" 
              className="h-8 w-auto mx-auto" 
            />
          </div>
          
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          {/* Thank You Message */}
          <h1 className="font-heading text-3xl md:text-4xl text-stone-800 mb-6">
            Bedankt voor je aanvraag!
          </h1>
          
          <p className="font-body text-lg text-stone-600 mb-8 leading-relaxed">
            Je ontvangt de <strong>Keukentrends 2025 e-guide</strong> binnen enkele minuten per e-mail. 
            Check ook je spam-map voor het geval de e-mail daar terechtkomt.
          </p>
          
          <div className="bg-stone-50 rounded-xl p-6 mb-8">
            <h3 className="font-heading text-xl text-stone-800 mb-3">
              Wat kun je verwachten?
            </h3>
            <ul className="font-body text-stone-600 space-y-2">
              <li>• Inzicht in de nieuwste keukentrends voor 2025</li>
              <li>• Inspiratie voor moderne keukenontwerpen</li>
              <li>• Tips van professionals uit de keukenbranche</li>
              <li>• Praktische voorbeelden en toepassingen</li>
            </ul>
          </div>
          
          {/* CTA Button */}
          <div className="space-y-4">
            <a 
              href="https://www.covarte.be?utm_source=referral&utm_medium=landingspagina&utm_campaign=stretch" 
              className="inline-flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Bezoek onze website
            </a>
            <p className="font-body text-sm text-stone-500">
              Of neem direct contact met ons op voor persoonlijk advies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouKeukentrends;
