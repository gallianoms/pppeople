import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const extension = path.extname(filePath).toLowerCase();
    let modified = false;
    
    if (extension === '.html') {
      const newContent = content.replace(/<!--[\s\S]*?-->/g, '');
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    if (['.ts', '.js', '.scss', '.css'].includes(extension)) {
      let newContent = content.replace(/([^:])\/\/.*$/gm, '$1');
      
      newContent = newContent.replace(/\/\*[\s\S]*?\*\//g, '');
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Processed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(directory) {
  try {
    const files = fs.readdirSync(directory);
    const IGNORE_DIRS = new Set(['node_modules', '.git', '.angular', 'dist', 'assets']);
    
    for (const file of files) {
      if (file.startsWith('.')) continue;
      
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!IGNORE_DIRS.has(file)) {
          processDirectory(fullPath);
        }
      } else {
        const ext = path.extname(file).toLowerCase();
        if (['.ts', '.html', '.scss', '.css', '.js'].includes(ext)) {
          processFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error.message);
  }
}

const startDir = process.argv[2] || path.join(__dirname, '../src');
console.log('Removing comments from:', startDir);
processDirectory(startDir);
console.log('Done.');