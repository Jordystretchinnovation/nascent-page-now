

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const FinalCTASectionStalen = () => {
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
  const [typeBedrijf, setTypeBedrijf] = useState("particulier");
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
    
    console.log('Captured UTM parameters:', capturedUtms);
  }, []);

  const handleMarketingOptinChange = (checked: boolean | "indeterminate") => {
    console.log('Marketing optin changed to:', checked);
    setMarketingOptin(checked === true);
    if (checked === true) {
      setMarketingOptinError("");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    
    if (isSubmitting) {
      console.log('Form already submitting, returning early');
      return;
    }

    // Validate marketing opt-in
    if (!marketingOptin) {
      console.error('Marketing opt-in not accepted');
      setMarketingOptinError("Dit is verplicht om de gratis stalen te kunnen ontvangen.");
      toast({
        title: "Toestemming vereist",
        description: "Je moet toestemming geven om de gratis stalen te kunnen ontvangen.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log('Set submitting to true');
    
    try {
      // Prepare submission data
      const submissionData = {
        type: "stalen",
        voornaam: formData.voornaam,
        achternaam: formData.achternaam,
        bedrijf: formData.bedrijf,
        email: formData.email,
        telefoon: formData.telefoon || null,
        straat: formData.straat || null,
        postcode: formData.postcode || null,
        gemeente: formData.gemeente || null,
        renderbook_type: null,
        type_bedrijf: typeBedrijf,
        marketing_optin: marketingOptin,
        language: "nl",
        utm_source: utmParams.utm_source || null,
        utm_medium: utmParams.utm_medium || null,
        utm_campaign: utmParams.utm_campaign || null,
        utm_term: utmParams.utm_term || null,
        utm_content: utmParams.utm_content || null
      };
      
      console.log('Submitting form data:', submissionData);
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('form_submissions')
        .insert([submissionData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Form submission successful:', data);
      
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
      setTypeBedrijf("particulier");
      setMarketingOptin(false);

      // Redirect to thank you page
      setTimeout(() => {
        navigate("/thank-you/stalen");
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Er is een fout opgetreden",
        description: "Probeer het later opnieuw of neem contact met ons op.",
        variant: "destructive"
      });
    } finally {
      console.log('Setting submitting back to false');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="form-section" className="relative py-20 px-6 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: `url('/lovable-uploads/4dce403a-0b1e-45cf-bc5d-36176b7bb654.png')`
        }} 
      />
      
      <div className="absolute inset-0 bg-stone-900/70"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Centered text content above form */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl mb-6 leading-relaxed">
            Ontdek de kwaliteit van Covarte. Helemaal op jouw tempo.
          </h2>
          <p className="font-body text-lg text-stone-200 leading-relaxed max-w-2xl mx-auto">
            Vraag nu gratis je stalenpakket aan. Ideaal om je klanten écht te laten voelen wat kwaliteit is. 
            Vul het formulier in en we sturen je binnen 24 uur je gratis stalen toe.
          </p>
        </div>
        
        {/* Centered form */}
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl max-w-lg mx-auto">
          <h3 className="font-heading text-xl mb-6 text-stone-800 text-center">Gratis stalenpakket aanvragen</h3>
          
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
                  required 
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
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
            
            <div>
              <Label className="text-stone-700 font-medium">Ik ben een... *</Label>
              <RadioGroup value={typeBedrijf} onValueChange={setTypeBedrijf} className="mt-2" disabled={isSubmitting}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="particulier" id="particulier" />
                  <Label htmlFor="particulier" className="text-stone-700">Particulier</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="keukenbouwer" id="keukenbouwer" />
                  <Label htmlFor="keukenbouwer" className="text-stone-700">Keukenbouwer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="interieurarchitect" id="interieurarchitect" />
                  <Label htmlFor="interieurarchitect" className="text-stone-700">Interieurarchitect</Label>
                </div>
              </RadioGroup>
            </div>
            
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
                  Ja, ik wil graag de gratis stalen ontvangen en blijf graag op de hoogte van producten, aanbiedingen en nieuws van Covarte.
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
              onClick={() => console.log('Submit button clicked')}
            >
              {isSubmitting ? "Bezig met versturen..." : "Ontvang je gratis stalen"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASectionStalen;

