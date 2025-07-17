
import HeroSectionKeukentrends from "@/components/keukentrends/HeroSectionKeukentrends";
import USPSectionKeukentrends from "@/components/keukentrends/USPSectionKeukentrends";
import LeadMagnetsSectionKeukentrends from "@/components/keukentrends/LeadMagnetsSectionKeukentrends";
import VisualImpactSectionKeukentrends from "@/components/keukentrends/VisualImpactSectionKeukentrends";
import FinalCTASectionKeukentrends from "@/components/keukentrends/FinalCTASectionKeukentrends";
import Footer from "@/components/Footer";

const Keukentrends = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSectionKeukentrends />
      <USPSectionKeukentrends />
      <LeadMagnetsSectionKeukentrends />
      <VisualImpactSectionKeukentrends />
      <FinalCTASectionKeukentrends />
      <Footer />
    </div>
  );
};

export default Keukentrends;
