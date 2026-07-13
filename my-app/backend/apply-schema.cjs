/**
 * Apply SQL Schema to Supabase
 * Run: node apply-schema.js
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.migrate' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function applySchema() {
    const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
    const rlsPath = path.join(__dirname, 'supabase', 'rls-policies.sql');
    
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const rlsSql = fs.readFileSync(rlsPath, 'utf8');
    
    console.log('Applying schema.sql...');
    
    // Execute schema SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: schemaSql }).single();
    
    if (error) {
        // rpc might not exist, try alternative approach
        console.log('Direct RPC failed, trying via query...');
        
        // Split by semicolons and execute each statement
        const statements = schemaSql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));
        
        let successCount = 0;
        let failCount = 0;
        
        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i] + ';';
            try {
                const { error: stmtError } = await supabase.rpc('exec_sql', { sql: stmt });
                if (stmtError) {
                    console.log(`  Statement ${i + 1} failed: ${stmtError.message}`);
                    console.log(`  SQL: ${stmt.substring(0, 100)}...`);
                    failCount++;
                } else {
                    successCount++;
                }
            } catch (e) {
                console.log(`  Statement ${i + 1} error: ${e.message}`);
                failCount++;
            }
        }
        
        console.log(`\nResults: ${successCount} succeeded, ${failCount} failed`);
        console.log('\nIMPORTANT: If many statements failed, please run the SQL manually:');
        console.log('1. Go to https://supabase.com/dashboard/project/mlvoeoyxqbocjwiofyop/sql/new');
        console.log('2. Paste the contents of supabase/schema.sql');
        console.log('3. Click "Run"');
        console.log('4. Then paste supabase/rls-policies.sql and run that too');
    } else {
        console.log('Schema applied successfully!');
    }
    
    // Try RLS policies
    console.log('\nApplying RLS policies...');
    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsSql });
    if (rlsError) {
        console.log('RLS policies need to be applied manually (same SQL Editor)');
    } else {
        console.log('RLS policies applied!');
    }
}

applySchema().catch(console.error);
