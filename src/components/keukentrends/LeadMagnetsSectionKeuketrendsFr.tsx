import { Button } from "@/components/ui/button";
const LeadMagnetsSectionKeuketrendsFr = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('keukentrends-form-section-fr');
    if (formSection) {
      formSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section className="py-20 px-6 bg-stone-50">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Image on the left */}
            <div className="md:w-1/2">
              <img alt="Guide tendances cuisine" className="w-full h-64 object-contain rounded-lg" src="/lovable-uploads/66fd7a79-cd34-42bb-b82c-631bad12fef0.png" />
            </div>
            
            {/* Text and button on the right */}
            <div className="md:w-1/2 flex flex-col justify-center">
              <h3 className="font-heading text-2xl md:text-3xl mb-4 text-stone-800">Télécharger le guide gratuit des tendances cuisine</h3>
              <p className="font-body text-stone-600 mb-8 leading-relaxed text-lg">Dans notre nouveau guide Tendances Cuisine 2025, découvrez comment les concepteurs et cuisinistes s’adaptent aux nouveaux besoins du marché.</p>
              <Button className="font-body bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 w-full md:w-auto" onClick={scrollToForm}>Télécharger notre guide</Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default LeadMagnetsSectionKeuketrendsFr;