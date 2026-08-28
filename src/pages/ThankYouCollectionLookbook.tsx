
import { useEffect, useRef } from "react";
import { CheckCircle, Download } from "lucide-react";
import renderboekAsset from "@/assets/covarte-renderboek-2026.pdf.asset.json";

const FILE_NAME = "Covarte-Renderboek-2026.pdf";

const ThankYouCollectionLookbook = () => {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const timer = window.setTimeout(() => {
      const link = document.createElement("a");
      link.href = renderboekAsset.url;
      link.download = FILE_NAME;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 800);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-2xl font-light text-stone-800 mb-4">
            Bedankt voor je aanvraag!
          </h1>
          <p className="text-stone-600 mb-6 leading-relaxed">
            Je download start automatisch. Gebeurt er niets? Klik dan hieronder om
            het Renderboek 2026 te downloaden.
          </p>
          <a
            href={renderboekAsset.url}
            download={FILE_NAME}
            className="inline-flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-medium py-3 px-8 rounded-lg transition-colors w-full mb-3"
          >
            <Download className="w-5 h-5" />
            Download het Renderboek 2026
          </a>
          <a
            href="https://www.covarte.be?utm_source=referral&utm_medium=landingspagina&utm_campaign=stretch"
            className="inline-flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-white font-medium py-3 px-8 rounded-lg transition-colors w-full"
          >
            Bezoek onze website
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThankYouCollectionLookbook;
