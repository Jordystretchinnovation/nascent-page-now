import { Layers, Package, Clock, Factory, HeadsetIcon, Building } from "lucide-react";
const USPSectionLookbookFr = () => {
  return <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-16 text-stone-800 w-3/4 mx-auto">
          Pourquoi de plus en plus de cuisinistes choisissent Covarte
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Layers className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">
              Plans de travail en céramique uniques de 15 mm
            </h3>
            <p className="font-body text-stone-600 leading-relaxed">
              Solidité, au meilleur prix.
            </p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Package className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">
              Épaisseurs standards de 12 et 20 mm
            </h3>
            <p className="font-body text-stone-600 leading-relaxed">
              Sur une large gamme de produits.
            </p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Clock className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">
              Stock garanti
            </h3>
            <p className="font-body text-stone-600 leading-relaxed">
              Aucune inquiétude, vous pouvez avancer à votre rythme.
            </p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Factory className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">
              Parc machines industrialisé
            </h3>
            <p className="font-body text-stone-600 leading-relaxed">
              Avec une finition manuelle unique, moins de risques d'éclats sur les bords.
            </p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <HeadsetIcon className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">
              Service interne avec expertise technique
            </h3>
            <p className="font-body text-stone-600 leading-relaxed">
              Un accompagnement avant et après la vente.
            </p>
          </div>
          
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow">
            <Building className="h-12 w-12 text-stone-700 mb-6" />
            <h3 className="font-heading text-xl mb-4 text-stone-800">Grande capacité de production en Belgique </h3>
            <p className="font-body text-stone-600 leading-relaxed">20.000 m², prêts à soutenir votre croissance </p>
          </div>
        </div>
      </div>
    </section>;
};
export default USPSectionLookbookFr;