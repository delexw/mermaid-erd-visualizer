#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist-singlehtml');
const OUTPUT_FILE = path.join(__dirname, '../erd-explorer-standalone.html');

async function createSingleHTML() {
  try {
    console.log('Creating single HTML file...');
    
    // Read the main HTML file
    const htmlContent = await fs.readFile(path.join(DIST_DIR, 'index.html'), 'utf-8');
    
    // Find CSS and JS files
    const cssMatch = htmlContent.match(/href="([^"]+\.css)"/);
    const jsMatch = htmlContent.match(/src="([^"]+\.js)"/);
    
    if (!cssMatch || !jsMatch) {
      throw new Error('Could not find CSS or JS files in the built HTML');
    }
    
    const cssPath = cssMatch[1].replace(/^\//, ''); // Remove leading slash
    const jsPath = jsMatch[1].replace(/^\//, ''); // Remove leading slash
    
    // Read CSS and JS files
    const cssContent = await fs.readFile(path.join(DIST_DIR, cssPath), 'utf-8');
    const jsContent = await fs.readFile(path.join(DIST_DIR, jsPath), 'utf-8');
    
    // Create the single HTML file
    let singleHTML = htmlContent;
    
    // Replace CSS link with inline style
    singleHTML = singleHTML.replace(
      /<link rel="stylesheet" crossorigin href="[^"]+\.css">/,
      `<style>\n${cssContent}\n</style>`
    );
    
    // Replace JS script with inline script - use simple string replacement to avoid regex conflicts
    const scriptTag = `<script type="module" crossorigin src="${jsMatch[1]}"></script>`;
    
    // Default ERD diagram that will be easily replaceable
    const defaultERD = `erDiagram
    CUSTOMER {
        int id PK
        string name
        string email
    }
    
    ORDER {
        int id PK
        int customer_id FK
        decimal total
    }
    
    CUSTOMER ||--o{ ORDER : places`;
    
    const scriptReplacement = `<script type="module">
// ERD Diagram - Replace this variable with your ERD content
window.ERD_DIAGRAM = \`${defaultERD}\`;

${jsContent}
</script>`;
    
    // Use indexOf and substring to avoid regex conflicts
    const scriptIndex = singleHTML.indexOf(scriptTag);
    if (scriptIndex === -1) {
      throw new Error(`Could not find script tag: ${scriptTag}`);
    }
    
    singleHTML = singleHTML.substring(0, scriptIndex) + 
                 scriptReplacement + 
                 singleHTML.substring(scriptIndex + scriptTag.length);
    
    // Write the single HTML file
    await fs.writeFile(OUTPUT_FILE, singleHTML, 'utf-8');
    
    console.log(`✅ Single HTML file created: ${OUTPUT_FILE}`);
    
    // Get file size
    const stats = await fs.stat(OUTPUT_FILE);
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    console.log(`📦 File size: ${fileSizeInKB} KB`);
    
    console.log('\n🎉 Single HTML export complete!');
    console.log('\nTo replace the ERD diagram:');
    console.log('1. Use the replacement script: node scripts/replace-erd.js erd-explorer-standalone.html your-erd-file.mmd');
    console.log('2. OR manually edit: Find window.ERD_DIAGRAM = `...`; and replace the content between backticks');
    console.log('\nThe ERD diagram will automatically load when you open the HTML file.');
    
  } catch (error) {
    console.error('❌ Error creating single HTML file:', error.message);
    process.exit(1);
  }
}

createSingleHTML();