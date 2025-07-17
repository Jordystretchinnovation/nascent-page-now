
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CTAFormFr from "./CTAFormFr";

const FinalCTASectionFr = () => {
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
          Découvrez la qualité de Covarte. À votre rythme.
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="font-body bg-white text-stone-800 hover:bg-stone-100 py-4 px-8 rounded-lg">
                Demandez des échantillons gratuits
              </Button>
            </DialogTrigger>
            <CTAFormFr type="stalen" title="Commandez votre pack d'échantillons gratuits" />
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="font-body border-white border-2 bg-transparent text-white hover:bg-white hover:text-stone-800 py-4 px-8 rounded-lg">
                Télécharger le Collection Lookbook
              </Button>
            </DialogTrigger>
            <CTAFormFr type="renderboek" title="Télécharger le Collection Lookbook" />
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="font-body bg-amber-600 hover:bg-amber-700 text-white py-4 px-8 rounded-lg">
                Commander avec 50% de réduction
              </Button>
            </DialogTrigger>
            <CTAFormFr type="korting" title="50% de réduction sur la première commande" />
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASectionFr;
