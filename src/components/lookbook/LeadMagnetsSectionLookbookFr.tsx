import { Button } from "@/components/ui/button";
const LeadMagnetsSectionLookbookFr = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('lookbook-form-section-fr');
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
              <img alt="Collection Lookbook Covarte" className="w-full h-64 object-contain rounded-lg" src="/lovable-uploads/3f062a2b-b345-400d-b06f-c75a1664da90.png" />
            </div>
            
            {/* Text and button on the right */}
            <div className="md:w-1/2 flex flex-col justify-center">
              <h3 className="font-heading text-2xl md:text-3xl mb-4 text-stone-800">Télécharger le Collection Lookbook</h3>
              <p className="font-body text-stone-600 mb-8 leading-relaxed text-lg">Découvrez toute notre collection de plans de travail céramiques dans ce lookbook détaillé. Inspirations, finitions et dimensions disponibles.</p>
              <Button className="font-body bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 w-full md:w-auto" onClick={scrollToForm}>
                Télécharger le Collection Lookbook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default LeadMagnetsSectionLookbookFr;