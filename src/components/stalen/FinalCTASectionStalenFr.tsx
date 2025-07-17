import CTAFormDirectFr from "../CTAFormDirectFr";
const FinalCTASectionStalenFr = () => {
  return <section id="stalen-form-section-fr" className="relative py-20 px-6 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{
      backgroundImage: `url('/lovable-uploads/4dce403a-0b1e-45cf-bc5d-36176b7bb654.png')`
    }} />
      
      <div className="absolute inset-0 bg-stone-900/70"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Centered copy above the form */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl mb-6 leading-relaxed">Découvrez la qualité de Covarte</h2>
          <p className="font-body text-lg text-stone-200 leading-relaxed max-w-2xl mx-auto">
            Nos échantillons gratuits vous permettent de découvrir nos matériaux premium. 
            Remplissez le formulaire et recevez vos échantillons sous 2-3 jours ouvrables.
          </p>
        </div>
        
        {/* Centered form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-8">
            <CTAFormDirectFr type="stalen" title="Commandez vos échantillons gratuits" />
          </div>
        </div>
      </div>
    </section>;
};
export default FinalCTASectionStalenFr;