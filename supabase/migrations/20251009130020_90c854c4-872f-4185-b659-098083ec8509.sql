-- Normalize existing type_bedrijf values (capitalize first letter, rest lowercase)
UPDATE form_submissions 
SET type_bedrijf = INITCAP(LOWER(type_bedrijf))
WHERE type_bedrijf IS NOT NULL;

-- Create function to normalize type_bedrijf
CREATE OR REPLACE FUNCTION normalize_type_bedrijf()
RETURNS TRIGGER AS $$
BEGIN
  -- Normalize type_bedrijf: capitalize first letter, rest lowercase
  IF NEW.type_bedrijf IS NOT NULL AND NEW.type_bedrijf != '' THEN
    NEW.type_bedrijf = INITCAP(LOWER(NEW.type_bedrijf));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically normalize type_bedrijf on insert/update
CREATE TRIGGER normalize_type_bedrijf_trigger
BEFORE INSERT OR UPDATE OF type_bedrijf ON form_submissions
FOR EACH ROW
EXECUTE FUNCTION normalize_type_bedrijf();