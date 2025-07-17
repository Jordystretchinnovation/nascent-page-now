
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PolitiqueCookies = () => {
  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          to="/fr/echantillons-gratuits" 
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-8">
            Politique de cookies de www.covarte.be
          </h1>
          
          <div className="prose prose-stone max-w-none">
            <p className="mb-6">
              Ce document informe les Utilisateurs sur les technologies qui permettent à cette Application d'atteindre les objectifs décrits ci-dessous. Ces technologies permettent au Propriétaire d'accéder à des informations et de stocker des informations (par exemple en utilisant un Cookie) ou d'utiliser des ressources (par exemple en exécutant un script) sur l'appareil d'un Utilisateur lors de l'interaction avec cette Application.
            </p>
            
            <p className="mb-6">
              Pour des raisons de simplicité, toutes ces technologies sont appelées "Trackers" dans ce document - sauf s'il y a une raison de faire une distinction. Par exemple, bien que les Cookies puissent être utilisés dans les navigateurs web et mobiles, il serait inexact de parler de Cookies dans le contexte des applications mobiles car ils sont des trackers basés sur navigateur. Par conséquent, dans ce document, le terme Cookies n'est utilisé que pour désigner spécifiquement ce type de Tracker.
            </p>
            
            <p className="mb-8">
              Certains des objectifs pour lesquels les Trackers sont installés peuvent également nécessiter le consentement de l'Utilisateur. Lorsque le consentement est donné, il peut être librement retiré à tout moment selon les instructions fournies dans ce document.
            </p>
            
            <h2 className="text-2xl font-semibold text-stone-800 mb-4">Comment cette Application utilise les Trackers</h2>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Nécessaires</h3>
            <p className="mb-6">
              Cette Application utilise des Cookies dits techniques et d'autres Trackers similaires pour mener des activités strictement nécessaires au fonctionnement ou à la fourniture du Service.
            </p>
            
            <h4 className="text-lg font-medium text-stone-700 mb-2">Trackers gérés par des tiers</h4>
            <div className="mb-6">
              <strong>Cloudflare (Cloudflare Inc.)</strong><br />
              Cloudflare est un service d'optimisation et de distribution du trafic fourni par Cloudflare Inc. La façon dont Cloudflare est intégré signifie qu'il filtre tout le trafic via cette Application, c'est-à-dire la communication entre cette Application et le navigateur de l'Utilisateur, tout en collectant également des données analytiques de cette Application.<br />
              Données personnelles traitées : Trackers.<br />
              Lieu de traitement : États-Unis – <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Politique de confidentialité</a>.<br />
              <br />
              Durée de stockage des Trackers :<br />
              _cfuvid : indéterminée<br />
              cf_clearance : 30 minutes
            </div>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Expérience</h3>
            <p className="mb-4">
              Cette Application utilise des Trackers pour améliorer la qualité de l'expérience utilisateur et permettre l'interaction avec du contenu, des réseaux et des plateformes externes.
            </p>
            <div className="mb-6">
              <strong>Google Fonts (Google Ireland Limited)</strong><br />
              Google Fonts est un service de visualisation de polices de caractères.<br />
              Données personnelles traitées : Données d'utilisation et Trackers.<br />
              Lieu de traitement : Irlande – <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Politique de confidentialité</a>.
            </div>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Mesure</h3>
            <p className="mb-4">
              Cette Application utilise des Trackers pour mesurer les visites et analyser le comportement des Utilisateurs afin d'améliorer le Service.
            </p>
            <div className="mb-6">
              <strong>Google Analytics 4 (Google Ireland Limited)</strong><br />
              Données personnelles traitées : nombre d'Utilisateurs, Données d'utilisation, statistiques de session et Trackers.<br />
              Durée de stockage :<br />
              _ga : 2 ans<br />
              ga* : 2 ans<br />
              <br />
              <strong>Google Analytics (Universal Analytics)</strong><br />
              Données personnelles traitées : Données d'utilisation et Trackers.<br />
              Durée de stockage :<br />
              AMP_TOKEN : 1 heure<br />
              _ga : 2 ans<br />
              _gac* : 3 mois<br />
              _gat : 1 minute<br />
              _gid : 1 jour
            </div>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Marketing</h3>
            <p className="mb-4">
              Cette Application utilise des Trackers pour fournir du contenu publicitaire ou marketing personnalisé et mesurer ses performances.
            </p>
            <div className="mb-6">
              <strong>Suivi des conversions publicitaires Meta (Meta-pixel)</strong><br />
              Données personnelles traitées : Données d'utilisation et Trackers.<br />
              Durée de stockage :<br />
              _fbc : 3 mois<br />
              _fbp : 3 mois<br />
              fr : 3 mois<br />
              lastExternalReferrer : session<br />
              lastExternalReferrerTime : session<br />
              <br />
              <strong>Leadinfo (Leadinfo B.V.)</strong><br />
              Leadinfo est un service de génération de leads B2B qui fournit des informations sur les entreprises qui visitent le site web, basé sur les adresses IP.<br />
              Données personnelles traitées : Adresse IP, pages consultées, heure et durée de la visite, origine de la visite.<br />
              Lieu de traitement : Pays-Bas – <a href="https://www.leadinfo.com/nl/privacy/" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Politique de confidentialité</a>.<br />
              Durée de stockage des Trackers : 2 ans<br />
              <br />
              <strong>Microsoft Clarity (Microsoft Corporation)</strong><br />
              Microsoft Clarity est un service d'analyse et d'enregistrement de session fourni par Microsoft Corporation. Le service aide à comprendre le comportement des utilisateurs via des cartes de chaleur et des enregistrements.<br />
              Données personnelles traitées : Données d'utilisation, informations de session et Trackers.<br />
              Lieu de traitement : États-Unis – <a href="https://privacy.microsoft.com/nl-nl/privacystatement" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Politique de confidentialité</a>.<br />
              Durée de stockage des Trackers :<br />
              _clck : 1 an<br />
              _clsk : 1 jour
            </div>
            
            <h2 className="text-2xl font-semibold text-stone-800 mb-4">Gérer les préférences et donner ou retirer le consentement dans cette Application</h2>
            <p className="mb-4">
              Les utilisateurs peuvent donner ou retirer leur consentement via le panneau de préférences pertinent. Les cookies peuvent également être gérés via les paramètres du navigateur ou via les paramètres de l'appareil (pour les applications mobiles).
            </p>
            <p className="mb-6">
              Voir : <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Google Chrome</a>, <a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Mozilla Firefox</a>, <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Safari</a>, <a href="https://support.microsoft.com/fr-fr/help/4468242/microsoft-edge-browsing-data-and-privacy" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Microsoft Edge</a>
            </p>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Comment se désinscrire de la publicité basée sur les intérêts</h3>
            <p className="mb-6">
              Voir <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">YourOnlineChoices</a>, <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">Network Advertising Initiative</a>, <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-800 underline">DAA</a>, etc.
            </p>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Conséquences du refus des Trackers</h3>
            <p className="mb-8">
              Sans les Trackers, certaines fonctionnalités de l'Application peuvent ne pas fonctionner comme prévu.
            </p>
            
            <h2 className="text-2xl font-semibold text-stone-800 mb-4">Propriétaire et Responsable du traitement</h2>
            <div className="mb-8 p-4 bg-stone-100 rounded-lg">
              <strong>Covarte</strong><br />
              De Laetstraat 6<br />
              2845 Niel<br />
              E-mail : info@covarte.be<br />
              Téléphone : 03 432 01 00
            </div>
            
            <p className="mb-6">
              Étant donné que l'utilisation de Trackers tiers par cette Application ne peut pas être entièrement contrôlée par le Propriétaire, les références spécifiques aux Trackers tiers ne sont qu'indicatives. Pour des informations complètes à ce sujet, nous demandons aux Utilisateurs de consulter la politique de confidentialité des services tiers respectifs énumérés dans ce document.
            </p>
            
            <p className="mb-8">
              Compte tenu de la complexité objective des technologies de suivi, nous encourageons les Utilisateurs à contacter le Propriétaire s'ils souhaitent recevoir des informations supplémentaires sur l'utilisation de ces technologies par cette Application.
            </p>
            
            <h2 className="text-2xl font-semibold text-stone-800 mb-4">Définitions et cadre juridique</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <strong>Données personnelles (ou Données)</strong><br />
                Toute information qui, directement, indirectement ou en relation avec d'autres informations - y compris un numéro d'identification personnel - permet l'identification ou l'identifiabilité d'une personne physique.
              </div>
              
              <div>
                <strong>Données d'utilisation</strong><br />
                Informations collectées automatiquement via cette Application (ou services tiers employés dans cette Application), incluant : les adresses IP ou noms de domaine des ordinateurs utilisés par les Utilisateurs de cette Application, les adresses URI (Uniform Resource Identifier), l'heure de la demande, la méthode utilisée pour soumettre la demande au serveur, la taille du fichier reçu en réponse, le code numérique indiquant le statut de la réponse du serveur (succès, erreur, etc.), le pays d'origine, les caractéristiques du navigateur et du système d'exploitation de l'Utilisateur, les divers détails temporels par visite et les données concernant l'itinéraire suivi dans l'application, particulièrement l'ordre des pages visitées et autres paramètres sur le système d'exploitation de l'appareil et/ou l'environnement informatique de l'Utilisateur.
              </div>
              
              <div>
                <strong>Utilisateur</strong><br />
                La personne utilisant cette Application qui, sauf indication contraire, coïncide avec la Personne concernée.
              </div>
              
              <div>
                <strong>Personne concernée</strong><br />
                La personne physique à laquelle se rapportent les Données personnelles.
              </div>
              
              <div>
                <strong>Sous-traitant (ou Processeur)</strong><br />
                La personne physique ou morale, autorité publique, service ou autre organisme qui traite les Données personnelles pour le compte du Responsable du traitement, comme décrit dans cette politique de confidentialité.
              </div>
              
              <div>
                <strong>Responsable du traitement (ou Propriétaire)</strong><br />
                La personne physique ou morale, autorité publique, service ou autre organisme qui, seul ou conjointement avec d'autres, détermine les finalités et les moyens du traitement des Données personnelles, y compris les mesures de sécurité concernant le fonctionnement et l'utilisation de cette Application. Le Responsable du traitement est le Propriétaire de cette Application, sauf indication contraire.
              </div>
              
              <div>
                <strong>Cette Application</strong><br />
                Les moyens par lesquels les Données personnelles de l'Utilisateur sont collectées et traitées.
              </div>
              
              <div>
                <strong>Service</strong><br />
                Le Service fourni par cette Application tel que décrit dans les conditions relatives (si disponibles) et sur ce site/application.
              </div>
              
              <div>
                <strong>Union européenne (ou UE)</strong><br />
                Sauf indication contraire, toutes les références dans ce document à l'Union européenne incluent tous les États membres actuels de l'Union européenne et de l'Espace économique européen.
              </div>
              
              <div>
                <strong>Cookies</strong><br />
                Les Cookies sont des Trackers constitués de petits ensembles de données stockés dans le navigateur de l'Utilisateur.
              </div>
              
              <div>
                <strong>Tracker</strong><br />
                Le terme Tracker désigne toute technologie - par exemple les Cookies, identifiants uniques, balises web, scripts intégrés, e-tags et empreinte digitale - qui permet de suivre les Utilisateurs, par exemple en accédant ou en stockant des informations sur l'appareil de l'Utilisateur.
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Informations juridiques</h3>
            <p className="mb-4">
              Cette politique de confidentialité concerne uniquement cette Application, sauf indication contraire dans ce document.
            </p>
            
            <p className="text-sm text-stone-600 mb-4">
              Dernière mise à jour : 13 juin 2025
            </p>
            
            <p className="text-sm text-stone-500">
              Ce document a été créé avec le générateur de Politique de confidentialité et de Politique de cookies d'iubenda. Voir également le générateur de Conditions générales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolitiqueCookies;
