
import HeroSectionLookbookFr from "@/components/lookbook/HeroSectionLookbookFr";
import USPSectionLookbookFr from "@/components/lookbook/USPSectionLookbookFr";
import LeadMagnetsSectionLookbookFr from "@/components/lookbook/LeadMagnetsSectionLookbookFr";
import VisualImpactSectionLookbookFr from "@/components/lookbook/VisualImpactSectionLookbookFr";
import FinalCTASectionLookbookFr from "@/components/lookbook/FinalCTASectionLookbookFr";
import Footer from "@/components/Footer";

const LookbookFr = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSectionLookbookFr />
      <USPSectionLookbookFr />
      <LeadMagnetsSectionLookbookFr />
      <VisualImpactSectionLookbookFr />
      <FinalCTASectionLookbookFr />
      <Footer />
    </div>
  );
};

export default LookbookFr;
