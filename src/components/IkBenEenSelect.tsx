import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IK_BEN_EEN_OPTIONS } from "@/lib/ikBenEen";

interface Props {
  value: string;
  onChange: (v: string) => void;
  language: "nl" | "fr";
  disabled?: boolean;
}

const IkBenEenSelect = ({ value, onChange, language, disabled }: Props) => {
  const options = [...IK_BEN_EEN_OPTIONS]
    .map((o) => ({ value: o.value, label: language === "fr" ? o.fr : o.value }))
    .sort((a, b) => a.label.localeCompare(b.label, language));
  return (
    <div>
      <Label className="text-stone-700 font-medium">{language === "fr" ? "Je suis un(e)... *" : "Ik ben een... *"}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="mt-1 border-stone-200">
          <SelectValue placeholder={language === "fr" ? "Faites un choix" : "Maak een keuze"} />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default IkBenEenSelect;
