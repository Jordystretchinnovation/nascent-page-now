
import HeroSectionKortingFr from "@/components/korting/HeroSectionKortingFr";
import USPSectionKortingFr from "@/components/korting/USPSectionKortingFr";
import LeadMagnetsSectionKortingFr from "@/components/korting/LeadMagnetsSectionKortingFr";
import VisualImpactSectionKortingFr from "@/components/korting/VisualImpactSectionKortingFr";
import FinalCTASectionKortingFr from "@/components/korting/FinalCTASectionKortingFr";
import Footer from "@/components/Footer";

const KortingFr = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSectionKortingFr />
      <USPSectionKortingFr />
      <LeadMagnetsSectionKortingFr />
      <VisualImpactSectionKortingFr />
      <FinalCTASectionKortingFr />
      <Footer />
    </div>
  );
};

export default KortingFr;
