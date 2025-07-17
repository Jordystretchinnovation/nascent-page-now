
import { Button } from "@/components/ui/button";

const HeroSectionKorting = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('korting-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-stone-800 to-stone-700 text-white py-32 px-6 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: `url('/lovable-uploads/4dce403a-0b1e-45cf-bc5d-36176b7bb654.png')`
        }} 
      />
      
      {/* Subtle 5% fade overlay */}
      <div className="absolute inset-0 bg-stone-900/20"></div>
      
      {/* Covarte Logo in Header - Centered */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <img 
          src="/lovable-uploads/89e030a6-df2f-49fe-8523-9de6dfe82f8b.png" 
          alt="Covarte Logo" 
          className="h-6 md:h-8 w-auto" 
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center pt-20">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight tracking-tight">
          Topkwaliteit keramische bladen aan een scherpe prijs
        </h1>
        <p className="font-body text-lg md:text-xl mb-12 text-stone-200 max-w-3xl mx-auto">
          Keramiek en service waar keukenbouwers op kunnen bouwen
        </p>
        
        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="font-body bg-amber-600 hover:bg-amber-700 text-white text-base py-4 px-8 rounded-lg"
            onClick={scrollToForm}
          >
            Bestel met 50% korting
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionKorting;
