-- Drop the existing check constraint
ALTER TABLE public.form_submissions 
DROP CONSTRAINT IF EXISTS form_submissions_kwaliteit_check;

-- Add updated check constraint that includes MQL
ALTER TABLE public.form_submissions
ADD CONSTRAINT form_submissions_kwaliteit_check 
CHECK (kwaliteit IN ('Goed', 'Goed - klant', 'Goed - Klant', 'Redelijk', 'Slecht', 'MQL'));

-- Update the trigger function to include MQL as a qualified status
CREATE OR REPLACE FUNCTION public.set_default_sales_status()
RETURNS trigger
LANGUAGE plpgsql
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