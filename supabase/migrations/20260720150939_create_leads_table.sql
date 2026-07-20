/*
# Create leads table for lead-magnet capture

1. New Tables
- `leads`
  - `id` (uuid, primary key, auto-generated)
  - `email` (text, not null) — visitor's email address
  - `name` (text, nullable) — optional visitor name
  - `source` (text, not null) — which lead magnet form was used (e.g. 'modal', 'exit-intent', 'contact')
  - `message` (text, nullable) — optional message (for contact form)
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `leads`.
- Allow anon + authenticated INSERT only (public can submit leads, cannot read/update/delete).
- No SELECT/UPDATE/DELETE policies — leads are private to the owner (via dashboard/SQL only).
3. Notes
- Single-tenant, no auth: visitors submit leads anonymously via the anon key.
- Only INSERT is exposed to the anon role; reading leads is done through Supabase dashboard or service-role key.
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  source text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Only allow anonymous inserts (form submissions). No read/update/delete for anon.
DROP POLICY IF EXISTS "anon_insert_leads" ON leads;
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);
