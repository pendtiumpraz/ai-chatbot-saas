const fs = require('fs');
const path = require('path');
function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
                processDir(fullPath);
            }
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.php')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('\uFFFD')) {
                // Remove the corrupted unicode
                content = content.replace(/\uFFFD/g, '');
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed unicode: ${fullPath}`);
            }
        }
    }
}
processDir('d:/AI/privasimu/frontend/src');
processDir('d:/AI/privasimu/backend/app/Http');
processDir('d:/AI/privasimu/backend/app/Services');
console.log("Check complete.");
