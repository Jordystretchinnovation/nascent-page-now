
import HeroSection from "@/components/HeroSection";
import USPSection from "@/components/USPSection";
import LeadMagnetsSection from "@/components/LeadMagnetsSection";
import VisualImpactSection from "@/components/VisualImpactSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

const Index = () => {
  console.log("Index page rendering");
  
  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSection />
      <USPSection />
      <LeadMagnetsSection />
      <VisualImpactSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default Index;
