-- Add all new agents to Studio HQ (6 specialized + 5 mobile team + 1 strict manager)
-- Run this in Supabase SQL Editor

INSERT INTO agents (id, name, role, status, task, progress, updated_at) VALUES
  -- Specialized agents
  ('ux-researcher', 'UX Researcher', 'UX Research', 'idle', 'UX research', 0, NOW()),
  ('data-analyst', 'Data Analyst', 'Data & Analytics', 'idle', 'Data analysis', 0, NOW()),
  ('security-eng', 'Security Eng', 'Security', 'idle', 'Security audit', 0, NOW()),
  ('content-strat', 'Content Strat', 'Content Strategy', 'idle', 'Content strategy', 0, NOW()),
  ('product-mgr', 'Product Mgr', 'Product Management', 'idle', 'Product management', 0, NOW()),
  ('teacher', 'Teacher', 'Skills Instructor', 'idle', 'Teaching skills', 0, NOW()),
  -- Mobile Team (Team Mobile)
  ('android-dev', 'Android Dev', 'Android (Kotlin/Compose)', 'idle', 'Learning mobile', 0, NOW()),
  ('ios-dev', 'iOS Dev', 'iOS (Swift/SwiftUI)', 'idle', 'Learning mobile', 0, NOW()),
  ('mobile-ui', 'Mobile UI', 'Mobile UX/UI', 'idle', 'Learning mobile', 0, NOW()),
  ('mobile-qa', 'Mobile QA', 'Mobile Testing', 'idle', 'Learning mobile', 0, NOW()),
  ('mobile-lead', 'Mobile Lead', 'Mobile Team Lead', 'idle', 'Leading training', 0, NOW()),
  -- Strict Manager
  ('strict-mgr', 'Strict Mgr', 'Operations Manager (Strict)', 'idle', 'Overseeing all agents', 0, NOW())
ON CONFLICT (id) DO NOTHING;
