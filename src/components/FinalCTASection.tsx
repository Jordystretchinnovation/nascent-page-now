
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CTAForm from "./CTAForm";

const FinalCTASection = () => {
  return (
    <section className="relative py-20 px-6 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: `url('/lovable-uploads/4dce403a-0b1e-45cf-bc5d-36176b7bb654.png')`
        }} 
      />
      
      <div className="absolute inset-0 bg-stone-900/70"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-4xl mb-12 leading-relaxed w-3/4 mx-auto">
          Ontdek de kwaliteit van Covarte. Helemaal op jouw tempo.
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="font-body bg-white text-stone-800 hover:bg-stone-100 py-4 px-8 rounded-lg">
                Ontvang gratis stalen
              </Button>
            </DialogTrigger>
            <CTAForm type="stalen" title="Gratis stalenpakket aanvragen" />
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="font-body border-white border-2 bg-transparent text-white hover:bg-white hover:text-stone-800 py-4 px-8 rounded-lg">
                Download Collection Lookbook
              </Button>
            </DialogTrigger>
            <CTAForm type="renderboek" title="Collection Lookbook downloaden" />
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="font-body bg-amber-600 hover:bg-amber-700 text-white py-4 px-8 rounded-lg">
                Bestel met 50% korting
              </Button>
            </DialogTrigger>
            <CTAForm type="korting" title="50% korting op eerste bestelling" />
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
