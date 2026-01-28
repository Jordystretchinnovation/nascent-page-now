
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CTAFormFrProps {
  type: string;
  title: string;
}

const CTAFormFr = ({ type, title }: CTAFormFrProps) => {
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
    
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.voornaam || !formData.achternaam || !formData.bedrijf || !formData.email) {
        toast({
          title: "Champs requis manquants",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive"
        });
        return;
      }

      // Validate marketing opt-in
      if (!marketingOptin) {
        let errorMessage = "";
        let description = "";
        switch (type) {
          case "stalen":
            errorMessage = "Ceci est obligatoire pour recevoir les échantillons gratuits.";
            description = "Vous devez donner votre consentement pour recevoir les échantillons gratuits.";
            break;
          case "korting":
            errorMessage = "Ceci est obligatoire pour recevoir la réduction.";
            description = "Vous devez donner votre consentement pour recevoir la réduction.";
            break;
          case "renderboek":
            errorMessage = "Ceci est obligatoire pour recevoir le lookbook.";
            description = "Vous devez donner votre consentement pour recevoir le lookbook.";
            break;
          default:
            errorMessage = "Ce champ est obligatoire.";
            description = "Vous devez donner votre consentement pour traiter votre demande.";
        }
        
        setMarketingOptinError(errorMessage);
        
        toast({
          title: "Consentement requis",
          description: description,
          variant: "destructive"
        });
        return;
      }

      // For korting type, require telephone field
      if (type === "korting" && !formData.telefoon) {
        toast({
          title: "Numéro de téléphone manquant",
          description: "Pour la réduction, un numéro de téléphone est obligatoire.",
          variant: "destructive"
        });
        return;
      }

      // For stalen type, require additional fields
      if (type === "stalen" && (!formData.telefoon || !formData.straat || !formData.postcode || !formData.gemeente)) {
        toast({
          title: "Données d'adresse manquantes",
          description: "Les données d'adresse sont obligatoires pour les échantillons.",
          variant: "destructive"
        });
        return;
      }

      // For renderboek fysiek, require address fields but not telephone
      if (type === "renderboek" && renderbookType === "fysiek" && (!formData.straat || !formData.postcode || !formData.gemeente)) {
        toast({
          title: "Données d'adresse manquantes",
          description: "Les données d'adresse sont obligatoires pour le lookbook physique.",
          variant: "destructive"
        });
        return;
      }

      // Prepare submission data
      const submissionData = {
        type: type,
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
        language: "fr",
        utm_source: utmParams.utm_source || null,
        utm_medium: utmParams.utm_medium || null,
        utm_campaign: utmParams.utm_campaign || null,
        utm_term: utmParams.utm_term || null,
        utm_content: utmParams.utm_content || null
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('form_submissions_2026')
        .insert([submissionData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // Show success toast
      toast({
        title: "Demande envoyée !",
        description: "Nous vous contacterons dans les 24 heures."
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
      let redirectPath = "/fr/merci/";
      switch (type) {
        case "stalen":
          redirectPath += "echantillons";
          break;
        case "korting":
          redirectPath += "reduction";
          break;
        case "renderboek":
          redirectPath += "collection-lookbook";
          break;
        default:
          redirectPath += "echantillons";
      }
      
      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Une erreur est survenue",
        description: "Veuillez réessayer plus tard ou nous contacter.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiresAddress = type === "stalen" || (type === "renderboek" && renderbookType === "fysiek");
  const requiresTelephone = type === "korting" || type === "stalen";

  // Get specific opt-in text based on type
  const getOptinText = () => {
    switch (type) {
      case "stalen":
        return "Oui, je veux recevoir les échantillons gratuits et rester informé des produits, offres et actualités de Covarte.";
      case "korting":
        return "Oui, je veux recevoir la réduction et rester informé des produits, offres et actualités de Covarte.";
      case "renderboek":
        return "Oui, je veux recevoir le lookbook et rester informé des produits, offres et actualités de Covarte.";
      default:
        return "Oui, je donne mon consentement pour traiter ma demande.";
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl text-center">{title}</DialogTitle>
      </DialogHeader>
      
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
            <Label htmlFor="telefoon" className="text-stone-700 font-medium">Téléphone{requiresTelephone ? ' *' : ''}</Label>
            <Input 
              id="telefoon" 
              value={formData.telefoon} 
              onChange={e => setFormData({ ...formData, telefoon: e.target.value })} 
              className="mt-1 border-stone-200 focus:border-stone-400 focus:ring-stone-400" 
              required={requiresTelephone}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        {type === "renderboek" && (
          <div>
            <Label className="text-stone-700 font-medium">Type Collection Lookbook *</Label>
            <RadioGroup value={renderbookType} onValueChange={setRenderbookType} className="mt-2" disabled={isSubmitting}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="digitaal" id="digitaal" />
                <Label htmlFor="digitaal" className="text-stone-700">Numérique</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fysiek" id="fysiek" />
                <Label htmlFor="fysiek" className="text-stone-700">Physique</Label>
              </div>
            </RadioGroup>
          </div>
        )}
        
        {requiresAddress && (
          <>
            <div>
              <Label htmlFor="straat" className="text-stone-700 font-medium">Rue + n° *</Label>
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
                <Label htmlFor="postcode" className="text-stone-700 font-medium">Code postal *</Label>
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
                <Label htmlFor="gemeente" className="text-stone-700 font-medium">Commune *</Label>
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
              {getOptinText()}
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
          {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
        </Button>
      </form>
    </DialogContent>
  );
};

export default CTAFormFr;
