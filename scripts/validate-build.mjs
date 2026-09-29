import { buildEnvironment } from './env.mjs';
import { readSiteConfig } from '../src/config/site.ts';
import { readSupabaseConfig, backendRequired } from '../src/config/supabase.schema.ts';

const env = buildEnvironment();
const site = readSiteConfig(env);
if (backendRequired(env.SUPABASE_REQUIRED) || env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) readSupabaseConfig(env);
console.log('Build configuration OK; search indexing: ' + (site.indexable ? 'enabled' : 'disabled'));
