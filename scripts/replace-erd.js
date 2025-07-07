#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function replaceERD() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node replace-erd.js <html-file> <erd-file>');
    console.log('');
    console.log('Example:');
    console.log('  node replace-erd.js erd-explorer-standalone.html my-erd.mmd');
    console.log('');
    console.log('This will replace the ERD diagram in the standalone HTML file with the content from your ERD file.');
    process.exit(1);
  }

  const htmlFile = args[0];
  const erdFile = args[1];

  try {
    // Read the HTML file
    const htmlContent = await fs.readFile(htmlFile, 'utf-8');
    
    // Read the ERD file
    const erdContent = await fs.readFile(erdFile, 'utf-8');
    
    // Validate ERD content
    if (!erdContent.trim().startsWith('erDiagram')) {
      console.error('❌ Error: ERD file must start with "erDiagram"');
      process.exit(1);
    }
    
    // Find and replace the ERD_DIAGRAM variable assignment
    const erdVariablePattern = /window\.ERD_DIAGRAM = `[\s\S]*?`;/;
    const match = htmlContent.match(erdVariablePattern);
    
    if (!match) {
      console.error('❌ Error: Could not find window.ERD_DIAGRAM variable in HTML file');
      process.exit(1);
    }
    
    // Replace the ERD diagram content
    const newContent = htmlContent.replace(
      erdVariablePattern,
      `window.ERD_DIAGRAM = \`${erdContent}\`;`
    );
    
    // Write the updated HTML file
    await fs.writeFile(htmlFile, newContent, 'utf-8');
    
    console.log('✅ ERD diagram replaced successfully!');
    console.log(`📄 Updated file: ${htmlFile}`);
    console.log(`📊 ERD source: ${erdFile}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

replaceERD();