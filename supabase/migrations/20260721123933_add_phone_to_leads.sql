/*
# Add phone column to leads table

1. Modified Tables
- `leads`
  - Adds `phone` (text, nullable) — optional phone number for booking/visit requests.
  The booking form collects name, phone, and email so the clinic can schedule a visit.
2. Security
- No RLS changes — the existing anon INSERT policy already covers the new column.
3. Notes
- Single-tenant, no auth: the public booking form submits as anon.
- `phone` is nullable to keep the original lead-magnet forms working without changes.
- Idempotent: uses a DO block to avoid errors if re-run.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'phone'
  ) THEN
    ALTER TABLE leads ADD COLUMN phone text;
  END IF;
END $$;
