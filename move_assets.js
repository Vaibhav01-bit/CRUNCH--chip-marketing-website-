const fs = require('fs');
const path = require('path');

const srcDir = 'D:\\chips website\\assets';
const destDir = 'D:\\chips website\\public\\assets\\hero-sequence';

console.log('Src:', srcDir);
console.log('Dest:', destDir);

if (!fs.existsSync(destDir)) {
    console.log('Creating dest dir...');
    fs.mkdirSync(destDir, { recursive: true });
}

try {
    const files = fs.readdirSync(srcDir);
    let count = 0;
    files.forEach(file => {
        if (file.toLowerCase().endsWith('.jpg')) {
            const fromPath = path.join(srcDir, file);
            const toPath = path.join(destDir, file);
            fs.copyFileSync(fromPath, toPath);
            count++;
        }
    });
    console.log(`Successfully copied ${count} files.`);
} catch (e) {
    console.error('Error:', e);
}
