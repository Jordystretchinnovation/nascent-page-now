
import { Facebook, Instagram, Linkedin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white py-12 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-6">
          <img 
            src="/lovable-uploads/89e030a6-df2f-49fe-8523-9de6dfe82f8b.png" 
            alt="Covarte Logo" 
            className="h-8 md:h-10 w-auto mx-auto mb-4" 
          />
        </div>
        
        <p className="font-body text-stone-400 mb-8">Topkwaliteit keramische bladen aan een scherpe prijs.</p>
        
        <div className="font-body text-stone-300 space-y-2 mb-8">
          <p>De Laetstraat 6, 2845 Niel</p>
          <p>info@covarte.be</p>
          <p>T 03 432 01 00</p>
        </div>
        
        <div className="border-t border-stone-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-body text-stone-400 text-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://www.covarte.be/nl/disclaimer" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-stone-300 transition-colors"
                >
                  Disclaimer
                </a>
                <a 
                  href="http://www.covarte.be/sites/default/files/algemene_verkoopsvoorwaarden_nl.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-stone-300 transition-colors"
                >
                  Algemene verkoopsvoorwaarden
                </a>
                <a 
                  href="https://www.iubenda.com/privacy-policy/59860343" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-stone-300 transition-colors"
                >
                  Privacy policy
                </a>
                <a 
                  href="https://www.iubenda.com/privacy-policy/59860343/cookie-policy" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-stone-300 transition-colors"
                >
                  Cookie policy
                </a>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/Covarte/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-stone-400 hover:text-stone-300 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.pinterest.com/covarte/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-stone-400 hover:text-stone-300 transition-colors" 
                title="Pinterest"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.999-5.373 11.999-12C24 5.372 18.626.001 12.001.001z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/covarte" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-stone-400 hover:text-stone-300 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.instagram.com/covarte.be/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-stone-400 hover:text-stone-300 transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
