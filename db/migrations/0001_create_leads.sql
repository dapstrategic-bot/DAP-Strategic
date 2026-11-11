CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY,
  submission_id UUID NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254),
  service VARCHAR(80) NOT NULL,
  message VARCHAR(3000),
  status VARCHAR(20) NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'won', 'lost', 'spam')),
  source VARCHAR(80) NOT NULL DEFAULT 'website_contact_form',
  utm_source VARCHAR(200),
  utm_medium VARCHAR(200),
  utm_campaign VARCHAR(200),
  utm_term VARCHAR(200),
  utm_content VARCHAR(200),
  gclid VARCHAR(500),
  fbclid VARCHAR(500),
  landing_page VARCHAR(2000),
  referrer VARCHAR(2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS leads_campaign_idx
  ON leads (utm_source, utm_campaign, created_at DESC);

COMMENT ON TABLE leads IS 'Private contact requests submitted through dap.co.th';
