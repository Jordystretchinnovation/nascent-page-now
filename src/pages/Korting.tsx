
import HeroSectionKorting from "@/components/korting/HeroSectionKorting";
import USPSectionKorting from "@/components/korting/USPSectionKorting";
import LeadMagnetsSectionKorting from "@/components/korting/LeadMagnetsSectionKorting";
import VisualImpactSectionKorting from "@/components/korting/VisualImpactSectionKorting";
import FinalCTASectionKorting from "@/components/korting/FinalCTASectionKorting";
import Footer from "@/components/Footer";

const Korting = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSectionKorting />
      <USPSectionKorting />
      <LeadMagnetsSectionKorting />
      <VisualImpactSectionKorting />
      <FinalCTASectionKorting />
      <Footer />
    </div>
  );
};

export default Korting;
