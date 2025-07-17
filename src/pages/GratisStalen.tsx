
import HeroSectionStalen from "@/components/stalen/HeroSectionStalen";
import USPSectionStalenNl from "@/components/stalen/USPSectionStalenNl";
import LeadMagnetsSectionStalen from "@/components/stalen/LeadMagnetsSectionStalen";
import VisualImpactSectionStalenNl from "@/components/stalen/VisualImpactSectionStalenNl";
import FinalCTASectionStalen from "@/components/stalen/FinalCTASectionStalen";
import Footer from "@/components/Footer";

const GratisStalen = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSectionStalen />
      <USPSectionStalenNl />
      <LeadMagnetsSectionStalen />
      <VisualImpactSectionStalenNl />
      <FinalCTASectionStalen />
      <Footer />
    </div>
  );
};

export default GratisStalen;
