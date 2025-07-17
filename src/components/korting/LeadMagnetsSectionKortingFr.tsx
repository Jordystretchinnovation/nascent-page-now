import { Button } from "@/components/ui/button";
const LeadMagnetsSectionKortingFr = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('korting-form-section-fr');
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
              <img alt="Plans de travail céramiques" className="w-full h-64 object-contain rounded-lg" src="/lovable-uploads/d28fdb6e-01b4-48d8-884a-a7b2035e68d1.png" />
            </div>
            
            {/* Text and button on the right */}
            <div className="md:w-1/2 flex flex-col justify-center">
              <h3 className="font-heading text-2xl md:text-3xl mb-4 text-stone-800">50% de réduction sur votre première commande</h3>
              <p className="font-body text-stone-600 mb-8 leading-relaxed text-lg">Profitez de 50% de réduction sur votre première commande. Idéal pour découvrir Covarte.</p>
              <Button className="font-body bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 w-full md:w-auto" onClick={scrollToForm}>
                Obtenez votre réduction de 50%
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default LeadMagnetsSectionKortingFr;