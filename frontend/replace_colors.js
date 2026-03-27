const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\prajw\\OneDrive\\Desktop\\blue\\AI-Powered-Personal-Booking-Agent\\frontend';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '\\' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css') || file.endsWith('.svg')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const initial = content;

  // Replace case-insensitive #FF5F1F -> #0066FF
  content = content.replace(/#FF5F1F/gi, '#0066FF');
  // Replace rgb components
  content = content.replace(/255,\s*95,\s*31/g, '0, 102, 255');
  // Handle compact rgba
  content = content.replace(/255,95,31/g, '0,102,255');

  if (content !== initial) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
  }
});
