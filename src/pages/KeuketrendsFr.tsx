
import HeroSectionKeuketrendsFr from "@/components/keukentrends/HeroSectionKeuketrendsFr";
import USPSectionKeuketrendsFr from "@/components/keukentrends/USPSectionKeuketrendsFr";
import LeadMagnetsSectionKeuketrendsFr from "@/components/keukentrends/LeadMagnetsSectionKeuketrendsFr";
import VisualImpactSectionKeuketrendsFr from "@/components/keukentrends/VisualImpactSectionKeuketrendsFr";
import FinalCTASectionKeuketrendsFr from "@/components/keukentrends/FinalCTASectionKeuketrendsFr";
import Footer from "@/components/Footer";

const KeuketrendsFr = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSectionKeuketrendsFr />
      <USPSectionKeuketrendsFr />
      <LeadMagnetsSectionKeuketrendsFr />
      <VisualImpactSectionKeuketrendsFr />
      <FinalCTASectionKeuketrendsFr />
      <Footer />
    </div>
  );
};

export default KeuketrendsFr;
