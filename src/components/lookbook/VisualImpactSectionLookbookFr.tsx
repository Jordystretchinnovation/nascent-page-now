import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
const VisualImpactSectionLookbookFr = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const handleVideoToggle = () => {
    const video = document.getElementById('covarte-video') as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  return <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl mb-12 text-center text-stone-800 w-3/4 mx-auto">Offrez à vos clients l’expérience d’un matériau d’exception </h2>
        
        {/* Hero Kitchen Image */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-3xl shadow-lg">
            <img src="/lovable-uploads/45383296-94d8-4a21-ab9f-2693927c4c0d.png" alt="Moderne keuken met Covarte keramische werkblad" className="w-full h-[400px] md:h-[500px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="font-heading mb-2 text-3xl">La perfection dans les moindres details</h3>
              <p className="font-body text-stone-200">
                Finition artisanale, durable et intemporelle. Des plans de travail en céramique conçus pour durer des générations.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1">
            <h3 className="font-heading mb-6 text-stone-800 text-3xl">
              Un savoir-faire qui se voit et se sent
            </h3>
            <p className="font-body text-stone-600 leading-relaxed mb-6">
              Chaque plan de travail est fini à la main dans nos ateliers belges. Aucune ligne de coupe visible, aucun compromis sur la qualité. C'est ce que les meilleurs cuisinistes attendent de nous.
            </p>
            <p className="font-body text-stone-600 leading-relaxed">
              Des designs modernes et minimalistes aux ambiances chaleureuses et naturelles, nos plans de travail en céramique s'adaptent à tous les styles et dépassent toutes les attentes.
            </p>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <img alt="Vakmanschap dat je ziet en voelt" className="w-full h-[350px] object-cover" src="/lovable-uploads/364225d6-e44e-479c-8335-83ae4fdad1c2.jpg" />
            </div>
          </div>
        </div>
        
        {/* Craftsmanship Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <img src="/lovable-uploads/347fd1ad-68a2-4c16-ac21-687ee00ddcd3.png" alt="Vakman aan het werk in Covarte atelier" className="w-full h-[350px] object-cover" />
            </div>
          </div>
          
          <div>
            <h3 className="font-heading mb-6 text-stone-800 text-3xl">
              90 ans de savoir-faire belge
            </h3>
            <p className="font-body text-stone-600 leading-relaxed mb-6">
              Derrière chaque plan de travail Covarte, il y a un artisan expérimenté qui privilégie la qualité à la vitesse. Covarte fait partie de Coeck, actif depuis 90 ans dans la construction et la finition. Notre production en Belgique garantit non seulement des délais de livraison courts, mais aussi une attention personnalisée pour chacun de vos projets.
            </p>
            <p className="font-body text-stone-600 leading-relaxed">Faites découvrir nos matériaux à vos clients : voir et toucher les aide à décider plus vite. Demandez vos échantillons gratuits dès maintenant.</p>
          </div>
        </div>

        {/* Full-width Video Section */}
        <div className="w-full">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <iframe id="covarte-video" className="w-full h-[400px] md:h-[500px]" src="https://www.youtube.com/embed/aODb0VWezLc" title="Covarte Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>
      </div>
    </section>;
};
export default VisualImpactSectionLookbookFr;