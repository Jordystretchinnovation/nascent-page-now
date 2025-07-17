
import { Button } from "@/components/ui/button";

const LeadMagnetsSectionStalenFr = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('stalen-form-section-fr');
    if (formSection) {
      formSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 px-6 bg-stone-50">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Image on the left */}
            <div className="md:w-1/2">
              <img src="/lovable-uploads/e62fcbfb-8240-47a7-bcc8-7708ab7fa942.png" alt="Échantillons de plans de travail céramiques" className="w-full h-64 object-contain rounded-lg" />
            </div>
            
            {/* Text and button on the right */}
            <div className="md:w-1/2 flex flex-col justify-center">
              <h3 className="font-heading text-2xl md:text-3xl mb-4 text-stone-800">Commandez vos échantillons gratuits</h3>
              <p className="font-body text-stone-600 mb-8 leading-relaxed text-lg">Découvrez la qualité exceptionnelle de nos plans de travail céramiques. Commandez vos échantillons gratuits et ressentez la différence par vous-même.</p>
              <Button className="font-body bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 w-full md:w-auto" onClick={scrollToForm}>
                Commandez vos échantillons gratuits
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetsSectionStalenFr;
