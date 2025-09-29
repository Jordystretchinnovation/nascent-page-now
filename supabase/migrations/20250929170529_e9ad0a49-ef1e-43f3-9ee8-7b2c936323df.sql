-- Create a function to automatically set sales status when kwaliteit is updated
CREATE OR REPLACE FUNCTION public.set_default_sales_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If kwaliteit is being set to a qualified status and sales_status is null/empty
  IF (NEW.kwaliteit IN ('Goed', 'Goed - klant', 'Redelijk')) 
     AND (NEW.sales_status IS NULL OR NEW.sales_status = '')
     AND (OLD.kwaliteit IS NULL OR OLD.kwaliteit = '' OR OLD.kwaliteit NOT IN ('Goed', 'Goed - klant', 'Redelijk')) THEN
    NEW.sales_status = 'Te contacteren';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set sales status when kwaliteit is updated
CREATE TRIGGER trigger_set_default_sales_status
  BEFORE UPDATE ON public.form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_default_sales_status();