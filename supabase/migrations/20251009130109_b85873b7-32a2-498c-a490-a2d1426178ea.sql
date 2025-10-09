-- Fix search_path for normalize_type_bedrijf function
CREATE OR REPLACE FUNCTION normalize_type_bedrijf()
RETURNS TRIGGER AS $$
BEGIN
  -- Normalize type_bedrijf: capitalize first letter, rest lowercase
  IF NEW.type_bedrijf IS NOT NULL AND NEW.type_bedrijf != '' THEN
    NEW.type_bedrijf = INITCAP(LOWER(NEW.type_bedrijf));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- Fix search_path for set_default_sales_status function
CREATE OR REPLACE FUNCTION public.set_default_sales_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  -- If kwaliteit is being set to a qualified status and sales_status is null/empty
  IF (NEW.kwaliteit IN ('Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk', 'MQL')) 
     AND (NEW.sales_status IS NULL OR NEW.sales_status = '')
     AND (OLD.kwaliteit IS NULL OR OLD.kwaliteit = '' OR OLD.kwaliteit NOT IN ('Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk', 'MQL')) THEN
    NEW.sales_status = 'Te contacteren';
  END IF;
  
  RETURN NEW;
END;
$function$;