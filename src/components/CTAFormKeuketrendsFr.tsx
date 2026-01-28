

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CTAFormKeuketrendsFrProps {
  title: string;
}

const CTAFormKeuketrendsFr = ({ title }: CTAFormKeuketrendsFrProps) => {
  const [formData, setFormData] = useState({
    voornaam: "",
    achternaam: "",
    bedrijf: "",
    email: "",
    telefoon: ""
  });
  const [utmParams, setUtmParams] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: ""
  });
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
    setMarketingOptin(checked === true);
    if (checked === true) {
      setMarketingOptinError("");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Validate marketing opt-in
    if (!marketingOptin) {
      setMarketingOptinError("Ceci est obligatoire pour recevoir le guide.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare submission data
      const submissionData = {
        type: "keukentrends",
        voornaam: formData.voornaam,
        achternaam: formData.achternaam,
        bedrijf: formData.bedrijf,
        email: formData.email,
        telefoon: formData.telefoon || null,
        straat: null,
        postcode: null,
        gemeente: null,
        renderbook_type: null,
        marketing_optin: marketingOptin,
        language: "fr",
        utm_source: utmParams.utm_source || null,
        utm_medium: utmParams.utm_medium || null,
        utm_campaign: utmParams.utm_campaign || null,
        utm_term: utmParams.utm_term || null,
        utm_content: utmParams.utm_content || null
      };
      
      console.log('Submitting form data:', submissionData);
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('form_submissions_2026')
        .insert([submissionData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Form submission successful:', data);
      
      // Show success toast
      toast({
        title: "Demande envoyée !",
        description: "Vous recevrez le guide dans quelques minutes par e-mail."
      });

      // Reset form
      setFormData({
        voornaam: "",
        achternaam: "",
        bedrijf: "",
        email: "",
        telefoon: ""
      });
      setMarketingOptin(false);

      // Redirect to appropriate thank you page
      setTimeout(() => {
        navigate("/fr/merci/tendances-cuisine");
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Une erreur s'est produite",
        description: "Réessayez plus tard ou contactez-nous.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return "Envoi en cours...";
    return "Télécharger le guide gratuit";
  };

  return (
    <div className="bg-white">
      <div className="mb-6">
        <h3 className="text-xl font-medium text-stone-800">{title}</h3>
      </div>
      <form onSubmit={handleFormSubmit} className="space-y-5">
        {/* Hidden language field */}
        <input type="hidden" name="language" value="fr" />
        
        {/* Hidden UTM fields */}
        <input type="hidden" name="utm_source" value={utmParams.utm_source} />
        <input type="hidden" name="utm_medium" value={utmParams.utm_medium} />
        <input type="hidden" name="utm_campaign" value={utmParams.utm_campaign} />
        <input type="hidden" name="utm_term" value={utmParams.utm_term} />
        <input type="hidden" name="utm_content" value={utmParams.utm_content} />
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="voornaam" className="text-stone-700 font-medium">Prénom *</Label>
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
            <Label htmlFor="achternaam" className="text-stone-700 font-medium">Nom *</Label>
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
          <Label htmlFor="bedrijf" className="text-stone-700 font-medium">Entreprise *</Label>
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
            <Label htmlFor="telefoon" className="text-stone-700 font-medium">Téléphone</Label>
            <Input 
              id="telefoon" 
              value={formData.telefoon} 
              onChange={e => setFormData({ ...formData, telefoon: e.target.value })} 
              className="mt-1 border-stone-200 focus:border-stone-400 focus:ring-stone-400" 
              disabled={isSubmitting}
            />
          </div>
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
              Oui, je veux recevoir le guide et rester informé des produits, offres et actualités de Covarte.
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
        >
          {getButtonText()}
        </Button>
      </form>
    </div>
  );
};

export default CTAFormKeuketrendsFr;

