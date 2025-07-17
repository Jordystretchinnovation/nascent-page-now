
import HeroSectionLookbook from "@/components/lookbook/HeroSectionLookbook";
import USPSectionLookbook from "@/components/lookbook/USPSectionLookbook";
import LeadMagnetsSectionLookbook from "@/components/lookbook/LeadMagnetsSectionLookbook";
import VisualImpactSectionLookbook from "@/components/lookbook/VisualImpactSectionLookbook";
import FinalCTASectionLookbook from "@/components/lookbook/FinalCTASectionLookbook";
import Footer from "@/components/Footer";

const Lookbook = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSectionLookbook />
      <USPSectionLookbook />
      <LeadMagnetsSectionLookbook />
      <VisualImpactSectionLookbook />
      <FinalCTASectionLookbook />
      <Footer />
    </div>
  );
};

export default Lookbook;
