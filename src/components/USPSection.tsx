import { Layers, Package, Clock, Factory, HeadsetIcon, Building } from "lucide-react";
const USPSection = () => {
  return <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-16 text-stone-800 w-3/4 mx-auto">Waarom steeds meer keukenbouwers voor Covarte kiezen</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Layers className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">Unieke keramische werkbladen van 15 mm
          </h3>
            <p className="font-body text-stone-600 leading-relaxed">Stevigheid, voor de beste prijs.

          </p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Package className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">Standaarddiktes van 12 en 20 mm
          </h3>
            <p className="font-body text-stone-600 leading-relaxed">Over een breed assortiment.

          </p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Clock className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">Gegarandeerd op voorraad
          </h3>
            <p className="font-body text-stone-600 leading-relaxed">Geen kopzorgen, zodat je kan schakelen wanneer jij wil.</p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Factory className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">Geïndustrialiseerd machinepark</h3>
            <p className="font-body text-stone-600 leading-relaxed">Met unieke manuele afwerking, minder risico op randschade.

          </p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <HeadsetIcon className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">Binnendienst die technisch meedenkt
          </h3>
            <p className="font-body text-stone-600 leading-relaxed">Wij verzorgen vóór en na service.</p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Building className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">Grote Belgische productiesite</h3>
            <p className="font-body text-stone-600 leading-relaxed">20.000 m² met ruimte voor uw groei.</p>
          </div>
        </div>
      </div>
    </section>;
};
export default USPSection;