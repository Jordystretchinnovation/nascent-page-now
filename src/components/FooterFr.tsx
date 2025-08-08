
import { Link } from "react-router-dom";

const FooterFr = () => {
  return (
    <footer className="bg-stone-800 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Company Info */}
          <div className="md:col-span-2">
            <img 
              src="/lovable-uploads/89e030a6-df2f-49fe-8523-9de6dfe82f8b.png" 
              alt="Covarte Logo" 
              className="h-8 w-auto mb-4" 
            />
            <p className="font-body text-stone-300 leading-relaxed mb-4">
              Découvrez la qualité de Covarte. 
              Fabriqués en Belgique avec 90 ans d'expertise.
            </p>
            <div className="text-stone-300">
              <p className="font-body mb-1">Coeck NV</p>
              <p className="font-body mb-1">Industriepark 1</p>
              <p className="font-body mb-1">2220 Heist-op-den-Berg</p>
              <p className="font-body">Belgique</p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/fr/echantillons-gratuits" className="font-body text-stone-300 hover:text-white transition-colors">
                  Échantillons gratuits
                </Link>
              </li>
              <li>
                <Link to="/fr/lookbook" className="font-body text-stone-300 hover:text-white transition-colors">
                  Collection Lookbook
                </Link>
              </li>
              <li>
                <Link to="/fr/reduction" className="font-body text-stone-300 hover:text-white transition-colors">
                  50% de réduction
                </Link>
              </li>
              <li>
                <Link to="/fr/politique-cookies" className="font-body text-stone-300 hover:text-white transition-colors">
                  Politique de cookies
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.iubenda.com/privacy-policy/59860343" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-body text-stone-300 hover:text-white transition-colors"
                >
                  Privacy policy
                </a>
              </li>
              <li>
                <a 
                  href="https://www.iubenda.com/privacy-policy/59860343/cookie-policy" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-body text-stone-300 hover:text-white transition-colors"
                >
                  Cookie policy
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg mb-4">Contact</h4>
            <div className="space-y-2 text-stone-300">
              <p className="font-body">+32 15 25 72 80</p>
              <p className="font-body">info@covarte.be</p>
              <p className="font-body">www.covarte.be</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-stone-700 mt-8 pt-8 text-center">
          <p className="font-body text-stone-400">
            © 2024 Covarte by Coeck. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterFr;
