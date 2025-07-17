
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CTAFormFr from "./CTAFormFr";

const LeadMagnetsSectionFr = () => {
  return (
    <section className="py-20 px-6 bg-stone-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-16 text-stone-800 w-3/4 mx-auto">
          Découvrez la qualité de Covarte. À votre rythme.
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Material samples image */}
            <div className="mb-3">
              <img 
                src="/lovable-uploads/aa091f8d-1628-4e75-bbc7-0b266a292416.png" 
                alt="Échantillons de plans de travail céramiques" 
                className="w-full h-48 object-contain rounded-lg" 
              />
            </div>
            <p className="font-body text-stone-600 mb-8 leading-relaxed">
              Demandez maintenant votre pack d'échantillons gratuits. Idéal pour faire vraiment ressentir la qualité à vos clients.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="font-body w-full bg-stone-800 hover:bg-stone-700 text-white rounded-lg py-3">
                  Demandez des échantillons gratuits
                </Button>
              </DialogTrigger>
              <CTAFormFr type="stalen" title="Commandez votre pack d'échantillons gratuits" />
            </Dialog>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Renderboek image */}
            <div className="mb-3">
              <img 
                alt="Téléchargement du lookbook" 
                className="w-full h-48 object-contain rounded-lg" 
                src="/lovable-uploads/e61e5bce-1634-43db-8c9d-34cc46bcfc70.png" 
              />
            </div>
            <p className="font-body text-stone-600 mb-8 leading-relaxed">
              Rendus de cuisine impressionnants pour votre showroom ou chez votre client. Numérique ou envoyé.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="font-body w-full bg-stone-600 hover:bg-stone-700 text-white rounded-lg py-3">
                  Télécharger le Collection Lookbook
                </Button>
              </DialogTrigger>
              <CTAFormFr type="renderboek" title="Télécharger le Collection Lookbook" />
            </Dialog>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Discount offer image */}
            <div className="mb-3">
              <img 
                alt="50% de réduction sur la première commande" 
                className="w-full h-48 object-contain rounded-lg" 
                src="/lovable-uploads/b66fa845-e1ad-40f8-903c-6e32783c228e.png" 
              />
            </div>
            <p className="font-body text-stone-600 mb-8 leading-relaxed">
              Commandez pour la première fois chez Covarte et recevez 50% de réduction. Sans risque, avec un service de qualité.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="font-body w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3">
                  Commander avec 50% de réduction
                </Button>
              </DialogTrigger>
              <CTAFormFr type="korting" title="50% de réduction sur la première commande" />
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetsSectionFr;
