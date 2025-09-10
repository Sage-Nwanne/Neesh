-- Test what extensions are available in Supabase
-- Copy and paste this into Supabase SQL Editor first

-- Check available extensions
SELECT name, default_version, installed_version, comment 
FROM pg_available_extensions 
WHERE name IN ('http', 'pg_net', 'pgsql-http')
ORDER BY name;

-- Check existing schemas
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name IN ('net', 'extensions', 'public')
ORDER BY schema_name;

-- Check if any HTTP functions already exist
SELECT routine_name, routine_schema, routine_type
FROM information_schema.routines 
WHERE routine_name ILIKE '%http%'
ORDER BY routine_schema, routine_name;
