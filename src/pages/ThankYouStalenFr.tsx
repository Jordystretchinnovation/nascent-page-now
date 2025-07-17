import { CheckCircle } from "lucide-react";
const ThankYouStalenFr = () => {
  return <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-2xl font-light text-stone-800 mb-4">
            Merci pour votre demande !
          </h1>
          <p className="text-stone-600 mb-6 leading-relaxed">Votre pack d’échantillons est en route ! 
Nous vous contacterons dans les 24 heures pour confirmer l'expédition.</p>
          <a href="https://www.covarte.be?utm_source=referral&utm_medium=landingspagina&utm_campaign=stretch" className="inline-flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-white font-medium py-3 px-8 rounded-lg transition-colors w-full">
            Visitez notre site web
          </a>
        </div>
      </div>
    </div>;
};
export default ThankYouStalenFr;