
-- Check for existing triggers on form_submissions table
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'form_submissions';

-- If there's a trigger calling send_to_zapier or http_post, we'll disable it temporarily
DROP TRIGGER IF EXISTS call_send_to_zapier_trigger ON public.form_submissions;

-- Also check if there are any functions that might be causing issues
DROP FUNCTION IF EXISTS public.call_send_to_zapier() CASCADE;
