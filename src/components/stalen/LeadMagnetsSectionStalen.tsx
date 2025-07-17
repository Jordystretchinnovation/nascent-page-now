
import { Button } from "@/components/ui/button";

const LeadMagnetsSectionStalen = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('form-section');
    if (formSection) {
      formSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 px-6 bg-stone-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-16 text-stone-800 w-3/4 mx-auto">
          Ontdek de kwaliteit van Covarte. Helemaal op jouw tempo.
        </h2>
        
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div>
              <img src="/lovable-uploads/aa091f8d-1628-4e75-bbc7-0b266a292416.png" alt="Keramische werkblad stalen" className="w-full h-64 md:h-80 object-contain rounded-lg" />
            </div>
            
            {/* Content */}
            <div className="max-w-xs">
              <h3 className="font-heading text-2xl md:text-3xl mb-4 text-stone-800">
                Gratis stalen
              </h3>
              <p className="font-body text-stone-600 mb-8 leading-relaxed text-lg">Vraag nu gratis je stalenpakket aan. Ideaal om je klanten echt te laten voelen wat kwaliteit is.</p>
              <Button className="font-body bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 px-8 text-lg" onClick={scrollToForm}>
                Vraag gratis stalen aan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetsSectionStalen;
