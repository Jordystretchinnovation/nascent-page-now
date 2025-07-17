
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Cookiebeleid = () => {
  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar homepage
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-8">
            Cookiebeleid van www.covarte.be
          </h1>
          
          <div className="prose prose-stone max-w-none">
            <p className="mb-6">
              Dit document informeert Gebruikers over de technologieën waarmee deze Applicatie de hieronder beschreven doelen kan bereiken. Met deze technologieën kan de Eigenaar in de loop van de tijd toegang krijgen tot informatie en informatie opslaan (bv. door een Cookie te gebruiken) of hulpprogramma's gebruiken (bv. door een script uit te voeren) op het apparaat van een Gebruiker tijdens de interactie met deze Applicatie.
            </p>
            
            <p className="mb-6">
              Om het eenvoudig te houden, worden al deze technologieën in dit document "Trackers" genoemd - tenzij er een reden is om onderscheid te maken. Hoewel Cookies bijvoorbeeld op zowel web- als mobiele browsers kunnen worden gebruikt, zou het onnauwkeurig zijn om over Cookies te praten in de context van mobiele apps, omdat cookies browsergebaseerde trackers zijn. Daarom wordt in dit document de term Cookies uitsluitend gebruikt om dat specifieke type Tracker aan te duiden.
            </p>
            
            <p className="mb-8">
              Bepaalde doelen waarvoor Trackers zijn geïnstalleerd, vereisen ook de toestemming van de Gebruiker. Na het geven van toestemming kan deze altijd vrijelijk worden ingetrokken volgens de instructies in dit document.
            </p>
            
            <h2 className="text-2xl font-semibold text-stone-800 mb-4">Zo gebruikt deze Applicatie Trackers</h2>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Noodzakelijke</h3>
            <p className="mb-6">
              Deze Applicatie gebruikt zogenoemde technische Cookies en andere vergelijkbare Trackers om activiteiten uit te voeren die strikt noodzakelijk zijn voor de werking of levering van de Dienst.
            </p>
            
            <h4 className="text-lg font-medium text-stone-700 mb-2">Trackers die door derden worden beheerd</h4>
            <div className="mb-6">
              <strong>Cloudflare (Cloudflare Inc.)</strong><br />
              Cloudflare is dienst voor optimalisatie en verdeling van verkeer die wordt aangeboden door Cloudflare Inc. De manier waarop Cloudflare is geïntegreerd, betekent dat deze alle verkeer via deze Applicatie filtert, i.e., communicatie tussen deze Applicatie en de browser van de Gebruiker, waarbij ook analysegegevens van deze Applicatie worden verzameld.<br />
              Verwerkte Persoonsgegevens: Trackers.<br />
              Verwerkingslocatie: VS – <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Privacybeleid</a>.<br />
              <br />
              Opslagduur van Trackers:<br />
              _cfuvid: onbepaald<br />
              cf_clearance: 30 minuten
            </div>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Ervaring</h3>
            <p className="mb-4">
              Deze Applicatie gebruikt Trackers om de kwaliteit van de gebruikerservaring te verbeteren en interactie met externe content, netwerken en platforms mogelijk te maken.
            </p>
            <div className="mb-6">
              <strong>Google Fonts (Google Ireland Limited)</strong><br />
              Google Fonts is een dienst voor de visualisering van lettertypes.<br />
              Verwerkte Persoonsgegevens: Gebruiksgegevens en Trackers.<br />
              Verwerkingslocatie: Ierland – <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Privacybeleid</a>.
            </div>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Meting</h3>
            <p className="mb-4">
              Deze Applicatie gebruikt Trackers om bezoeken te meten en gedrag van Gebruikers te analyseren om de Dienst te verbeteren.
            </p>
            <div className="mb-6">
              <strong>Google Analytics 4 (Google Ireland Limited)</strong><br />
              Verwerkte Persoonsgegevens: aantal Gebruikers, Gebruiksgegevens, sessiestatistieken en Trackers.<br />
              Opslagduur:<br />
              _ga: 2 jaar<br />
              ga*: 2 jaar<br />
              <br />
              <strong>Google Analytics (Universal Analytics)</strong><br />
              Verwerkte Persoonsgegevens: Gebruiksgegevens en Trackers.<br />
              Opslagduur:<br />
              AMP_TOKEN: 1 uur<br />
              _ga: 2 jaar<br />
              _gac*: 3 maanden<br />
              _gat: 1 minuut<br />
              _gid: 1 dag
            </div>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Marketing</h3>
            <p className="mb-4">
              Deze Applicatie gebruikt Trackers om gepersonaliseerde advertenties of marketingcontent te leveren en de prestaties ervan te meten.
            </p>
            <div className="mb-6">
              <strong>Meta ads conversietracking (Meta-pixel)</strong><br />
              Verwerkte Persoonsgegevens: Gebruiksgegevens en Trackers.<br />
              Opslagduur:<br />
              _fbc: 3 maanden<br />
              _fbp: 3 maanden<br />
              fr: 3 maanden<br />
              lastExternalReferrer: sessie<br />
              lastExternalReferrerTime: sessie<br />
              <br />
              <strong>Leadinfo (Leadinfo B.V.)</strong><br />
              Leadinfo is een B2B leadgeneratiedienst die inzicht geeft in welke bedrijven de website bezoeken, gebaseerd op IP-adressen.<br />
              Verwerkte Persoonsgegevens: IP-adres, bekeken pagina's, tijd en duur van het bezoek, herkomst van het bezoek.<br />
              Verwerkingslocatie: Nederland – <a href="https://www.leadinfo.com/nl/privacy/" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Privacybeleid</a>.<br />
              Opslagduur van Trackers: 2 jaar<br />
              <br />
              <strong>Microsoft Clarity (Microsoft Corporation)</strong><br />
              Microsoft Clarity is een analyse- en sessie-opnameservice die wordt aangeboden door Microsoft Corporation. De dienst helpt om gebruikersgedrag te begrijpen via heatmaps en opnames.<br />
              Verwerkte Persoonsgegevens: Gebruiksgegevens, sessie-informatie en Trackers.<br />
              Verwerkingslocatie: VS – <a href="https://privacy.microsoft.com/nl-nl/privacystatement" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Privacybeleid</a>.<br />
              Opslagduur van Trackers:<br />
              _clck: 1 jaar<br />
              _clsk: 1 dag
            </div>
            
            <h2 className="text-2xl font-semibold text-stone-800 mb-4">Voorkeuren beheren en toestemming geven of intrekken in deze Applicatie</h2>
            <p className="mb-4">
              Gebruikers kunnen hun toestemming geven of intrekken via het relevante voorkeurenpaneel. Ook kunnen cookies beheerd worden via browserinstellingen of via apparateninstellingen (voor mobiele apps).
            </p>
            <p className="mb-6">
              Zie: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Google Chrome</a>, <a href="https://support.mozilla.org/nl/kb/cookies-in-en-uitschakelen" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Mozilla Firefox</a>, <a href="https://support.apple.com/nl-be/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Safari</a>, <a href="https://support.microsoft.com/nl-be/help/4468242/microsoft-edge-browsing-data-and-privacy" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Microsoft Edge</a>
            </p>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Hoe u zich kunt afmelden voor op belangstelling gebaseerde advertenties</h3>
            <p className="mb-6">
              Zie <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">YourOnlineChoices</a>, <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Network Advertising Initiative</a>, <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">DAA</a>, enz.
            </p>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Gevolgen van het weigeren van Trackers</h3>
            <p className="mb-8">
              Zonder Trackers kunnen sommige functies van de Applicatie niet werken zoals bedoeld.
            </p>
            
            <h2 className="text-2xl font-semibold text-stone-800 mb-4">Eigenaar en Verwerkingsverantwoordelijke</h2>
            <div className="mb-8 p-4 bg-stone-100 rounded-lg">
              <strong>Covarte</strong><br />
              De Laetstraat 6<br />
              2845 Niel<br />
              E-mail: info@covarte.be<br />
              Telefoon: 03 432 01 00
            </div>
            
            <p className="mb-6">
              Aangezien het gebruik van Trackers van derden door deze Applicatie niet volledig door de Eigenaar kan worden gecontroleerd, zijn de specifieke verwijzingen naar Trackers van derden slechts een indicatie. Voor volledige informatie hierover, vragen wij de Gebruikers het privacybeleid te raadplegen van de betreffende externe diensten die in dit document zijn genoemd.
            </p>
            
            <p className="mb-8">
              Gezien de objectieve complexiteit rond tracking-technologieën raden we Gebruikers aan contact op te nemen met de Eigenaar als zij nadere informatie wensen te ontvangen over het gebruik van deze technologieën door deze Applicatie.
            </p>
            
            <h2 className="text-2xl font-semibold text-stone-800 mb-4">Definities en juridisch kader</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <strong>Persoonsgegevens (of Gegevens)</strong><br />
                Alle gegevens die direct, indirect of in verband met andere gegevens - waaronder een persoonlijk identificatienummer - de identificatie of identificeerbaarheid van een natuurlijke persoon mogelijk maken.
              </div>
              
              <div>
                <strong>Gebruiksgegevens</strong><br />
                Informatie die automatisch wordt verzameld vanuit deze Applicatie (of externe diensten die worden ingezet in deze Applicatie), waaronder: de IP-adressen of domeinnamen van de computers die door de Gebruikers van deze Applicatie worden gebruikt, de URI-adressen (Uniform Resource Identifier), het tijdstip van het verzoek, de gebruikte methode om het verzoek in te dienen bij de server, de grootte van het als reactie hierop ontvangen bestand, de numerieke code die de status van het antwoord van de server aangeeft (geslaagd, fout, enz.), het land van oorsprong, de functies van de browser en het besturingssysteem van de Gebruiker, de verschillende tijdsgegevens per bezoek (zoals de tijd die op elke pagina van de applicatie wordt doorgebracht) en de gegevens over het gevolgde pad binnen de applicatie, in het bijzonder gericht op de volgorde van de bezochte pagina's en andere parameters over het besturingssysteem van het apparaat en/of de IT-omgeving van de Gebruiker.
              </div>
              
              <div>
                <strong>Gebruiker</strong><br />
                De persoon die gebruikmaakt van deze Applicatie die, tenzij anders is aangegeven, samenvalt met de Betrokkene.
              </div>
              
              <div>
                <strong>Betrokkene</strong><br />
                De natuurlijke persoon op wie de Persoonsgegevens betrekking hebben.
              </div>
              
              <div>
                <strong>Gegevensverwerker (of Verwerker)</strong><br />
                De natuurlijke of rechtspersoon, overheidsinstantie, dienst of ander orgaan die namens de Verwerker Persoonsgegevens verwerkt, zoals beschreven in dit privacybeleid.
              </div>
              
              <div>
                <strong>Verwerkingsverantwoordelijke (of Eigenaar)</strong><br />
                De natuurlijke of rechtspersoon, overheidsinstantie, dienst of ander orgaan die, alleen of samen met anderen, het doel van en de middelen voor de verwerking van Persoonsgegevens vaststelt, met inbegrip van de beveiligingsmaatregelen met betrekking tot de werking en het gebruik van deze Applicatie. De Verwerkingsverantwoordelijke is de Eigenaar van deze Applicatie, tenzij anderszins wordt aangegeven.
              </div>
              
              <div>
                <strong>Deze Applicatie</strong><br />
                De middelen waarmee de Persoonsgegevens van de Gebruiker worden verzameld of verwerkt.
              </div>
              
              <div>
                <strong>Dienst</strong><br />
                De Dienst die wordt aangeboden door deze Applicatie zoals beschreven in de betreffende voorwaarden (indien beschikbaar) en op deze site/applicatie.
              </div>
              
              <div>
                <strong>Europese Unie (of EU)</strong><br />
                Tenzij anders aangegeven, omvatten alle verwijzingen in dit document naar de Europese Unie alle huidige lidstaten van de Europese Unie en de Europese Economische Ruimte.
              </div>
              
              <div>
                <strong>Cookies</strong><br />
                Cookies zijn Trackers die bestaan uit kleine gegevenssets die in de browser van de Gebruiker worden opgeslagen.
              </div>
              
              <div>
                <strong>Tracker</strong><br />
                Onder Tracker worden alle technologieën verstaan - bv. Cookies, unieke identificaties, webbakens, ingebedde scripts, e-tags en fingerprinting - waarmee Gebruikers gevolgd kunnen worden, bv. door toegang tot of het opslaan van informatie op het apparaat van de Gebruiker.
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Juridische informatie</h3>
            <p className="mb-4">
              Dit privacybeleid heeft uitsluitend betrekking op deze Applicatie, tenzij anders vermeld in dit document.
            </p>
            
            <p className="text-sm text-stone-600 mb-4">
              Meest recente update: 6 juni 2025
            </p>
            
            <p className="text-sm text-stone-500">
              Dit document is gemaakt met de Privacybeleid- en Cookiebeleid-generator van iubenda. Zie ook de Algemene voorwaarden-generator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookiebeleid;
