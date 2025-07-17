import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CTAFormProps {
  type: string;
  title: string;
}

const CTAForm = ({ type, title }: CTAFormProps) => {
  const [formData, setFormData] = useState({
    voornaam: "",
    achternaam: "",
    bedrijf: "",
    email: "",
    telefoon: "",
    straat: "",
    postcode: "",
    gemeente: ""
  });
  const [utmParams, setUtmParams] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: ""
  });
  const [renderbookType, setRenderbookType] = useState("digitaal");
  const [marketingOptin, setMarketingOptin] = useState(false);
  const [marketingOptinError, setMarketingOptinError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Capture UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const capturedUtms = {
      utm_source: urlParams.get('utm_source') || "",
      utm_medium: urlParams.get('utm_medium') || "",
      utm_campaign: urlParams.get('utm_campaign') || "",
      utm_term: urlParams.get('utm_term') || "",
      utm_content: urlParams.get('utm_content') || ""
    };
    setUtmParams(capturedUtms);
    
    console.log('CTAForm - Captured UTM parameters:', capturedUtms);
  }, []);

  const handleMarketingOptinChange = (checked: boolean | "indeterminate") => {
    console.log('CTAForm - Marketing optin changed to:', checked);
    setMarketingOptin(checked === true);
    if (checked === true) {
      setMarketingOptinError("");
    }
  };

  const getMarketingOptinText = () => {
    switch (type) {
      case "stalen":
        return "Ja, ik wil gratis stalen ontvangen en blijf graag op de hoogte van producten, aanbiedingen en nieuws van Covarte. *";
      case "renderboek":
        return "Ja, ik wil het Collection Lookbook ontvangen en blijf graag op de hoogte van producten, aanbiedingen en nieuws van Covarte. *";
      case "korting":
        return "Ja, ik wil de kortingscode ontvangen en blijf graag op de hoogte van producten, aanbiedingen en nieuws van Covarte. *";
      default:
        return "Ja, ik wil deze download ontvangen en blijf graag op de hoogte van producten, aanbiedingen en nieuws van Covarte. *";
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('CTAForm - Form submission started for type:', type);
    
    if (isSubmitting) {
      console.log('CTAForm - Form already submitting, returning early');
      return;
    }

    // Validate marketing opt-in
    if (!marketingOptin) {
      console.log('CTAForm - Marketing opt-in validation failed');
      setMarketingOptinError("Dit veld is verplicht.");
      toast({
        title: "Marketing toestemming vereist",
        description: "Je moet akkoord gaan met het ontvangen van communicatie van Covarte.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log('CTAForm - Set submitting to true');
    
    try {
      // Prepare submission data
      const submissionData = {
        type,
        voornaam: formData.voornaam,
        achternaam: formData.achternaam,
        bedrijf: formData.bedrijf,
        email: formData.email,
        telefoon: formData.telefoon || null,
        straat: formData.straat || null,
        postcode: formData.postcode || null,
        gemeente: formData.gemeente || null,
        renderbook_type: type === "renderboek" ? renderbookType : null,
        marketing_optin: marketingOptin,
        language: "nl",
        utm_source: utmParams.utm_source || null,
        utm_medium: utmParams.utm_medium || null,
        utm_campaign: utmParams.utm_campaign || null,
        utm_term: utmParams.utm_term || null,
        utm_content: utmParams.utm_content || null
      };
      
      console.log('CTAForm - Submitting form data:', submissionData);
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('form_submissions')
        .insert([submissionData])
        .select();

      if (error) {
        console.error('CTAForm - Supabase error:', error);
        throw error;
      }

      console.log('CTAForm - Form submission successful:', data);
      
      // Show success toast
      toast({
        title: "Aanvraag verzonden!",
        description: "We nemen binnen 24 uur contact met je op."
      });

      // Reset form
      setFormData({
        voornaam: "",
        achternaam: "",
        bedrijf: "",
        email: "",
        telefoon: "",
        straat: "",
        postcode: "",
        gemeente: ""
      });
      setRenderbookType("digitaal");
      setMarketingOptin(false);

      // Redirect to appropriate thank you page
      setTimeout(() => {
        switch (type) {
          case "stalen":
            navigate("/thank-you/stalen");
            break;
          case "renderboek":
            navigate("/thank-you/collection-lookbook");
            break;
          case "korting":
            navigate("/thank-you/korting");
            break;
          default:
            navigate("/");
        }
      }, 1000);
      
    } catch (error) {
      console.error('CTAForm - Error submitting form:', error);
      toast({
        title: "Er is een fout opgetreden",
        description: "Probeer het later opnieuw of neem contact met ons op.",
        variant: "destructive"
      });
    } finally {
      console.log('CTAForm - Setting submitting back to false');
      setIsSubmitting(false);
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return "Bezig met versturen...";
    
    switch (type) {
      case "stalen":
        return "Ontvang je gratis stalen";
      case "renderboek":
        return "Ontvang je Collection Lookbook";
      case "korting":
        return "Ontvang je 50% korting";
      default:
        return "Verstuur aanvraag";
    }
  };

  return (
    <DialogContent className="sm:max-w-md bg-white">
      <DialogHeader>
        <DialogTitle className="text-xl font-medium text-stone-800">{title}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleFormSubmit} className="space-y-5">
        {/* Hidden language field */}
        <input type="hidden" name="language" value="nl" />
        
        {/* Hidden UTM fields */}
        <input type="hidden" name="utm_source" value={utmParams.utm_source} />
        <input type="hidden" name="utm_medium" value={utmParams.utm_medium} />
        <input type="hidden" name="utm_campaign" value={utmParams.utm_campaign} />
        <input type="hidden" name="utm_term" value={utmParams.utm_term} />
        <input type="hidden" name="utm_content" value={utmParams.utm_content} />
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="voornaam" className="text-stone-700 font-medium">Voornaam *</Label>
            <Input 
              id="voornaam" 
              value={formData.voornaam} 
              onChange={e => setFormData({ ...formData, voornaam: e.target.value })} 
              className="mt-1 border-stone-200 focus:border-stone-400 focus:ring-stone-400" 
              required 
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="achternaam" className="text-stone-700 font-medium">Achternaam *</Label>
            <Input 
              id="achternaam" 
              value={formData.achternaam} 
              onChange={e => setFormData({ ...formData, achternaam: e.target.value })} 
              className="mt-1 border-stone-200 focus:border-stone-400 focus:ring-stone-400" 
              required 
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="bedrijf" className="text-stone-700 font-medium">Bedrijf *</Label>
          <Input 
            id="bedrijf" 
            value={formData.bedrijf} 
            onChange={e => setFormData({ ...formData, bedrijf: e.target.value })} 
            className="mt-1 border-stone-200 focus:border-stone-400 focus:ring-stone-400" 
            required 
            disabled={isSubmitting}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="email" className="text-stone-700 font-medium">E-mail *</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              className="mt-1 border-stone-200 focus:border-stone-400 focus:ring-stone-400" 
              required 
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="telefoon" className="text-stone-700 font-medium">Telefoon *</Label>
            <Input 
              id="telefoon" 
              value={formData.telefoon} 
              onChange={e => setFormData({ ...formData, telefoon: e.target.value })} 
              className="mt-1 border-stone-200 focus:border-stone-400 focus:ring-stone-400" 
              required={type === "stalen" || type === "korting" || (type === "renderboek" && renderbookType === "fysiek")}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        {type === "renderboek" && (
          <>
            <div>
              <Label className="text-stone-700 font-medium">Type Collection Lookbook *</Label>
              <RadioGroup value={renderbookType} onValueChange={setRenderbookType} className="mt-2" disabled={isSubmitting}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="digitaal" id="digitaal" />
                  <Label htmlFor="digitaal" className="text-stone-700">Digitaal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fysiek" id="fysiek" />
                  <Label htmlFor="fysiek" className="text-stone-700">Fysiek</Label>
                </div>
              </RadioGroup>
            </div>
          </>
        )}
        
        {((type === "stalen") || (type === "renderboek" && renderbookType === "fysiek")) && (
          <>
            <div>
              <Label htmlFor="straat" className="text-stone-700 font-medium">Straat + nr *</Label>
              <Input 
                id="straat" 
                value={formData.straat} 
                onChange={e => setFormData({ ...formData, straat: e.target.value })} 
                className="mt-1 border-stone-200 focus:border-stone-400 focus:ring-stone-400" 
                required 
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="postcode" className="text-stone-700 font-medium">Postcode *</Label>
                <Input 
                  id="postcode" 
                  value={formData.postcode} 
                  onChange={e => setFormData({ ...formData, postcode: e.target.value })} 
                  className="mt-1 border-stone-200 focus:border-stone-400 focus:ring-stone-400" 
                  required 
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="gemeente" className="text-stone-700 font-medium">Gemeente *</Label>
                <Input 
                  id="gemeente" 
                  value={formData.gemeente} 
                  onChange={e => setFormData({ ...formData, gemeente: e.target.value })} 
                  className="mt-1 border-stone-200 focus:border-stone-400 focus:ring-stone-400" 
                  required 
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </>
        )}
        
        {/* Marketing Opt-in */}
        <div className="flex items-start space-x-3 pt-2">
          <Checkbox 
            id="marketing-optin" 
            checked={marketingOptin}
            onCheckedChange={handleMarketingOptinChange}
            className="mt-1"
            disabled={isSubmitting}
          />
          <div className="flex-1">
            <Label 
              htmlFor="marketing-optin" 
              className="text-sm text-stone-600 leading-relaxed cursor-pointer"
            >
              {getMarketingOptinText()}
            </Label>
            {marketingOptinError && (
              <p className="text-red-600 text-sm mt-1">{marketingOptinError}</p>
            )}
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-stone-800 hover:bg-stone-700 text-white font-medium rounded-lg py-3 disabled:opacity-50"
          disabled={isSubmitting}
          onClick={() => console.log('CTAForm - Submit button clicked for type:', type)}
        >
          {getButtonText()}
        </Button>
      </form>
    </DialogContent>
  );
};

export default CTAForm;
