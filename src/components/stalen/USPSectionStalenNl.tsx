
import { Layers, Package, Clock, Factory, HeadsetIcon, Building } from "lucide-react";

const USPSectionStalenNl = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-16 text-stone-800 w-3/4 mx-auto">
          Waarom steeds meer keukenspecialisten voor Covarte kiezen
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Layers className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">
              Unieke keramische werkbladen van 15 mm
            </h3>
            <p className="font-body text-stone-600 leading-relaxed">
              Sterkte, tegen de beste prijs.
            </p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Package className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">
              Standaardiktes van 12 en 20 mm
            </h3>
            <p className="font-body text-stone-600 leading-relaxed">
              Op een breed scala aan producten.
            </p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Clock className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">
              Gegarandeerde voorraad
            </h3>
            <p className="font-body text-stone-600 leading-relaxed">
              Geen zorgen, je kunt op je eigen tempo vooruitgaan.
            </p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Factory className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">
              Geïndustrialiseerd machinepark
            </h3>
            <p className="font-body text-stone-600 leading-relaxed">
              Met een unieke handmatige afwerking, minder risico op schilfers aan de randen.
            </p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <HeadsetIcon className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">
              Interne service met technische expertise
            </h3>
            <p className="font-body text-stone-600 leading-relaxed">
              Begeleiding voor en na de verkoop.
            </p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Building className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">
              Grote Belgische productie-eenheid
            </h3>
            <p className="font-body text-stone-600 leading-relaxed">
              20.000 m², klaar om je groei op te vangen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default USPSectionStalenNl;
