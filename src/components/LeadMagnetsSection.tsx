
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CTAForm from "./CTAForm";

const LeadMagnetsSection = () => {
  return (
    <section className="py-20 px-6 bg-stone-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-16 text-stone-800 w-3/4 mx-auto">
          Ontdek de kwaliteit van Covarte. Helemaal op jouw tempo.
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Material samples image */}
            <div className="mb-3">
              <img 
                src="/lovable-uploads/aa091f8d-1628-4e75-bbc7-0b266a292416.png" 
                alt="Keramische werkblad stalen" 
                className="w-full h-48 object-contain rounded-lg" 
              />
            </div>
            <p className="font-body text-stone-600 mb-8 leading-relaxed">
              Vraag nu gratis je stalenpakket aan. Ideaal om je klanten écht te laten voelen wat kwaliteit is.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="font-body w-full bg-stone-800 hover:bg-stone-700 text-white rounded-lg py-3">
                  Vraag gratis stalen aan
                </Button>
              </DialogTrigger>
              <CTAForm type="stalen" title="Gratis stalenpakket aanvragen" />
            </Dialog>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Renderboek image */}
            <div className="mb-3">
              <img 
                alt="Renderboek download" 
                className="w-full h-48 object-contain rounded-lg" 
                src="/lovable-uploads/e61e5bce-1634-43db-8c9d-34cc46bcfc70.png" 
              />
            </div>
            <p className="font-body text-stone-600 mb-8 leading-relaxed">
              Impressionante keukenrenders voor in je toonzaal of bij je klant. Digitaal of opgestuurd.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="font-body w-full bg-stone-600 hover:bg-stone-700 text-white rounded-lg py-3">
                  Download Collection Lookbook
                </Button>
              </DialogTrigger>
              <CTAForm type="renderboek" title="Collection Lookbook downloaden" />
            </Dialog>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Discount offer image */}
            <div className="mb-3">
              <img 
                alt="50% korting eerste bestelling" 
                className="w-full h-48 object-contain rounded-lg" 
                src="/lovable-uploads/b66fa845-e1ad-40f8-903c-6e32783c228e.png" 
              />
            </div>
            <p className="font-body text-stone-600 mb-8 leading-relaxed">
              Bestel voor het eerst bij Covarte en ontvang 50% korting. Zonder risico, mét topservice.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="font-body w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3">
                  Bestel met 50% korting
                </Button>
              </DialogTrigger>
              <CTAForm type="korting" title="50% korting op eerste bestelling" />
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetsSection;
