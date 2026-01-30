const fs = require('fs');
const path = require('path');

const srcDir = 'D:\\chips website\\assetsn';
const destDir = 'D:\\chips website\\public\\assets\\hero-sequence';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

try {
    const files = fs.readdirSync(srcDir);
    let count = 0;

    // Sort files to ensure correct sequence
    files.sort();

    files.forEach((file, index) => {
        if (file.toLowerCase().endsWith('.jpg')) {
            const fromPath = path.join(srcDir, file);
            // Normalize name to frame_XXX.jpg
            const paddedIndex = index.toString().padStart(3, '0');
            const toPath = path.join(destDir, `frame_${paddedIndex}.jpg`);

            fs.copyFileSync(fromPath, toPath);
            count++;
        }
    });
    console.log(`Successfully copied and normalized ${count} files.`);
} catch (e) {
    console.error('Error:', e);
}
